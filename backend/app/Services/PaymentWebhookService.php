<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OutletTable;
use App\Models\MenuItem;
use App\Models\PaymentLog;
use App\Models\AuditLog;
use App\Models\IdempotencyRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentWebhookService
{
    private const PAYMENT_STATUS_MAP = [
        'pending' => 'pending',
        'capture' => 'processing',
        'settlement' => 'paid',
        'success' => 'paid',
        'expire' => 'expired',
        'deny' => 'failed',
        'refund' => 'refunded',
        'partial_refund' => 'refunded',
    ];

    public function verifyWebhookSignature(array $payload, string $signature, string $timestamp): bool
    {
        $secret = config('services.payment.webhook_secret');
        $payloadString = $timestamp . '.' . json_encode($payload);
        $expectedSignature = hash_hmac('sha256', $payloadString, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    public function processWebhook(array $payload): array
    {
        $orderId = $payload['order_id'] ?? null;
        $gatewayStatus = $payload['status'] ?? null;
        $finalAmount = $payload['final_amount'] ?? 0;
        $transactionId = $payload['transaction_id'] ?? null;

        if (!$orderId || !$gatewayStatus) {
            throw new \RuntimeException('Invalid webhook payload');
        }

        $order = Order::with('table')->find($orderId);
        if (!$order) {
            Log::error('[PAYMENT] Order not found', ['order_id' => $orderId]);
            throw new \RuntimeException('Order not found');
        }

        // 1. Amount verification (anti-fraud)
        $expectedAmount = (float) $order->total_amount;
        $receivedAmount = (float) $finalAmount;

        if (abs($expectedAmount - $receivedAmount) > 1) {
            Log::critical('[FRAUD] Amount mismatch', [
                'order_id' => $orderId,
                'expected' => $expectedAmount,
                'received' => $receivedAmount,
                'tenant_id' => $order->tenant_id,
            ]);

            AuditLog::create([
                'tenant_id' => $order->tenant_id,
                'action' => 'payment_fraud_attempt',
                'entity' => 'order',
                'entity_id' => $order->id,
                'details' => [
                    'expected_amount' => $expectedAmount,
                    'received_amount' => $receivedAmount,
                    'gateway_status' => $gatewayStatus,
                ],
            ]);

            throw new \RuntimeException('Amount mismatch - possible fraud');
        }

        // 2. Map status
        $paymentStatus = self::PAYMENT_STATUS_MAP[$gatewayStatus] ?? 'pending';

        // 3. Check idempotency
        if ($paymentStatus === $order->payment_status) {
            return ['status' => 'already_processed', 'order_id' => $order->id];
        }

        // 4. Process status update
        return $this->processPaymentUpdate($order, $paymentStatus, $payload);
    }

    private function processPaymentUpdate(
        Order $order,
        string $paymentStatus,
        array $payload
    ): array {
        return DB::transaction(function () use ($order, $paymentStatus, $payload) {
            switch ($paymentStatus) {
                case 'paid':
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'completed',
                        'paid_at' => now(),
                    ]);

                    if ($order->table_id) {
                        $order->table()->update([
                            'status' => 'available',
                            'current_order_id' => null,
                        ]);
                    }

                    // Release reserved stock (decrement actual stock)
                    foreach ($order->items as $item) {
                        MenuItem::where('id', $item->menu_item_id)
                            ->decrement('stock_reserved', $item->quantity);
                    }
                    break;

                case 'expired':
                case 'failed':
                    $order->update([
                        'payment_status' => $paymentStatus,
                        'status' => 'cancelled',
                    ]);

                    // Release reserved stock
                    foreach ($order->items as $item) {
                        MenuItem::where('id', $item->menu_item_id)
                            ->decrement('stock_reserved', $item->quantity);
                    }

                    if ($order->table_id) {
                        $order->table()->update([
                            'status' => 'available',
                            'current_order_id' => null,
                        ]);
                    }
                    break;

                case 'refunded':
                    $order->update([
                        'payment_status' => 'refunded',
                        'status' => 'cancelled',
                    ]);

                    foreach ($order->items as $item) {
                        MenuItem::where('id', $item->menu_item_id)
                            ->decrement('stock_reserved', $item->quantity);
                    }

                    if ($order->table_id) {
                        $order->table()->update([
                            'status' => 'available',
                            'current_order_id' => null,
                        ]);
                    }
                    break;
            }

            // Log payment
            PaymentLog::create([
                'tenant_id' => $order->tenant_id,
                'order_id' => $order->id,
                'gateway_transaction_id' => $payload['transaction_id'] ?? null,
                'status' => $payload['status'] ?? $paymentStatus,
                'amount' => $payload['final_amount'] ?? $order->total_amount,
                'payment_type' => $payload['payment_type'] ?? null,
                'raw_payload' => $payload,
            ]);

            // Audit log
            AuditLog::create([
                'tenant_id' => $order->tenant_id,
                'action' => 'payment_status_changed',
                'entity' => 'order',
                'entity_id' => $order->id,
                'details' => [
                    'from' => 'pending',
                    'to' => $paymentStatus,
                    'gateway_status' => $payload['status'] ?? null,
                ],
            ]);

            return [
                'status' => 'processed',
                'order_id' => $order->id,
                'payment_status' => $paymentStatus,
                'table_id' => $order->table_id,
            ];
        });
    }
}
