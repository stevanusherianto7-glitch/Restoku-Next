<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\V1\PaymentWebhookController;
use App\Http\Controllers\Api\V1\VoidOrderController;
use App\Http\Middleware\IdempotencyMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes — Restoku POS
|--------------------------------------------------------------------------
|
| NOTE (architect, 2026-07-24): This file originally referenced
| App\Http\Controllers\Api\V1\AuthController and Api\V1\OrderController,
| which DO NOT exist on disk. The real controllers live at
| App\Http\Controllers\Auth\AuthController (login/me/logout/refresh) and
| App\Http\Controllers\OrderController (submitOrder/getOrderStatus/...).
| Their method contracts differ from the V1 blueprint below, so wiring them
| blindly would mean guessing the API contract. To avoid silent HTTP 500s,
| only routes whose handlers actually exist are enabled; the rest are
| commented with a TODO until the Api\V1\* controllers are implemented.
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

// ============================================================
// Auth Routes (handler exists: App\Http\Controllers\Auth\AuthController)
// ============================================================
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

    // TODO: AuthController has no register() method yet — enable when added.
    // Route::post('/register', [AuthController::class, 'register'])->name('auth.register');

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

    // TODO: Api\V1\OrderController does not exist. App\Http\Controllers\OrderController
    // exists but its methods (submitOrder/getOrderStatus/...) differ from this blueprint.
    // Enable these once Api\V1\OrderController is implemented.
    // Route::prefix('v1/orders')->group(function () {
    //     Route::get('/', [OrderController::class, 'index'])->name('orders.index');
    //     Route::post('/', [OrderController::class, 'store'])->middleware(IdempotencyMiddleware::class)->name('orders.store');
    //     Route::get('/{id}', [OrderController::class, 'show'])->name('orders.show');
    //     Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    //     Route::post('/void', [VoidOrderController::class, '__invoke'])->middleware('role:admin,manager')->name('orders.void');
    // });
    // Route::prefix('v1/payments')->group(function () {
    //     Route::post('/create', [OrderController::class, 'createPayment'])->name('payments.create');
    //     Route::get('/status/{orderId}', [OrderController::class, 'getPaymentStatus'])->name('payments.status');
    //     Route::post('/refund/{orderId}', [OrderController::class, 'refundPayment'])->name('payments.refund');
    // });

    // Void Order (handler exists: Api\V1\VoidOrderController)
    Route::post('/v1/orders/void', [VoidOrderController::class, '__invoke'])
        ->middleware('role:admin,manager')
        ->name('orders.void');
});

// ============================================================
// Payment Webhook (no auth — verified via HMAC signature; handler exists)
// ============================================================
Route::post('/v1/webhooks/payment', PaymentWebhookController::class)
    ->middleware('throttle:100,1')
    ->name('webhooks.payment');

// ============================================================
// Public Routes (no auth) — TODO: Api\V1\OrderController does not exist.
// ============================================================
// Route::prefix('v1/public')->group(function () {
//     Route::get('/menus/{restaurantId}', [OrderController::class, 'publicMenus'])->name('public.menus');
//     Route::post('/orders', [OrderController::class, 'publicCreateOrder'])
//         ->middleware(IdempotencyMiddleware::class)
//         ->name('public.orders.store');
// });
