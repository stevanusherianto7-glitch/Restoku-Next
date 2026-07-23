<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    public function __construct(
        private PaymentWebhookService $webhookService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        try {
            // 1. Verify signature
            $signature = $request->header('X-Callback-Token', '');
            $timestamp = $request->header('X-Timestamp', '');

            if (!$this->webhookService->verifyWebhookSignature(
                $request->all(),
                $signature,
                $timestamp
            )) {
                Log::critical('[SECURITY] Invalid webhook signature', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                return response()->json(['error' => 'Invalid signature'], 401);
            }

            // 2. Process payment update
            $result = $this->webhookService->processWebhook($request->all());

            return response()->json([
                'status' => 'ok',
                'data' => $result,
            ]);
        } catch (\RuntimeException $e) {
            Log::error('[PAYMENT] Webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $request->all(),
            ]);

            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
