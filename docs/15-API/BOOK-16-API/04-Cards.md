# Cards API

> Base route: `/api/v1/cards`
> Public card catalog (GET) vs authenticated order management (POST).

---

## GET /api/v1/cards

List all available card products.

**Auth:** None

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | — | Filter: `physical`, `virtual` |
| network | string | — | Filter by network slug |
| active | bool | true | Show active cards only |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "visa-platinum",
      "name": "Visa Platinum",
      "type": "physical",
      "description": "Premium physical card with metal finish",
      "price_usdc": "50.00",
      "annual_fee_usdc": "0.00",
      "networks": ["ethereum", "polygon"],
      "tokens": ["USDC", "USDT"],
      "currency": "USD",
      "card_art_url": "https://...",
      "features": ["Metal finish", "Free shipping", "24/7 support"],
      "active": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

## GET /api/v1/cards/{slug}

Get a single card product's details.

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "visa-platinum",
    "name": "Visa Platinum",
    "type": "physical",
    "description": "Premium physical card with metal finish",
    "price_usdc": "50.00",
    "annual_fee_usdc": "0.00",
    "networks": ["ethereum", "polygon"],
    "tokens": ["USDC", "USDT"],
    "currency": "USD",
    "card_art_url": "https://...",
    "features": ["Metal finish", "Free shipping", "24/7 support"],
    "active": true,
    "terms_url": "https://...",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-06-15T00:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| CARD_001 | 404 | Card not found |

---

## POST /api/v1/cards/order

Create a new card order.

**Auth:** JWT required

### Request
```json
{
  "card_slug": "visa-platinum",
  "network": "ethereum",
  "token": "USDC",
  "shipping_address": {
    "full_name": "John Doe",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  }
}
```

### Validation
```ts
const createOrderSchema = z.object({
  card_slug: z.string(),
  network: z.string(),
  token: z.string(),
  shipping_address: z.object({
    full_name: z.string().min(2).max(100),
    line1: z.string().min(1).max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1).max(100),
    state: z.string().max(100).optional(),
    postal_code: z.string().min(3).max(20),
    country: z.string().length(2),
  }).optional(),  // required for physical cards
});
```

### Response `201`
```json
{
  "success": true,
  "message": "Order created. Complete payment to activate.",
  "data": {
    "order_id": "uuid",
    "amount_usdc": "50.00",
    "status": "pending",
    "payment": {
      "receiving_address": "0x...",
      "network": "ethereum",
      "token": "USDC",
      "amount": "50.00",
      "expires_at": "2026-07-23T10:00:00Z"
    },
    "created_at": "2026-07-21T10:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| CARD_001 | 404 | Card not found |
| CARD_002 | 400 | Card is not active |
| ORDER_002 | 400 | Invalid network for this card |
| ORDER_003 | 422 | Shipping address required for physical card |

---

## GET /api/v1/cards/orders

Get the current user's card orders.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | Filter by status |
| page_size | int | 20 | Results per page |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "card": { "name": "Visa Platinum", "slug": "visa-platinum", "type": "physical" },
      "status": "paid",
      "amount_usdc": "50.00",
      "balance_usdc": "50.00",
      "network": "ethereum",
      "token": "USDC",
      "tracking_number": null,
      "created_at": "2026-07-21T10:00:00Z",
      "paid_at": "2026-07-21T10:05:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```
