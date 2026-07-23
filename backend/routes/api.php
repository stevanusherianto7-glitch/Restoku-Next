<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentWebhookController;
use App\Http\Controllers\Api\V1\VoidOrderController;
use App\Http\Middleware\IdempotencyMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes — Restoku POS
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

// ============================================================
// Auth Routes
// ============================================================
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    });
});

// ============================================================
// Protected Routes (auth required)
// ============================================================
Route::middleware(['auth:sanctum'])->group(function () {

    // Orders
    Route::prefix('v1/orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('orders.index');
        Route::post('/', [OrderController::class, 'store'])
            ->middleware(IdempotencyMiddleware::class)
            ->name('orders.store');
        Route::get('/{id}', [OrderController::class, 'show'])->name('orders.show');
        Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');

        // Void Order (requires admin/manager)
        Route::post('/void', [VoidOrderController::class, '__invoke'])
            ->middleware('role:admin,manager')
            ->name('orders.void');
    });

    // Payments
    Route::prefix('v1/payments')->group(function () {
        Route::post('/create', [OrderController::class, 'createPayment'])->name('payments.create');
        Route::get('/status/{orderId}', [OrderController::class, 'getPaymentStatus'])->name('payments.status');
        Route::post('/refund/{orderId}', [OrderController::class, 'refundPayment'])->name('payments.refund');
    });

    // ... other routes (menus, tables, etc.)
});

// ============================================================
// Payment Webhook (no auth — verified via HMAC signature)
// ============================================================
Route::post('/v1/webhooks/payment', PaymentWebhookController::class)
    ->middleware('throttle:100,1')
    ->name('webhooks.payment');

// ============================================================
// Public Routes (no auth)
// ============================================================
Route::prefix('v1/public')->group(function () {
    Route::get('/menus/{restaurantId}', [OrderController::class, 'publicMenus'])->name('public.menus');
    Route::post('/orders', [OrderController::class, 'publicCreateOrder'])
        ->middleware(IdempotencyMiddleware::class)
        ->name('public.orders.store');
});
