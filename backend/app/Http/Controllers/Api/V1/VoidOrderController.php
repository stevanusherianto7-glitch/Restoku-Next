<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\VoidOrderService;
use App\Services\StockLockingService;
use App\Services\PaymentWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VoidOrderController extends Controller
{
    public function __construct(
        private VoidOrderService $voidOrderService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|uuid',
            'reason' => 'required|string|min:3',
            'manager_pin' => 'required_with:cooked_items|string',
        ]);

        try {
            $result = $this->voidOrderService->voidOrder(
                orderId: $request->input('order_id'),
                tenantId: $request->user()->tenant_id,
                userId: $request->user()->id,
                reason: $request->input('reason'),
                managerPin: $request->input('manager_pin'),
            );

            return response()->json([
                'success' => true,
                'message' => 'Order voided successfully',
                'data' => $result,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'error' => ['message' => $e->getMessage()],
            ], 400);
        }
    }
}
