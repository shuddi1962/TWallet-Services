# Admin API

> Base route: `/api/v1/admin`
> All endpoints require JWT auth with `super_admin`, `operations`, or `finance` role. RBAC enforced per endpoint. Audit-logged on every mutation.

---

## GET /api/v1/admin/dashboard

Get dashboard overview data (stats + recent activity).

**Auth:** JWT + admin role

### Roles: All admin roles

### Response `200`
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_users": 1250,
      "active_wallets": 890,
      "pending_orders": 34,
      "completed_orders": 678,
      "total_revenue_usdc": "45230.50",
      "open_support_tickets": 12,
      "system_health": "healthy",
      "today_transactions": 45
    },
    "recent_orders": [ /* 5 recent orders */ ],
    "recent_payments": [ /* 5 recent payments */ ],
    "recent_signups": [ /* 5 recent users */ ],
    "recent_tickets": [ /* 5 open tickets */ ],
    "system_alerts": [ /* active alerts */ ],
    "recent_activity": [ /* 10 audit log entries */ ]
  }
}
```

---

## GET /api/v1/admin/users

List all users with advanced filtering.

**Auth:** JWT + admin role (Super Admin, Operations)

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | — | Name, email, or ID |
| status | string | — | `active`, `suspended`, `deleted` |
| role | string | — | `user`, `admin` |
| country | string | — | ISO 3166-1 alpha-2 |
| wallet_connected | bool | — | Filter by wallet status |
| date_from | ISO 8601 | — | Created date start |
| date_to | ISO 8601 | — | Created date end |
| page_size | int | 20 | Max 100 |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://...",
      "country": "US",
      "status": "active",
      "role": "user",
      "wallet_connected": true,
      "wallet_address": "0x...",
      "orders_count": 3,
      "total_spent_usdc": "150.00",
      "created_at": "2026-01-15T10:30:00Z",
      "last_login": "2026-07-20T08:00:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": true }
}
```

---

## PATCH /api/v1/admin/users/{id}

Admin actions on a user (suspend, reactivate, delete).

**Auth:** JWT + Super Admin or Operations

### Request
```json
{
  "action": "suspend",
  "reason": "Multiple failed payment attempts"
}
```

Actions: `suspend`, `reactivate`, `delete` (soft delete).

### Response `200`
```json
{
  "success": true,
  "message": "User suspended",
  "data": { "id": "uuid", "status": "suspended" }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| USER_003 | 403 | Insufficient permissions |
| USER_004 | 400 | Cannot suspend/reactivate/delete self |
| USER_005 | 400 | Invalid action |

---

## GET /api/v1/admin/orders

List all orders with advanced filtering.

**Auth:** JWT + admin role (Super Admin, Operations, Finance)

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | — | Order ID, customer, tx hash, tracking |
| status | string | — | Comma-separated statuses |
| card_product | string | — | Card slug |
| type | string | — | `physical`, `virtual` |
| network | string | — | Network slug |
| country | string | — | Shipping country |
| amount_min | number | — | Minimum amount |
| amount_max | number | — | Maximum amount |
| flagged | bool | — | Flagged orders |
| date_from | ISO 8601 | — | Created date start |
| date_to | ISO 8601 | — | Created date end |
| page_size | int | 20 | Max 100 |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-...",
      "customer": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
      "card": { "name": "Visa Platinum", "type": "physical" },
      "status": "paid",
      "amount_usdc": "50.00",
      "paid_usdc": "50.00",
      "balance_usdc": "0.00",
      "network": "ethereum",
      "token": "USDC",
      "tx_hash": "0x...",
      "shipping_status": "processing",
      "tracking_number": null,
      "carrier": null,
      "country": "US",
      "flagged": false,
      "admin_note": null,
      "created_at": "2026-07-21T10:00:00Z",
      "paid_at": "2026-07-21T10:05:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": true }
}
```

---

## PATCH /api/v1/admin/orders/{id}

Admin order management actions.

**Auth:** JWT + Super Admin or Operations

### Request
```json
{
  "action": "update_status",
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784",
  "carrier": "UPS",
  "note": "Shipped via UPS Ground"
}
```

Available actions: `update_status`, `assign_tracking`, `flag`, `unflag`, `refund`, `add_note`.

### Response `200`
```json
{
  "success": true,
  "message": "Order status updated to shipped",
  "data": { "id": "uuid", "status": "shipped", "tracking_number": "1Z..." }
}
```

---

## GET /api/v1/admin/payments

List all payments with filtering.

**Auth:** JWT + Super Admin or Finance

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | — | Tx hash, customer, order ID |
| status | string | — | Comma-separated |
| network | string | — | Network slug |
| token | string | — | Token symbol |
| verified | bool | — | Verified status |
| flagged | bool | — | Flagged status |
| date_from | ISO 8601 | — | Created date start |
| date_to | ISO 8601 | — | Created date end |
| page_size | int | 20 | Max 100 |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tx_hash": "0x...",
      "customer": { "id": "uuid", "name": "John Doe" },
      "order_id": "uuid",
      "order_number": "ORD-...",
      "amount_usdc": "50.00",
      "network": "ethereum",
      "token": "USDC",
      "from_address": "0x...",
      "to_address": "0x...",
      "confirmations": 15,
      "status": "confirmed",
      "verified": true,
      "flagged": false,
      "created_at": "2026-07-21T10:00:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": true }
}
```

---

## PATCH /api/v1/admin/payments/{id}

Admin payment actions.

**Auth:** JWT + Super Admin or Finance

### Request
```json
{
  "action": "flag",
  "reason": "Suspicious transaction pattern"
}
```

Actions: `verify`, `confirm`, `flag`, `unflag`.

---

## GET /api/v1/admin/cards

List all card products (admin view — includes inactive/archived).

**Auth:** JWT + admin role

---

## POST /api/v1/admin/cards

Create a new card product.

**Auth:** JWT + Super Admin or Operations

---

## PATCH /api/v1/admin/cards/{id}

Update or archive a card product.

**Auth:** JWT + Super Admin or Operations

---

## GET /api/v1/admin/reports

Generate and download reports.

**Auth:** JWT + Super Admin or Finance

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | required | `revenue`, `orders`, `users`, `transactions`, `payments`, `cards`, `support` |
| date_from | ISO 8601 | 30 days ago | Start date |
| date_to | ISO 8601 | now | End date |
| group_by | string | day | `day`, `week`, `month` |
| format | string | json | `json`, `csv`, `xlsx`, `pdf` |

---

## PATCH /api/v1/admin/settings

Update system settings.

**Auth:** JWT + Super Admin only

### Request
```json
{
  "category": "payments",
  "settings": {
    "min_confirmations": 12,
    "platform_fee_percent": 2.5
  }
}
```
