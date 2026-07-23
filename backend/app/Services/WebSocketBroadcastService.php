<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WebSocketBroadcastService
{
    private mixed $io;

    public function __construct()
    {
        // In production, this would be injected via Laravel Reverb or Soketi
        // $this->io = app('socket.io');
    }

    public function broadcastPaymentSuccess(
        string $tenantId,
        string $tableId,
        string $orderId,
        float $amount
    ): void {
        $event = [
            'orderId' => $orderId,
            'tableId' => $tableId,
            'amount' => $amount,
            'timestamp' => now()->toISOString(),
            'message' => sprintf(
                'Meja %s lunas - Rp %s',
                $tableId,
                number_format($amount, 0, ',', '.')
            ),
        ];

        // Broadcast to tenant dashboard (POS kasir)
        $this->broadcastToRoom("tenant:{$tenantId}:dashboard", 'payment:success', $event);

        // Broadcast to table room
        $this->broadcastToRoom("table:{$tableId}", 'payment:success', $event);

        Log::info('[WS] Payment success broadcast', [
            'tenant_id' => $tenantId,
            'table_id' => $tableId,
            'order_id' => $orderId,
        ]);
    }

    public function broadcastNewOrder(
        string $tenantId,
        string $orderId,
        string $tableNumber,
        array $items
    ): void {
        $event = [
            'orderId' => $orderId,
            'tableNumber' => $tableNumber,
            'items' => $items,
            'timestamp' => now()->toISOString(),
            'sound' => 'order-bell',
        ];

        $this->broadcastToRoom("tenant:{$tenantId}:dashboard", 'order:new', $event);
    }

    public function broadcastOrderReady(
        string $tenantId,
        string $tableId,
        string $orderId
    ): void {
        $event = [
            'orderId' => $orderId,
            'tableId' => $tableId,
            'timestamp' => now()->toISOString(),
        ];

        $this->broadcastToRoom("tenant:{$tenantId}:dashboard", 'order:ready', $event);
        $this->broadcastToRoom("table:{$tableId}", 'order:ready', $event);
    }

    public function broadcastStockAlert(
        string $tenantId,
        string $menuItemId,
        string $itemName,
        int $currentStock
    ): void {
        $event = [
            'menuItemId' => $menuItemId,
            'itemName' => $itemName,
            'currentStock' => $currentStock,
            'timestamp' => now()->toISOString(),
            'severity' => $currentStock <= 0 ? 'critical' : 'warning',
        ];

        $this->broadcastToRoom("tenant:{$tenantId}:dashboard", 'stock:low', $event);
    }

    public function broadcastCartSync(string $tableId, array $cart): void
    {
        $this->broadcastToRoom("table:{$tableId}", 'cart:sync', $cart);
    }

    private function broadcastToRoom(string $room, string $event, array $data): void
    {
        // In production with Laravel Reverb:
        // broadcast()->to($room)->emit($event, $data);

        // With Redis pub/sub:
        Cache::tags(['ws-broadcast'])->put(
            "broadcast:{$room}:{$event}",
            $data,
            now()->addSeconds(5)
        );

        Log::debug('[WS] Broadcast', ['room' => $room, 'event' => $event]);
    }
}
