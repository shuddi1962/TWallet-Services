# Payments API

> Base route: `/api/v1/payments`
> Supports create + verify flow. The `create` endpoint generates payment details; the `verify` endpoint checks on-chain status. Idempotency supported.

---

## POST /api/v1/payments/create

Create a crypto payment request. Returns the receiving address and amount to send.

**Auth:** JWT required

### Request
```json
{
  "order_id": "uuid",
  "network": "ethereum",
  "token": "USDC",
  "idempotency_key": "unique-key-123"
}
```

### Headers
`Idempotency-Key: unique-key-123` — prevents duplicate payment creation on retry.

### Response `201`
```json
{
  "success": true,
  "data": {
    "payment_id": "uuid",
    "order_id": "uuid",
    "receiving_address": "0x...",
    "network": "ethereum",
    "token": "USDC",
    "amount": "50.00",
    "usdc_contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "expires_at": "2026-07-23T10:00:00Z",
    "status": "pending",
    "created_at": "2026-07-21T10:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| ORDER_001 | 404 | Order not found |
| ORDER_006 | 409 | Order already paid |
| PAY_004 | 400 | Unsupported network/token combination |
| PAY_005 | 429 | Idempotency key already used (duplicate request) |

---

## POST /api/v1/payments/verify

Verify a submitted blockchain transaction. This endpoint invokes the `verify-payment` Edge Function.

**Auth:** JWT required

### Request
```json
{
  "payment_id": "uuid",
  "tx_hash": "0x..."
}
```

### Edge Function Flow
1. Parse payment_id and tx_hash
2. Query `payment_transactions` for existing record
3. Call Alchemy `eth_getTransactionReceipt`
4. Decode logs for ERC-20 Transfer event
5. Verify: correct receiving address, exact amount, correct chain, sufficient confirmations, hash not previously used
6. Update `payment_transactions.status` → `confirmed` or `failed`
7. If confirmed, update `card_orders.status` → `paid` and `paid_at`
8. Create `audit_logs` entry
9. Send confirmation notification

### Response `200` (confirmed)
```json
{
  "success": true,
  "message": "Payment verified and confirmed",
  "data": {
    "payment_id": "uuid",
    "status": "confirmed",
    "confirmations": 15,
    "block_number": 21234567,
    "tx_hash": "0x...",
    "amount": "50.00",
    "network_fee": "0.002",
    "verified_at": "2026-07-21T10:05:00Z",
    "order_status": "paid"
  }
}
```

### Response `200` (pending — waiting for confirmations)
```json
{
  "success": true,
  "message": "Transaction detected, awaiting confirmations",
  "data": {
    "payment_id": "uuid",
    "status": "pending",
    "confirmations": 3,
    "required_confirmations": 12,
    "tx_hash": "0x..."
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| PAY_001 | 400 | No transaction found at this hash |
| PAY_002 | 400 | Wrong amount sent |
| PAY_003 | 400 | Wrong receiving address |
| PAY_006 | 400 | Wrong network |
| PAY_007 | 409 | Transaction hash already used |

---

## GET /api/v1/payments/{id}

Get payment details.

**Auth:** JWT required (payment owner or admin)

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_id": "uuid",
    "status": "confirmed",
    "amount": "50.00",
    "network": "ethereum",
    "token": "USDC",
    "tx_hash": "0x...",
    "from_address": "0x...",
    "to_address": "0x...",
    "confirmations": 15,
    "block_number": 21234567,
    "explorer_url": "https://etherscan.io/tx/0x...",
    "verified_at": "2026-07-21T10:05:00Z",
    "created_at": "2026-07-21T10:00:00Z"
  }
}
```

---

## GET /api/v1/payments/history

Get the current user's payment history.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | Filter: pending, confirmed, failed |
| network | string | — | Filter by network |
| date_from | ISO 8601 | — | Start date |
| date_to | ISO 8601 | — | End date |
| page_size | int | 20 | Results per page |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "order_number": "ORD-...",
      "status": "confirmed",
      "amount": "50.00",
      "network": "ethereum",
      "token": "USDC",
      "tx_hash": "0x...",
      "explorer_url": "https://...",
      "created_at": "2026-07-21T10:00:00Z",
      "confirmed_at": "2026-07-21T10:05:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```

---

## GET /api/v1/payments/estimate-fees

Estimate network fees for a payment.

**Auth:** JWT required

### Query
| Param | Type | Description |
|-------|------|-------------|
| network | string | Target network |
| token | string | Token to send |

### Response `200`
```json
{
  "success": true,
  "data": {
    "network": "ethereum",
    "token": "USDC",
    "estimated_gas_usdc": "0.50",
    "estimated_gas_eth": "0.002",
    "gas_unit_price_gwei": 25,
    "estimated_units": 65000
  }
}
```
