# API Documentation — Restoku Backend

**Base URL:** `http://localhost:8000/api`

**Authentication:** Bearer Token (Laravel Sanctum)

---

## Authentication

### POST /auth/login
Login user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "owner|manager|cashier|kitchen",
      "tenant_id": "uuid",
      "outlet_id": "uuid"
    },
    "token": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /auth/logout
Logout user and revoke token.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/refresh
Refresh access token.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token"
  }
}
```

---

## Menu Management

### GET /menus
Get list of menus with pagination and filters.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number): Page number
- `per_page` (number): Items per page
- `category` (string): Filter by category
- `search` (string): Search by name
- `status` (string): Filter by status (active|inactive)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nasi Goreng",
      "description": "Nasi goreng spesial",
      "price": 25000,
      "category_id": "uuid",
      "category": "makanan",
      "image_url": "https://...",
      "is_available": true,
      "is_popular": true,
      "prep_time": 15,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### GET /menus/{id}
Get single menu item.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nasi Goreng",
    "description": "Nasi goreng spesial",
    "price": 25000,
    "category_id": "uuid",
    "category": "makanan",
    "image_url": "https://...",
    "is_available": true,
    "is_popular": true,
    "prep_time": 15
  }
}
```

### POST /menus
Create new menu item.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Nasi Goreng Spesial",
  "description": "Nasi goreng dengan telur dan sosis",
  "price": 30000,
  "category_id": "uuid",
  "image_url": "https://...",
  "is_available": true,
  "is_popular": false,
  "prep_time": 20
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Menu created successfully"
}
```

### PUT /menus/{id}
Update menu item.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Nasi Goreng Updated",
  "price": 35000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Menu updated successfully"
}
```

### DELETE /menus/{id}
Delete menu item.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Menu deleted successfully"
}
```

---

## Orders

### GET /orders
Get list of orders.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` (string): Filter by status
- `table_number` (number): Filter by table
- `date` (string): Filter by date (Y-m-d)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "table_number": 5,
      "items": [
        {
          "menu_id": "uuid",
          "menu_name": "Nasi Goreng",
          "quantity": 2,
          "price": 25000,
          "variant": "Pedas",
          "notes": "Tanpa bawang",
          "subtotal": 50000
        }
      ],
      "status": "pending",
      "total": 50000,
      "notes": "Pesanan dari meja 5",
      "source": "qr",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /orders
Create new order.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "table_number": 5,
  "items": [
    {
      "menu_id": "uuid",
      "quantity": 2,
      "variant": "Pedas",
      "notes": "Tanpa bawang"
    }
  ],
  "notes": "Pesanan dari meja 5",
  "source": "pos"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Order created successfully"
}
```

### PATCH /orders/{id}/status
Update order status.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Order status updated"
}
```

---

## Tables

### GET /tables
Get list of tables.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "VIP 1",
      "number": 1,
      "qr_url": "https://...",
      "is_active": true
    }
  ]
}
```

### POST /tables
Create new table.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "VIP 2",
  "number": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Table created successfully"
}
```

### POST /tables/qr
Generate QR codes for tables.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "table_ids": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "table_id": "uuid",
      "qr_url": "https://..."
    }
  ]
}
```

---

## Dashboard

### GET /dashboard
Get dashboard statistics.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "today_sales": 1500000,
      "today_orders": 45,
      "active_orders": 8,
      "pending_orders": 3,
      "low_stock_count": 2,
      "sales_change": 12.5,
      "orders_change": 8.3
    },
    "recent_orders": [ ... ],
    "top_menus": [ ... ],
    "hourly_sales": [ ... ]
  }
}
```

---

## Reports

### GET /reports/sales
Get sales report.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period` (string): daily|weekly|monthly
- `date` (string): Date (Y-m-d)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "daily",
    "start_date": "2024-01-01",
    "end_date": "2024-01-01",
    "total_sales": 5000000,
    "total_orders": 150,
    "average_order_value": 33333,
    "sales_by_category": [ ... ],
    "sales_by_hour": [ ... ],
    "top_menus": [ ... ],
    "daily_sales": [ ... ]
  }
}
```

---

## Public Endpoints (No Auth)

### GET /public/menu/{restaurantId}
Get public menu for QR ordering.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nasi Goreng",
      "description": "Nasi goreng spesial",
      "price": 25000,
      "category": "makanan",
      "image_url": "https://...",
      "is_available": true
    }
  ]
}
```

### POST /public/orders
Create order from QR menu.

**Request:**
```json
{
  "restaurant_id": "uuid",
  "table_number": 5,
  "items": [ ... ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Order placed successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
