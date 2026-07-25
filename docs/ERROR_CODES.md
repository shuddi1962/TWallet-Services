# Error Codes Reference

> Structured error codes used server-side and returned to clients. Defined in `lib/errors.ts`.

## Auth (`AUTH`)

| Code | Name | HTTP Status | Meaning | Client Action |
|---|---|---|---|---|
| `AUTH_001` | INVALID_EMAIL | 400 | Malformed or invalid email | Fix email format |
| `AUTH_002` | WEAK_PASSWORD | 400 | Below min password requirements | Show password strength rules |
| `AUTH_003` | EMAIL_ALREADY_EXISTS | 409 | Email already registered | Offer sign-in or password reset |
| `AUTH_004` | INVALID_CREDENTIALS | 401 | Wrong email or password | Clear form, show generic error |
| `AUTH_005` | EXPIRED_LINK | 410 | Password reset / magic link expired | Request new link |
| `AUTH_006` | SESSION_EXPIRED | 401 | JWT session expired | Redirect to sign-in |

## Wallet (`WALLET`)

| Code | Name | HTTP Status | Meaning | Client Action |
|---|---|---|---|---|
| `WALLET_001` | WALLET_NOT_CONNECTED | 400 | No wallet detected | Prompt wallet connection |
| `WALLET_002` | UNSUPPORTED_NETWORK | 400 | Wrong chain ID | Trigger chain switch prompt |
| `WALLET_003` | WALLET_REJECTED | 400 | User rejected in wallet UI | Show "try again" with retry button |

## Payment (`PAY`)

| Code | Name | HTTP Status | Meaning | Severity | Client Action |
|---|---|---|---|---|---|
| `PAY_001` | INVALID_AMOUNT | 400 | Amount not positive or mismatched | warning | Show exact expected amount |
| `PAY_002` | INVALID_ADDRESS | 400 | Recipient address malformed | error | Block form; show validation |
| `PAY_003` | INVALID_CHAIN | 400 | Unsupported chain ID | warning | Suggest supported chains |
| `PAY_004` | INSUFFICIENT_CONFIRMATIONS | 202 | TX mined but < required confirms | info | Show "waiting for confirmations" |
| `PAY_005` | TX_HASH_ALREADY_USED | 409 | Hash found in prior payment | error | Block form; contact support |
| `PAY_006` | TX_NOT_FOUND | 404 | Hash not found on chain | error | Verify hash or retry |
| `PAY_007` | AMOUNT_MISMATCH | 409 | TX amount !== expected | error | Show expected vs actual |
| `PAY_008` | RECIPIENT_MISMATCH | 409 | TX to !== platform address | error | Block form; show correct address |
| `PAY_009` | PAYMENT_EXPIRED | 410 | Order payment window passed | warning | Offer to create new order |
| `PAY_010` | VERIFICATION_FAILED | 500 | On-chain verification errored | error | Contact support |

## General (`GEN`)

| Code | Name | HTTP Status | Meaning | Client Action |
|---|---|---|---|---|
| `GEN_001` | NOT_FOUND | 404 | Resource not found | Show 404 page |
| `GEN_002` | UNAUTHORIZED | 401 | No valid session | Redirect to sign-in |
| `GEN_003` | FORBIDDEN | 403 | Authenticated but not allowed | Show "access denied" |
| `GEN_004` | VALIDATION_ERROR | 422 | Zod/input validation failed | Show field-level errors |
| `GEN_005` | RATE_LIMITED | 429 | Request limit exceeded | Show retry-after countdown |
| `GEN_006` | INTERNAL_ERROR | 500 | Unhandled exception | Show generic error; Sentry captured |

## Payment error helpers (`lib/payment-errors.ts`)

- `formatPaymentError(error)` → `{ message, severity, actionable, retryable }`
- `shouldBlockPayment(code)` → `true` for codes that must block submission
- `isRetryableError(error)` → `true` for warning/info severity

## Error response format

```json
{
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email format"
  }
}
```

All errors are thrown as `AppError` (extends `Error`) and caught in server actions or API route wrappers.