# Transactions API

> Base route: `/api/v1/transactions`
> Read-only history of the user's on-chain payment transactions. Data comes from `payment_transactions` and `supported_tokens` tables.

---

## GET /api/v1/transactions

List the current user's transaction history with optional filters.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | `pending`, `confirmed`, `failed` |
| network | string | — | Network slug |
| token | string | — | Token symbol |
| date_from | ISO 8601 | — | Start date |
| date_to | ISO 8601 | — | End date |
| min_amount | number | — | Minimum USDC amount |
| max_amount | number | — | Maximum USDC amount |
| page_size | int | 20 | Results per page (max 100) |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tx_hash": "0x...",
      "network": "ethereum",
      "token": "USDC",
      "amount": "50.00",
      "status": "confirmed",
      "confirmations": 15,
      "from_address": "0x...",
      "to_address": "0x...",
      "order_id": "uuid",
      "order_number": "ORD-...",
      "explorer_url": "https://etherscan.io/tx/0x...",
      "created_at": "2026-07-21T10:00:00Z",
      "confirmed_at": "2026-07-21T10:05:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```

---

## GET /api/v1/transactions/{hash}

Get details for a single transaction by its blockchain hash.

**Auth:** JWT required (must own the transaction)

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tx_hash": "0x...",
    "network": "ethereum",
    "network_id": 1,
    "token": "USDC",
    "token_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "50.00",
    "status": "confirmed",
    "confirmations": 15,
    "required_confirmations": 12,
    "block_number": 21234567,
    "block_timestamp": "2026-07-21T10:03:00Z",
    "from_address": "0x...",
    "to_address": "0x...",
    "gas_used": "65000",
    "gas_price_gwei": "25",
    "network_fee_eth": "0.001625",
    "network_fee_usdc": "0.50",
    "order_id": "uuid",
    "order_number": "ORD-...",
    "explorer_url": "https://etherscan.io/tx/0x...",
    "created_at": "2026-07-21T10:00:00Z",
    "confirmed_at": "2026-07-21T10:05:00Z",
    "verified_at": "2026-07-21T10:05:30Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| TX_001 | 404 | Transaction not found |
| TX_002 | 403 | Not authorized to view this transaction |

---

## GET /api/v1/transactions/export

Export transaction history as CSV.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| date_from | ISO 8601 | 30 days ago | Start date |
| date_to | ISO 8601 | now | End date |
| status | string | — | Filter by status |
| network | string | — | Filter by network |

### Response `200`
Content-Type: `text/csv`
Content-Disposition: `attachment; filename="transactions-2026-07-21.csv"`

```csv
id,tx_hash,network,token,amount,status,confirmations,from_address,to_address,created_at,confirmed_at
uuid,0x...,ethereum,USDC,50.00,confirmed,15,0x...,0x...,2026-07-21T10:00:00Z,2026-07-21T10:05:00Z
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| TX_003 | 400 | Date range exceeds 1 year |
