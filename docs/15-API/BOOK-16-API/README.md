# Book 16 — API Specification

> **TWallet Services · TWallet Card**
> The authoritative contract between frontend and backend. Every endpoint, request, response, error code, and webhook that TWallet Services exposes.

---

## Document Control

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Book         | 16 — API Specification               |
| Version      | 1.0.0                                |
| Status       | Approved                             |
| Priority     | Critical                             |
| Base Route   | `/api/v1/`                           |
| Protocol     | HTTPS · JSON                         |
| Auth         | Bearer JWT (`Authorization` header)  |
| Timezone     | UTC                                  |
| Type         | Modular folder (17 files + contracts)|

---

## Architecture

```
Request → Next.js 15 Route Handler → Zod validation → Supabase query → Typed response
                                                                   ↘ Server Action (mutation)
                                                                   ↘ Edge Function (sensitive ops)
```

All endpoints follow the **Backend Contract Layer** pattern:
- **Route Handlers** for RESTful CRUD (GET, POST, PATCH, DELETE)
- **Server Actions** for form-driven mutations (auth, settings, uploads)
- **Edge Functions** (Deno) for payment verification, webhooks, health checks

---

## Standards

| Standard       | Value                  |
|----------------|------------------------|
| Protocol       | HTTPS only             |
| Authentication | Bearer JWT (`Authorization: Bearer <token>`) |
| Content-Type   | `application/json`     |
| Timezone       | UTC                    |
| Versioning     | `/api/v1/` path prefix |
| Pagination     | Cursor-based (keyset)  |
| Rate Limiting  | 60 req/min (global), 10 req/min (auth) |
| Idempotency    | `Idempotency-Key` header for payments |

---

## HTTP Status Codes

| Code | Description             | Usage                          |
|------|-------------------------|---------------------------------|
| 200  | OK                      | Successful GET, PATCH           |
| 201  | Created                 | Successful POST                 |
| 204  | No Content              | Successful DELETE               |
| 400  | Bad Request             | Malformed request, missing field|
| 401  | Unauthorized            | Missing or invalid JWT          |
| 403  | Forbidden               | Valid JWT but insufficient role |
| 404  | Not Found               | Resource doesn't exist          |
| 409  | Conflict                | Duplicate, state conflict       |
| 422  | Validation Error        | Zod schema validation failed    |
| 429  | Too Many Requests       | Rate limit exceeded             |
| 500  | Internal Server Error   | Unhandled exception             |

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    { "code": "AUTH_001", "field": "email", "message": "Invalid email or password" }
  ]
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMyJ9",
    "has_more": true,
    "total": 250
  }
}
```

---

## File Index

| File | Section | Endpoints |
|------|---------|-----------|
| `README.md` | This file | Standards, status codes, response format, pagination, rate limiting, idempotency, security |
| `01-Authentication.md` | Auth API | register, login, logout, refresh, forgot-password, verify-email, session |
| `02-Users.md` | Users API | me, profile, preferences, security settings, delete account |
| `03-Wallets.md` | Wallet API | list, connect, disconnect, default, networks |
| `04-Cards.md` | Cards API | list, details, order, customer orders |
| `05-Orders.md` | Orders API | list, detail, update, tracking, invoice, cancel |
| `06-Payments.md` | Payments API | create, verify, details, history, estimate-fees |
| `07-Transactions.md` | Transactions API | history, details, export |
| `08-Notifications.md` | Notifications API | list, mark-read, mark-all-read, delete, preferences |
| `09-Support.md` | Support API | tickets, detail, reply, close, attachments |
| `10-Uploads.md` | Uploads API | avatar, document, delete, generate-url |
| `11-Admin.md` | Admin API | dashboard, users, orders, payments, cards, reports, settings |
| `12-Analytics.md` | Analytics API | dashboard, orders, payments, users, export |
| `13-System.md` | System API | health, version, status, config |
| `14-Webhooks.md` | Webhooks | walletconnect, blockchain, email, storage, shipping |
| `15-Errors.md` | Error Codes | Complete error code catalog |
| `16-OpenAPI.md` | OpenAPI | OpenAPI 3.1 generation, Swagger UI, Scalar, typed clients |
| `17-OpenCode.md` | Build Prompt | Complete API build directive |

---

## Contracts Directory

Machine-readable OpenAPI 3.1 YAML files in `contracts/`:

```
contracts/
  auth.openapi.yaml
  users.openapi.yaml
  wallets.openapi.yaml
  cards.openapi.yaml
  orders.openapi.yaml
  payments.openapi.yaml
  transactions.openapi.yaml
  notifications.openapi.yaml
  support.openapi.yaml
  uploads.openapi.yaml
  admin.openapi.yaml
  analytics.openapi.yaml
  system.openapi.yaml
  webhooks.openapi.yaml
```

These generate: TypeScript types, Zod schemas, API client, backend validation, integration tests, interactive docs.

---

## Pagination Strategy

- **Cursor-based (keyset pagination)** for list endpoints
- Cursor is base64-encoded JSON `{ "id": "uuid", "created_at": "iso" }`
- Request: `GET /api/v1/orders?cursor=...&limit=50`
- Response includes `pagination.cursor` and `pagination.has_more`
- Default limit: 20. Max: 100.

---

## Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Global API | 60 requests | 1 minute |
| Auth endpoints | 10 requests | 1 minute |
| Payment verify | 5 requests | 1 minute |
| File upload | 10 requests | 1 minute |
| Admin API | 120 requests | 1 minute |

Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Idempotency

- `POST /api/v1/payments/create` supports `Idempotency-Key` header
- Key stored for 24 hours; same key returns same response
- Prevents duplicate payment creation on network retry

---

## Security

- All endpoints require JWT except: register, login, forgot-password, system/health, system/version
- Admin endpoints check `user_roles.role` (403 if insufficient)
- CORS: permissive in dev, restricted in production
- CSP: strict on all responses
- Request logging: all mutations logged to `audit_logs`
- Input validation: Zod schemas on every endpoint
- SQL injection: parameterized queries via Supabase client
