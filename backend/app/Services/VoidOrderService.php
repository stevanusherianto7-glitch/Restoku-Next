<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\WastageJournal;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class VoidOrderService
{
    private const VOIDABLE_STATUSES = ['pending', 'confirmed'];
    private const COOKED_STATUSES = ['cooking', 'ready', 'served'];

    public function voidOrder(
        string $orderId,
        string $tenantId,
        string $userId,
        string $reason,
        ?string $managerPin = null
    ): array {
        $order = Order::where('id', $orderId)
            ->where('tenant_id', $tenantId)
            ->with('items.menuItem')
            ->first();

        if (!$order) {
            throw new \RuntimeException('Order not found');
        }

        if ($order->status === 'completed') {
            throw new \RuntimeException('Cannot void completed order');
        }

        if ($order->status === 'cancelled') {
            throw new \RuntimeException('Order already cancelled');
        }

        $hasCookedItems = $order->items->contains(function ($item) {
            return in_array($item->cooking_status, self::COOKED_STATUSES);
        });

        $managerId = null;

        if ($hasCookedItems) {
            if (!$managerPin) {
                throw new \RuntimeException('Manager authorization required for cooked items');
            }

            $manager = $this->verifyManagerPin($tenantId, $managerPin);
            if (!$manager) {
                throw new \RuntimeException('Invalid manager PIN');
            }
            $managerId = $manager->id;
        }

        return DB::transaction(function () use ($order, $tenantId, $userId, $reason, $managerId, $hasCookedItems) {
            // 1. Update order status
            $order->update([
                'status' => 'cancelled',
                'payment_status' => $order->payment_status === 'paid' ? 'refunded' : 'failed',
            ]);

            // 2. Reset cooking status on order items
            $order->items()->update(['cooking_status' => 'pending']);

            // 3. Release reserved stock
            foreach ($order->items as $item) {
                MenuItem::where('id', $item->menu_item_id)
                    ->decrement('stock_reserved', $item->quantity);
            }

            // 4. Free up table
            if ($order->table_id) {
                $order->table()->update([
                    'status' => 'available',
                    'current_order_id' => null,
                ]);
            }

            // 5. Record wastage if items were cooked
            if ($hasCookedItems) {
                $this->recordWastage($order, $reason, $managerId);
            }

            // 6. Audit log
            AuditLog::create([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'action' => 'order_void',
                'entity' => 'order',
                'entity_id' => $order->id,
                'details' => [
                    'reason' => $reason,
                    'had_cooked_items' => $hasCookedItems,
                    'manager_id' => $managerId,
                ],
            ]);

            return [
                'success' => true,
                'order_id' => $order->id,
                'wastage_recorded' => $hasCookedItems,
            ];
        });
    }

    private function verifyManagerPin(string $tenantId, string $pin): ?User
    {
        return User::where('tenant_id', $tenantId)
            ->whereIn('role', ['admin', 'manager'])
            ->where('is_active', true)
            ->where('pin', $pin)
            ->first();
    }

    private function recordWastage(Order $order, string $reason, string $managerId): void
    {
        foreach ($order->items as $item) {
            if (in_array($item->cooking_status, self::COOKED_STATUSES)) {
                WastageJournal::create([
                    'tenant_id' => $order->tenant_id,
                    'order_id' => $order->id,
                    'menu_item_id' => $item->menu_item_id,
                    'item_name' => $item->name,
                    'quantity' => $item->quantity,
                    'unit_cost' => $item->unit_price,
                    'total_loss' => $item->total_price,
                    'reason' => $reason,
                    'confirmed_by' => $managerId,
                ]);
            }
        }
    }
}
