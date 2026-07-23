<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\PaymentWebhookController;
use App\Http\Controllers\Api\V1\VoidOrderController;

// Payment Webhook (tanpa auth — dari payment gateway)
Route::post('/webhooks/payment', PaymentWebhookController::class)
    ->name('webhooks.payment');

// Void Order (butuh auth + role admin/manager)
Route::middleware(['auth:sanctum', 'role:admin,manager'])->group(function () {
    Route::post('/orders/void', VoidOrderController::class)
        ->name('orders.void');
});

/*
  Contoh penggunaan di routes/api.php:

  use App\Http\Controllers\Api\V1\PaymentWebhookController;
  use App\Http\Controllers\Api\V1\VoidOrderController;

  // Payment Webhook (tanpa auth)
  Route::post('/v1/webhooks/payment', PaymentWebhookController::class)
      ->middleware('throttle:100,1')
      ->name('webhooks.payment');

  // Void Order (butuh auth + role)
  Route::middleware(['auth:sanctum'])->group(function () {
      Route::post('/v1/orders/void', VoidOrderController::class)
          ->middleware('role:admin,manager')
          ->name('orders.void');
  });

  // Create Order dengan Stock Locking
  Route::middleware(['auth:sanctum'])->group(function () {
      Route::post('/v1/orders', [OrderController::class, 'store'])
          ->middleware('idempotency')
          ->name('orders.store');
  });
*/
