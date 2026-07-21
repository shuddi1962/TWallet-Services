# API Security

## Requirements

| Requirement | Implementation |
|-------------|----------------|
| HTTPS only | Enforced via HSTS + Vercel edge |
| JWT validation | Every authenticated endpoint validates token |
| Request validation | Zod schemas on every endpoint |
| Response validation | Consistent JSON structure with `{ data, error }` |
| Rate limiting | Auth: 5/min · Payment: 10/min · General: 100/min |
| Request size limits | Max 1MB body |
| Timeout protection | Edge Functions: 10s · Route Handlers: 30s |
| Structured errors | `{ error: { code, message, details } }` |
| Logging | All requests logged with correlation ID |
| Correlation IDs | `x-request-id` header on every response |

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable entity |
| 429 | Rate limited |
| 500 | Internal server error |

## API Key Authentication (Admin)

Admin endpoints use JWT-based auth. Future: dedicated API keys for programmatic access with scoped permissions.

## Webhook Security

| Measure | Implementation |
|---------|----------------|
| Signing | HMAC-SHA256 with shared secret |
| Verification | Verify signature on every webhook |
| Replay protection | Timestamp + nonce check |
| IP allowlist | Restrict to known provider CIDR ranges |
| Response | Always return 200 (async processing) |
