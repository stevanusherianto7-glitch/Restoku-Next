# Restoku — Integration Plan: Frontend ↔ Backend

**Version:** 1.0
**Date:** July 2026
**Status:** Active

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Data Communication Standards](#2-data-communication-standards)
3. [Authentication & Security](#3-authentication--security)
4. [Error Handling Strategy](#4-error-handling-strategy)
5. [Testing & Connection Verification](#5-testing--connection-verification)

---

## 1. System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                  │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Landing Page │  │    Admin     │  │  Menu Public │                  │
│  │  (Marketing) │  │  (POS/Dash)  │  │  (QR Guest)  │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            │                                             │
│                    React 18 + TypeScript                                 │
│                    Vite + Tailwind CSS                                   │
│                    Zustand + TanStack Query                              │
└────────────────────────────┼─────────────────────────────────────────────┘
                             │
                             │ HTTPS (REST API + WebSocket)
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Laravel 13 + PHP 8.2+                        │  │
│  │                                                                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │  │
│  │  │ Rate Limiter│  │   CORS     │  │  Sanctum   │                 │  │
│  │  │  (100/min) │  │  (Origin)  │  │   (JWT)    │                 │  │
│  │  └────────────┘  └────────────┘  └────────────┘                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                             │                                           │
│                    Hexagonal Architecture                               │
│                    (Ports & Adapters)                                   │
└────────────────────────────┼─────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                      │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ PostgreSQL 15│  │    Redis     │  │   Storage    │                  │
│  │  (Primary)   │  │  (Cache/     │  │  (S3/Local)  │                  │
│  │              │  │   Queue)     │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Separation of Concerns** | Frontend (UI) ↔ Backend (API) ↔ Database |
| **Hexagonal Architecture** | Domain ← Application ← Infrastructure ← Http |
| **Vertical Slicing** | Each feature is independent module |
| **Stateless Communication** | JWT tokens, no server-side session |
| **Fail-Safe Defaults** | Deny by default, explicit permissions |

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI components |
| **Build** | Vite 5 | Bundling, HMR |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **State (Client)** | Zustand 4 | Local state management |
| **State (Server)** | TanStack Query 5 | Server state, caching |
| **Backend** | Laravel 13 + PHP 8.2 | API server |
| **Database** | PostgreSQL 15 | Primary data store |
| **Cache** | Redis 7 | Caching, queue, sessions |
| **Queue** | Laravel Queue | Background jobs |
| **Realtime** | Laravel Reverb | WebSocket |
| **Storage** | S3 / Local | File uploads (images) |

---

## 2. Data Communication Standards

### API Base URL

```
Production:  https://api.restoku.id/v1
Staging:     https://staging-api.restoku.id/v1
Development: http://localhost:8000/api/v1
```

### Request/Response Format

#### Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  },
  "message": "Data retrieved successfully"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."],
      "password": ["The password must be at least 8 characters."]
    }
  }
}
```

### Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| **JSON keys** | snake_case | `created_at`, `menu_item_id` |
| **Database columns** | snake_case | `created_at`, `restaurant_id` |
| **PHP variables** | camelCase | `$createdAt`, `$restaurantId` |
| **PHP classes** | PascalCase | `OrderController`, `CreateOrderUseCase` |
| **TypeScript types** | PascalCase | `OrderItem`, `CreateOrderInput` |
| **TypeScript vars** | camelCase | `orderId`, `createdAt` |
| **API endpoints** | kebab-case | `/menu-items`, `/order-status` |
| **File names** | PascalCase (TS) | `OrderController.tsx` |
| **File names** | snake_case (PHP) | `order_repository.php` |

### HTTP Methods

| Method | Usage | Idempotent | Body |
|--------|-------|------------|------|
| `GET` | Retrieve data | Yes | No |
| `POST` | Create resource | No | Yes |
| `PUT` | Full update | Yes | Yes |
| `PATCH` | Partial update | Yes | Yes |
| `DELETE` | Remove resource | Yes | No |

### URL Patterns

```
# List (with pagination)
GET    /api/v1/orders?page=1&per_page=20&status=pending

# Detail
GET    /api/v1/orders/{id}

# Create
POST   /api/v1/orders
Body: { "items": [...], "table_number": 5 }

# Update
PUT    /api/v1/orders/{id}
Body: { "status": "confirmed" }

# Partial Update
PATCH  /api/v1/orders/{id}/status
Body: { "status": "preparing" }

# Delete
DELETE /api/v1/orders/{id}

# Nested Resource
GET    /api/v1/orders/{id}/items
POST   /api/v1/orders/{id}/items
```

### Date/Time Format

| Type | Format | Example |
|------|--------|---------|
| **Date** | `YYYY-MM-DD` | `2026-07-23` |
| **DateTime** | `YYYY-MM-DDTHH:mm:ssZ` | `2026-07-23T14:30:00Z` |
| **Time** | `HH:mm:ss` | `14:30:00` |
| **Timestamp** | Unix epoch (seconds) | `1753324200` |

### Currency (IDR)

```json
{
  "price": 15000,
  "currency": "IDR",
  "display": "Rp 15.000"
}
```

**Rule:** Always store as integer (no decimals). Client formats for display.

### Pagination

**Request:**
```
GET /api/v1/orders?page=2&per_page=20&sort=-created_at&status=pending
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "current_page": 2,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_more": true
  }
}
```

**Sort Syntax:**
- Ascending: `sort=created_at`
- Descending: `sort=-created_at`
- Multiple: `sort=-created_at,status`

### Filtering

```
# Exact match
GET /api/v1/orders?status=pending

# Range
GET /api/v1/orders?created_after=2026-07-01&created_before=2026-07-31

# Search
GET /api/v1/menus?search=nasi+goreng

# Filter by category
GET /api/v1/menus?category=makanan&is_available=true
```

### File Upload

**Request:**
```http
POST /api/v1/menus
Content-Type: multipart/form-data

{
  "name": "Nasi Goreng Spesial",
  "price": 25000,
  "category_id": "uuid",
  "image": <binary file>
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Nasi Goreng Spesial",
    "image_url": "https://storage.restoku.id/menus/abc123.jpg",
    "image_thumb": "https://storage.restoku.id/menus/abc123_thumb.jpg"
  }
}
```

**Constraints:**
- Max file size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Auto-generate thumbnail: 200x200px

---

## 3. Authentication & Security

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                                │
│                                                                  │
│  ┌──────────┐      POST /auth/login       ┌──────────────┐     │
│  │ Frontend │ ───────────────────────────► │   Backend    │     │
│  │          │   { email, password }        │              │     │
│  │          │                              │  Validate    │     │
│  │          │   ◄───────────────────────── │  credentials │     │
│  │          │   { token, refresh_token,   │              │     │
│  │          │     user }                   └──────────────┘     │
│  │          │                                                    │
│  │  Store   │                                                    │
│  │  tokens  │                                                    │
│  └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Token Management

| Token | Lifetime | Storage | Usage |
|-------|----------|---------|-------|
| **Access Token** | 12 hours | Memory (Zustand) | API requests |
| **Refresh Token** | 30 days | httpOnly cookie | Get new access token |

### Token Structure (JWT)

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "restaurant_id": "restaurant-uuid",
    "role": "owner",
    "iat": 1753324200,
    "exp": 1753367400
  }
}
```

### Request Authorization

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend Implementation

```typescript
// shared/infrastructure/http/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiClient(error.config); // retry
      }
      useAuthStore.getState().logout(); // redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Refresh Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH FLOW                            │
│                                                                  │
│  Request → 401 Unauthorized                                     │
│                                                                  │
│  ┌──────────┐   POST /auth/refresh      ┌──────────────┐       │
│  │ Frontend │ ─────────────────────────► │   Backend    │       │
│  │          │   (cookie: refresh_token)  │              │       │
│  │          │                            │  Validate    │       │
│  │          │   ◄─────────────────────── │  refresh tok │       │
│  │          │   { new_access_token }     │              │       │
│  │          │                            └──────────────┘       │
│  │  Update   │                                                   │
│  │  store    │                                                   │
│  │  Retry    │                                                   │
│  │  request  │                                                   │
│  └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Owner** | Full access (all CRUD, settings, billing, reports) |
| **Manager** | Manage staff, inventory, reports, menu, orders |
| **Cashier** | POS, orders, basic reports |
| **Kitchen** | View orders, update order status |
| **Guest** | View menu, place QR orders (public) |

### Permission Matrix

| Feature | Owner | Manager | Cashier | Kitchen | Guest |
|---------|-------|---------|---------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ | ❌ | ❌ |
| POS | ✅ | ✅ | ✅ | ❌ | ❌ |
| Menu Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Inventory | ✅ | ✅ | ❌ | ❌ | ❌ |
| Staff Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ (basic) | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Menu Public | ❌ | ❌ | ❌ | ❌ | ✅ |

### Security Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 5 requests | 1 minute |
| `POST /auth/register` | 3 requests | 1 hour |
| `POST /public/orders` | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Public menu | 60 requests | 1 minute |

**Response when limited:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 30
  }
}
```

---

## 4. Error Handling Strategy

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Validation error |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Duplicate resource |
| **413** | Payload Too Large | File too big |
| **422** | Unprocessable Entity | Business logic error |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Maintenance mode |

### Error Codes (Application-Level)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": { ... }
  }
}
```

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | Access token expired |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `ALREADY_EXISTS` | 409 | Duplicate resource |
| `OUT_OF_STOCK` | 422 | Menu item unavailable |
| `RESTAURANT_CLOSED` | 422 | Restaurant not accepting orders |
| `INVALID_TABLE` | 422 | Table number invalid |
| `FILE_TOO_LARGE` | 413 | Upload exceeds limit |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Unexpected error |

### Frontend Error Handling

```typescript
// shared/infrastructure/http/errorHandler.ts
import { AxiosError } from "axios";

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  retry_after?: number;
}

export function handleApiError(error: AxiosError<{ error: ApiError }>): never {
  const status = error.response?.status;
  const apiError = error.response?.data?.error;

  switch (status) {
    case 401:
      // Redirect to login
      useAuthStore.getState().logout();
      throw new Error("Sesi telah berakhir. Silakan login kembali.");

    case 403:
      throw new Error("Anda tidak memiliki akses ke fitur ini.");

    case 404:
      throw new Error("Data tidak ditemukan.");

    case 422:
      // Validation error — return details
      throw new ValidationError(apiError?.details || {});

    case 429:
      throw new RateLimitError(apiError?.retry_after || 60);

    default:
      throw new Error(apiError?.message || "Terjadi kesalahan. Silakan coba lagi.");
  }
}
```

### Toast Notifications

```typescript
// Contoh penggunaan di component
import toast from "react-hot-toast";

async function handleCreateOrder(data: CreateOrderInput) {
  try {
    await createOrder(data);
    toast.success("Pesanan berhasil dibuat!");
  } catch (error) {
    if (error instanceof ValidationError) {
      // Show field errors
      Object.entries(error.details).forEach(([field, messages]) => {
        toast.error(`${field}: ${messages.join(", ")}`);
      });
    } else {
      toast.error(error.message);
    }
  }
}
```

### Backend Error Response

```php
<?php
// app/Exceptions/Handler.php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    public function register(): void
    {
        $this->renderable(function (ModelNotFoundException $e, $request) {
            return response()->json([
                "success" => false,
                "error" => [
                    "code" => "NOT_FOUND",
                    "message" => "Resource not found",
                ],
            ], 404);
        });

        $this->renderable(function (ValidationException $e, $request) {
            return response()->json([
                "success" => false,
                "error" => [
                    "code" => "VALIDATION_ERROR",
                    "message" => "The given data was invalid.",
                    "details" => $e->errors(),
                ],
            ], 400);
        });
    }
}
```

---

## 5. Testing & Connection Verification

### Pre-Flight Checklist

```
□ Backend server running (php artisan serve)
□ Frontend server running (npm run dev)
□ Database connected (php artisan migrate)
□ Redis running (for queue/cache)
□ Environment variables configured (.env)
□ CORS configured for frontend origin
□ API URL matches frontend config
```

### API Health Check

**Request:**
```http
GET /api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-23T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "connected",
    "queue": "running"
  }
}
```

### Testing Steps

#### Step 1: Test Backend API (Postman/Thunder Client)

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@restoku.id", "password": "password"}'

# Get menus (with token)
curl http://localhost:8000/api/v1/menus \
  -H "Authorization: Bearer {token}"
```

#### Step 2: Test Frontend → Backend Connection

```typescript
// src/shared/infrastructure/http/__tests__/apiClient.test.ts
import { apiClient } from "../apiClient";

describe("API Client", () => {
  it("should connect to backend", async () => {
    const response = await apiClient.get("/health");
    expect(response.data.status).toBe("ok");
  });

  it("should return 401 without token", async () => {
    try {
      await apiClient.get("/orders");
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  it("should login and get token", async () => {
    const response = await apiClient.post("/auth/login", {
      email: "admin@restoku.id",
      password: "password",
    });
    expect(response.data.data.token).toBeDefined();
  });
});
```

#### Step 3: Test Authentication Flow

```typescript
// src/features/auth/__tests__/auth.integration.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAuthViewModel } from "../ui/viewmodels/useAuthViewModel";

describe("Auth Integration", () => {
  it("should login and store token", async () => {
    const { result } = renderHook(() => useAuthViewModel());

    await act(async () => {
      await result.current.handleLogin("admin@restoku.id", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it("should logout and clear token", async () => {
    const { result } = renderHook(() => useAuthViewModel());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

#### Step 4: Test CRUD Operations

```typescript
// src/features/menu/__tests__/menu.integration.test.ts
import { apiClient } from "@shared/infrastructure/http/apiClient";

describe("Menu Integration", () => {
  let token: string;
  let menuId: string;

  beforeAll(async () => {
    const login = await apiClient.post("/auth/login", {
      email: "admin@restoku.id",
      password: "password",
    });
    token = login.data.data.token;
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  });

  it("should create menu", async () => {
    const response = await apiClient.post("/menus", {
      name: "Nasi Goreng",
      price: 25000,
      category_id: "category-uuid",
    });
    menuId = response.data.data.id;
    expect(response.status).toBe(201);
  });

  it("should get menu", async () => {
    const response = await apiClient.get(`/menus/${menuId}`);
    expect(response.data.data.name).toBe("Nasi Goreng");
  });

  it("should update menu", async () => {
    const response = await apiClient.put(`/menus/${menuId}`, {
      name: "Nasi Goreng Spesial",
      price: 30000,
    });
    expect(response.data.data.name).toBe("Nasi Goreng Spesial");
  });

  it("should delete menu", async () => {
    const response = await apiClient.delete(`/menus/${menuId}`);
    expect(response.status).toBe(204);
  });
});
```

#### Step 5: Test Real-time (WebSocket)

```typescript
// src/features/pos/__tests__/realtime.integration.test.ts
import Echo from "laravel-echo";

describe("Realtime Integration", () => {
  it("should receive order updates", (done) => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_REVERB_APP_KEY,
    });

    echo.channel("orders").listen("OrderCreated", (event) => {
      expect(event.order).toBeDefined();
      done();
    });

    // Trigger from backend
    // ...
  });
});
```

#### Step 6: Test Public Menu (QR)

```typescript
// src/features/menu-public/__tests__/menu-public.integration.test.ts
import { apiClient } from "@shared/infrastructure/http/apiClient";

describe("Public Menu Integration", () => {
  it("should fetch public menu without auth", async () => {
    const response = await apiClient.get("/public/menu/{restaurantId}");
    expect(response.data.data.menus).toBeDefined();
  });

  it("should create public order", async () => {
    const response = await apiClient.post("/public/orders", {
      restaurant_id: "restaurant-uuid",
      table_number: 5,
      items: [{ menu_id: "menu-uuid", quantity: 2 }],
    });
    expect(response.status).toBe(201);
    expect(response.data.data.order_id).toBeDefined();
  });
});
```

### Automated Testing Script

```bash
#!/bin/bash
# scripts/test-integration.sh

echo "=== Restoku Integration Tests ==="

# 1. Health check
echo "[1/6] Testing health endpoint..."
curl -sf http://localhost:8000/api/v1/health > /dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Backend is running"
else
  echo "  ❌ Backend is not running"
  exit 1
fi

# 2. Database connection
echo "[2/6] Testing database connection..."
php artisan migrate:status > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ Database connected"
else
  echo "  ❌ Database connection failed"
  exit 1
fi

# 3. Auth flow
echo "[3/6] Testing authentication..."
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restoku.id","password":"password"}' | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "  ✅ Authentication works"
else
  echo "  ❌ Authentication failed"
  exit 1
fi

# 4. CRUD operations
echo "[4/6] Testing CRUD operations..."
MENU_ID=$(curl -s -X POST http://localhost:8000/api/v1/menus \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Menu","price":10000}' | jq -r '.data.id')

if [ "$MENU_ID" != "null" ] && [ -n "$MENU_ID" ]; then
  echo "  ✅ CRUD operations work"
  curl -s -X DELETE "http://localhost:8000/api/v1/menus/$MENU_ID" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
else
  echo "  ❌ CRUD operations failed"
fi

# 5. Public API
echo "[5/6] Testing public API..."
curl -sf http://localhost:8000/api/v1/public/menu/test-restaurant > /dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Public API works"
else
  echo "  ❌ Public API failed"
fi

# 6. Frontend build
echo "[6/6] Testing frontend build..."
cd frontend && npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ Frontend builds successfully"
else
  echo "  ❌ Frontend build failed"
  exit 1
fi

echo ""
echo "=== All tests passed! ==="
```

### Postman Collection

Import `docs/postman/restoku-collection.json` for complete API testing.

**Collection includes:**
- Health check
- Auth (login, logout, refresh)
- Menu CRUD
- Order CRUD
- Public menu & orders
- Table management
- Reports

### Environment Variables

```env
# .env.testing
VITE_API_URL=http://localhost:8000/api/v1
VITE_REVERB_APP_KEY=local-key
VITE_WS_HOST=localhost
VITE_WS_PORT=8080
```

---

## Appendix

### API Versioning Strategy

```
/api/v1/orders     ← Current version
/api/v2/orders     ← Breaking changes
```

- Version in URL path
- Backward compatible changes: same version
- Breaking changes: new version
- Support old version for 6 months after new version

### Deprecation Policy

1. Mark endpoint as deprecated in response header
2. Add `Deprecation` header with date
3. Add `Sunset` header with removal date
4. Log usage of deprecated endpoints
5. Remove after sunset date

### Changelog Format

```markdown
## [1.2.0] - 2026-07-23

### Added
- POST /api/v1/public/orders (QR ordering)
- GET /api/v1/menus/{id}/analytics

### Changed
- GET /api/v1/orders now supports `sort` parameter

### Deprecated
- GET /api/v1/old-endpoint (use /api/v1/new-endpoint)

### Removed
- DELETE /api/v1/legacy (removed)

### Fixed
- Fixed pagination issue in menu list
```
