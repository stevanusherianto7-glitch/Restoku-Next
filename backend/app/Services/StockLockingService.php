<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\MenuItem;
use App\Models\OutletTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class StockLockingService
{
    private const LOCK_TTL = 10;
    private const MAX_RETRIES = 3;
    private const TAX_RATE = 0.11;

    public function createOrderWithPessimisticLock(
        string $tenantId,
        string $tableId,
        array $items,
        string $idempotencyKey,
        ?string $userId = null,
        ?string $customerName = null,
        ?string $notes = null
    ): array {
        return DB::transaction(function () use (
            $tenantId, $tableId, $items, $idempotencyKey,
            $userId, $customerName, $notes
        ) {
            // 1. Check idempotency
            $existing = Order::where('idempotency_key', $idempotencyKey)->first();
            if ($existing) {
                return ['success' => true, 'order' => $existing, 'idempotent' => true];
            }

            // 2. Lock menu items with SELECT FOR UPDATE
            $menuItems = DB::select(
                'SELECT id, name, price, stock_quantity, stock_reserved
                 FROM menu_items
                 WHERE id = ANY(?::uuid[]) AND tenant_id = ?
                 FOR UPDATE',
                [array_column($items, 'menu_item_id'), $tenantId]
            );

            $menuItemMap = collect($menuItems)->keyBy('id');

            // 3. Validate stock availability
            foreach ($items as $item) {
                $menuItem = $menuItemMap->get($item['menu_item_id']);

                if (!$menuItem) {
                    throw new \RuntimeException("Menu item {$item['menu_item_id']} not found");
                }

                $availableStock = $menuItem->stock_quantity - $menuItem->stock_reserved;

                if ($availableStock < $item['quantity']) {
                    throw new \RuntimeException(
                        "Insufficient stock for {$menuItem->name}: " .
                        "available {$availableStock}, requested {$item['quantity']}"
                    );
                }
            }

            // 4. Reserve stock
            foreach ($items as $item) {
                DB::table('menu_items')
                    ->where('id', $item['menu_item_id'])
                    ->increment('stock_reserved', $item['quantity']);
            }

            // 5. Calculate totals
            $subtotal = 0;
            foreach ($items as &$item) {
                $menuItem = $menuItemMap->get($item['menu_item_id']);
                $item['unit_price'] = $menuItem->price;
                $item['total_price'] = $menuItem->price * $item['quantity'];
                $item['name'] = $menuItem->name;
                $subtotal += $item['total_price'];
            }
            unset($item);

            $taxAmount = $subtotal * self::TAX_RATE;
            $totalAmount = $subtotal + $taxAmount;

            // 6. Generate order number
            $orderNumber = $this->generateOrderNumber($tenantId);

            // 7. Create order
            $order = Order::create([
                'tenant_id' => $tenantId,
                'table_id' => $tableId,
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'status' => 'confirmed',
                'payment_status' => 'pending',
                'source' => 'pos',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'customer_name' => $customerName,
                'notes' => $notes,
                'idempotency_key' => $idempotencyKey,
            ]);

            // 8. Create order items
            foreach ($items as $item) {
                $order->items()->create([
                    'menu_item_id' => $item['menu_item_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'variant' => $item['variant'] ?? null,
                    'notes' => $item['notes'] ?? null,
                    'cooking_status' => 'pending',
                ]);
            }

            // 9. Update table
            OutletTable::where('id', $tableId)->update([
                'status' => 'occupied',
                'current_order_id' => $order->id,
            ]);

            return ['success' => true, 'order' => $order->load('items')];
        });
    }

    public function createOrderWithOptimisticLock(
        string $tenantId,
        string $tableId,
        array $items,
        string $idempotencyKey,
        ?string $userId = null,
        ?string $customerName = null,
        ?string $notes = null
    ): array {
        for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
            try {
                return $this->createOrderWithPessimisticLock(
                    $tenantId, $tableId, $items, $idempotencyKey,
                    $userId, $customerName, $notes
                );
            } catch (\RuntimeException $e) {
                if (str_contains($e->getMessage(), 'Insufficient stock') && $attempt < self::MAX_RETRIES - 1) {
                    usleep(50000 * (2 ** $attempt)); // 50ms exponential backoff
                    continue;
                }
                throw $e;
            }
        }

        throw new \RuntimeException('Failed to create order after retries');
    }

    private function generateOrderNumber(string $tenantId): string
    {
        $date = now()->format('Ymd');
        $sequence = Redis::incr("order_seq:{$tenantId}:{$date}");
        return sprintf('ORD-%s-%05d', $date, $sequence);
    }
}
