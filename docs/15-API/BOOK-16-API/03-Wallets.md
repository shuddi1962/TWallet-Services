# Wallet API

> Base route: `/api/v1/wallets`
> All endpoints require JWT auth. Users manage their own connected wallets.

---

## GET /api/v1/wallets

List all wallets connected to the current user.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page_size | int | 20 | Results per page (max 50) |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "address": "0x1234...5678",
      "network": "ethereum",
      "network_id": 1,
      "label": "My Main Wallet",
      "is_default": true,
      "connected_at": "2026-06-01T12:00:00Z",
      "last_used_at": "2026-07-20T15:30:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```

---

## POST /api/v1/wallets/connect

Connect a new wallet.

**Auth:** JWT required

### Request
```json
{
  "address": "0x1234...5678",
  "network": "ethereum",
  "network_id": 1,
  "label": "My Main Wallet",
  "signature": "0x...",  // message signed by wallet to prove ownership
  "message": "TWallet Services — Connect wallet at 2026-07-21T10:00:00Z"
}
```

### Validation
```ts
const connectWalletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  network: z.string().min(1),
  network_id: z.number().int().positive(),
  label: z.string().max(50).optional(),
  signature: z.string().min(1),
  message: z.string().min(1),
});
```

### Response `201`
```json
{
  "success": true,
  "message": "Wallet connected",
  "data": {
    "id": "uuid",
    "address": "0x1234...5678",
    "network": "ethereum",
    "is_default": false
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| WALLET_002 | 409 | Wallet already connected |
| WALLET_003 | 422 | Invalid signature |
| WALLET_004 | 422 | Unsupported network |

---

## DELETE /api/v1/wallets/{id}

Disconnect a wallet.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "message": "Wallet disconnected"
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| WALLET_001 | 404 | Wallet not found |
| WALLET_005 | 403 | Cannot disconnect default wallet (set another as default first) |

---

## PATCH /api/v1/wallets/default

Set a wallet as the default.

**Auth:** JWT required

### Request
```json
{
  "wallet_id": "uuid"
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Default wallet updated",
  "data": { "id": "uuid", "address": "0x...", "is_default": true }
}
```

---

## GET /api/v1/wallets/networks

Get supported blockchain networks for wallet connection.

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "ethereum",
      "name": "Ethereum",
      "chain_id": 1,
      "currency": "ETH",
      "explorer_url": "https://etherscan.io",
      "rpc_url": "https://eth-mainnet.g.alchemy.com/v2/...",
      "icon_url": "https://..."
    },
    {
      "id": "polygon",
      "name": "Polygon",
      "chain_id": 137,
      "currency": "MATIC",
      "explorer_url": "https://polygonscan.com",
      "rpc_url": "https://polygon-mainnet.g.alchemy.com/v2/...",
      "icon_url": "https://..."
    }
  ]
}
```
