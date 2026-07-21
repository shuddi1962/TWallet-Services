# Error Codes

> Complete catalog of all API error codes. Every error returned by TWallet Services follows the standard error format and maps to a unique code.

---

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": [
    { "code": "AUTH_001", "field": "email", "message": "Invalid email or password" }
  ]
}
```

---

## Authentication Errors (AUTH_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| AUTH_001 | 401 | Invalid credentials | Wrong email/password combination |
| AUTH_002 | 401 | Session expired | JWT has expired; refresh required |
| AUTH_003 | 409 | Email already registered | Account exists for this email |
| AUTH_004 | 422 | Password too weak | Password doesn't meet security requirements |
| AUTH_005 | 422 | Terms not accepted | User must accept terms of service |
| AUTH_006 | 401 | Email not verified | Login blocked until email verified |
| AUTH_007 | 429 | Too many attempts | Rate limit hit; account temporarily locked |
| AUTH_008 | 400 | Invalid refresh token | Refresh token is expired or malformed |
| AUTH_009 | 400 | Invalid verification token | Email verification link is invalid or expired |
| AUTH_010 | 400 | Invalid password reset token | Reset link is invalid or expired |
| AUTH_011 | 401 | Invalid or expired token | Generic token validation failure |

---

## User Errors (USER_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| USER_001 | 404 | User not found | Requested user ID doesn't exist |
| USER_002 | 409 | Account has pending orders | Cannot delete account with active orders |
| USER_003 | 403 | Insufficient permissions | Role lacks access to this action |
| USER_004 | 400 | Cannot perform action on self | Admin cannot suspend/delete themselves |
| USER_005 | 400 | Invalid action | Unknown admin action type |
| USER_006 | 409 | Email already in use | Cannot change to an email that's registered |

---

## Wallet Errors (WALLET_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| WALLET_001 | 404 | Wallet not found | Wallet ID doesn't exist |
| WALLET_002 | 409 | Wallet already connected | Address already linked to this or another account |
| WALLET_003 | 422 | Invalid signature | Signed message doesn't match wallet address |
| WALLET_004 | 422 | Unsupported network | Network not in supported list |
| WALLET_005 | 403 | Cannot disconnect default wallet | Set another wallet as default first |
| WALLET_006 | 400 | Wallet limit reached | Maximum 5 wallets per user |

---

## Card Errors (CARD_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| CARD_001 | 404 | Card not found | Card slug or ID doesn't match any product |
| CARD_002 | 400 | Card is not active | Cannot order an archived/inactive card |
| CARD_003 | 400 | Card out of stock | Virtual card temporarily unavailable (future) |

---

## Order Errors (ORDER_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| ORDER_001 | 404 | Order not found | Order ID doesn't exist |
| ORDER_002 | 400 | Invalid network for this card | Card doesn't support the selected network |
| ORDER_003 | 422 | Shipping address required | Physical cards need a shipping address |
| ORDER_004 | 403 | Not authorized to view this order | Order belongs to another user |
| ORDER_005 | 409 | Order cannot be modified in current status | Invalid state transition |
| ORDER_006 | 409 | Order already paid | Cannot create payment for a paid order |

---

## Payment Errors (PAY_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| PAY_001 | 400 | Transaction not found | No on-chain tx found at this hash |
| PAY_002 | 400 | Wrong amount sent | Amount doesn't match expected payment |
| PAY_003 | 400 | Wrong receiving address | Funds sent to wrong address |
| PAY_004 | 400 | Unsupported network/token | Combination not accepted |
| PAY_005 | 429 | Idempotency key already used | Duplicate request detected |
| PAY_006 | 400 | Wrong network | Tx on different network than expected |
| PAY_007 | 409 | Transaction hash already used | Tx hash already used for another payment |
| PAY_008 | 400 | Payment expired | Payment window has closed; create new payment |
| PAY_009 | 400 | Insufficient confirmations | Waiting for more block confirmations |

---

## Transaction Errors (TX_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| TX_001 | 404 | Transaction not found | Transaction ID or hash doesn't exist |
| TX_002 | 403 | Not authorized to view | Transaction belongs to another user |
| TX_003 | 400 | Date range exceeds 1 year | Export range too large |

---

## Notification Errors (NOTIF_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| NOTIF_001 | 404 | Notification not found | Notification ID doesn't exist |

---

## Ticket Errors (TICKET_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| TICKET_001 | 404 | Ticket not found | Ticket ID doesn't exist |
| TICKET_002 | 400 | Cannot reply to a closed ticket | Reopen the ticket first |
| TICKET_003 | 403 | Not authorized to view this ticket | Ticket belongs to another user |

---

## Upload Errors (UPLOAD_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| UPLOAD_001 | 400 | Invalid file type | Only PNG, JPEG, WEBP, PDF accepted |
| UPLOAD_002 | 400 | File too large | Exceeds maximum size limit |
| UPLOAD_003 | 422 | No file provided | Request body missing file |
| UPLOAD_004 | 400 | Invalid document type | Unknown document type value |
| UPLOAD_005 | 404 | File not found | File ID or path doesn't exist |

---

## Validation Errors (VAL_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| VAL_001 | 422 | Validation failed | One or more fields failed validation |
| VAL_002 | 422 | Invalid UUID | Expected a valid UUID string |
| VAL_003 | 422 | Invalid date format | Expected ISO 8601 date format |
| VAL_004 | 422 | Missing required field | Required field not provided |
| VAL_005 | 422 | Value out of range | Numeric value exceeds min/max |

---

## Server Errors (SERVER_*)

| Code | HTTP | Message | Description |
|------|------|---------|-------------|
| SERVER_001 | 500 | Unexpected error | Unhandled server error (check logs) |
| SERVER_002 | 500 | Database error | Database query failed |
| SERVER_003 | 502 | Upstream service unavailable | External API (Alchemy, Resend) failed |
| SERVER_004 | 429 | Rate limit exceeded | Too many requests, slow down |
| SERVER_005 | 503 | Service temporarily unavailable | Platform in maintenance mode |
