# Webhooks

> Webhooks are external callbacks that trigger internal logic. TWallet Services receives webhooks from external services and sends webhooks to shipping partners.

---

## POST /api/v1/webhooks/walletconnect

Receive WalletConnect session events.

**Source:** WalletConnect cloud relay
**Auth:** HMAC signature verification (header `X-WC-Signature`)

### Payload
```json
{
  "event": "session_proposal",
  "data": {
    "id": 123,
    "params": {
      "pairingTopic": "...",
      "proposer": { "metadata": { "name": "MetaMask", "url": "..." } }
    }
  }
}
```

### Processing
1. Verify HMAC signature
2. Route event to appropriate handler (session proposal, session delete, event notification)
3. No response body needed — return `200`

---

## POST /api/v1/webhooks/blockchain

Receive blockchain event notifications (future — for real-time payment detection).

**Source:** Alchemy webhooks (via Alchemy Notify)
**Auth:** Alchemy signature verification (header `X-Alchemy-Signature`)

### Payload
```json
{
  "webhookId": "wh_...",
  "id": "whevt_...",
  "createdAt": "2026-07-21T10:00:00Z",
  "type": "ADDRESS_ACTIVITY",
  "event": {
    "network": "eth-mainnet",
    "activity": [
      {
        "fromAddress": "0x...",
        "toAddress": "0x...",
        "hash": "0x...",
        "value": 50000000,
        "asset": "USDC",
        "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      }
    ]
  }
}
```

### Processing
1. Verify Alchemy signature
2. Look up `toAddress` in `supported_wallet_addresses`
3. If match found, trigger payment verification flow
4. Return `200` immediately (verification runs async)

---

## POST /api/v1/webhooks/email

Receive email delivery events from Resend.

**Source:** Resend
**Auth:** Resend signing secret (header `X-Resend-Signature`)

### Payload
```json
{
  "type": "email.delivered",
  "data": {
    "email_id": "uuid",
    "to": ["user@example.com"],
    "subject": "Your order has been shipped!",
    "timestamp": "2026-07-21T10:00:00Z"
  }
}
```

Event types: `email.sent`, `email.delivered`, `email.bounced`, `email.complained`, `email.opened`.

### Processing
1. Verify HMAC signature
2. Log delivery status
3. If `bounced`, flag user's email for review
4. Return `200`

---

## POST /api/v1/webhooks/storage

Receive Supabase Storage events (future — for avatar processing).

**Source:** Supabase Storage
**Auth:** Supabase webhook secret

### Payload
```json
{
  "type": "INSERT",
  "table": "objects",
  "record": {
    "id": "uuid",
    "bucket_id": "avatars",
    "name": "user-id/file.jpg",
    "metadata": { "size": 153600 }
  }
}
```

### Processing
1. Verify signature
2. If avatar upload, trigger image optimization
3. Return `200`

---

## POST /api/v1/webhooks/shipping

Receive shipping status updates from carrier APIs (future).

**Source:** Carrier webhook (UPS, FedEx, DHL)
**Auth:** Carrier-specific API token

### Payload
```json
{
  "tracking_number": "1Z999AA10123456784",
  "carrier": "UPS",
  "status": "delivered",
  "location": "New York, NY",
  "timestamp": "2026-07-28T14:00:00Z",
  "signed_by": "J. Doe"
}
```

### Processing
1. Verify carrier signature/token
2. Update `card_orders.shipping_status` and `delivered_at`
3. Trigger notification to customer
4. Return `200`

---

## Webhook Security

| Measure | Implementation |
|---------|---------------|
| Signature verification | HMAC-SHA256 with shared secret per webhook |
| IP allowlist | Restrict to known provider IP ranges |
| Idempotency | Deduplicate by webhook ID + event ID (24h window) |
| Payload validation | Zod schema on each webhook type |
| Response timeout | All webhooks must respond within 5 seconds |
| Audit logging | Every webhook receipt logged to `audit_logs` |
| Retry | 3 retries with exponential backoff (1m, 5m, 30m) |
