# API Documentation — Restoku Backend

**Base URL:** `http://localhost:8000/api`
**Authentication:** Bearer Token (Laravel Sanctum)

> ⚠️ **STATUS 2026-07-24 — PENTING.** Dokumen ini direvisi agar **hanya mendokumentasikan endpoint yang benar-benar terdaftar** di `php artisan route:list` (Laravel 13.19). Banyak endpoint yang sebelumnya didokumentasikan di sini (`/menus`, `/orders`, `/tables`, `/dashboard`, `/reports/*`, `/public/menu`, dll) **BELUM DIIMPLEMENTASIKAN** — `routes/api.php` mereferensi `App\Http\Controllers\Api\V1\OrderController` yang **tidak ada di disk**. Route order/payment/public saat ini dikomentari (TODO) di `routes/api.php` sampai controller `Api\V1\*` ditulis.
>
> Jalankan `php artisan route:list` untuk melihat sumber kebenaran.

---

## Routes Yang Aktif Sekarang (terverifikasi `route:list`)

| Method | URI | Name | Handler | Auth |
|--------|-----|------|---------|------|
| GET | `/api/health` | — | inline closure | No |
| POST | `/api/v1/auth/login` | auth.login | `Auth\AuthController@login` | No |
| POST | `/api/v1/auth/logout` | auth.logout | `Auth\AuthController@logout` | Sanctum |
| GET | `/api/v1/auth/me` | auth.me | `Auth\AuthController@me` | Sanctum |
| POST | `/api/v1/auth/refresh` | auth.refresh | `Auth\AuthController@refresh` | Sanctum |
| POST | `/api/v1/orders/void` | orders.void | `Api\V1\VoidOrderController@__invoke` | Sanctum + role admin/manager |
| POST | `/api/v1/webhooks/payment` | webhooks.payment | `Api\V1\PaymentWebhookController@__invoke` | No (HMAC) |
| GET | `/up` | — | Laravel health | No |

### POST /api/v1/auth/login
Login user dan dapatkan access token.

**Request:**
```json
{ "email": "user@example.com", "password": "password" }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "...", "email": "...", "role": "owner|manager|kasir|kitchen|waiter", "tenant_id": "uuid", "outlet_id": "uuid" },
    "token": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /api/v1/auth/logout
**Headers:** `Authorization: Bearer ***` → `{ "success": true, "message": "Logged out successfully" }`

### POST /api/v1/auth/refresh
**Headers:** `Authorization: Bearer ***` → `{ "success": true, "data": { "token": "new_access_token" } }`

### GET /api/v1/auth/me
**Headers:** `Authorization: Bearer ***` → profil user saat ini.

### POST /api/v1/orders/void
Void order (hanya admin/manager). Verified via Sanctum + `role:admin,manager` middleware.
**Headers:** `Authorization: Bearer ***`

### POST /api/v1/webhooks/payment
Webhook pembayaran eksternal (Midtrans/Xendit). **Tidak butuh auth** — diverifikasi via signature HMAC. Throttled `100,1`.

### GET /api/health
```json
{ "status": "ok", "timestamp": "2026-..." }
```

---

## ENDPOINT BELUM DIIMPLEMENTASIKAN (TODO — controller `Api\V1\OrderController` tidak ada)

Route berikut **dikomentari** di `routes/api.php` dan akan 500 jika di-enable tanpa controller:
- `GET|POST /api/v1/orders` (index, store)
- `GET|PUT /api/v1/orders/{id}` (show, updateStatus)
- `POST /api/v1/payments/create|status/{orderId}|refund/{orderId}`
- `GET /api/v1/public/menus/{restaurantId}`, `POST /api/v1/public/orders`

Kontrak request/response untuk endpoint di atas **belum final** — lihat PRD Epic 2/3/5 untuk rencana. Jangan gunakan dokumentasi versi lama (endpoint `/menus`, `/tables`, `/dashboard`, `/reports/sales`) karena controller-nya belum ada di repo ini.

---

## Error Responses
```json
{ "success": false, "message": "Unauthenticated" }   // 401
{ "success": false, "message": "...", "errors": {} } // 400/422
```
