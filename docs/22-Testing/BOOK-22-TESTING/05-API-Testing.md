# API Testing

## Scope

All 65+ API endpoints across 14 domains (see Book 16 — API Specification).

## What to Test per Endpoint

| Test | Description |
|------|-------------|
| Success case | Valid input → correct response + status |
| Validation | Invalid input → 400 + error details |
| Authentication | No JWT → 401 |
| Authorization | Wrong role → 403 |
| Not found | Invalid ID → 404 |
| Rate limiting | Exceed limit → 429 |
| Edge cases | Empty body, null values, extreme values |

## API Test Pattern

```ts
import { describe, it, expect } from "vitest"

describe("GET /api/orders", () => {
  it("returns paginated orders for authenticated user", async () => {
    const res = await fetch("/api/orders?page=1&limit=20", {
      headers: { Authorization: `Bearer ${testToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toBeInstanceOf(Array)
    expect(body.pagination).toHaveProperty("totalPages")
  })

  it("rejects unauthenticated requests", async () => {
    const res = await fetch("/api/orders")
    expect(res.status).toBe(401)
  })

  it("rejects invalid pagination params", async () => {
    const res = await fetch("/api/orders?page=-1", {
      headers: { Authorization: `Bearer ${testToken}` },
    })
    expect(res.status).toBe(400)
  })
})
```

## Contract Testing

API contracts are defined as OpenAPI 3.1 YAML files (see `15-API/BOOK-16-API/contracts/`). Use these contracts to:

- Generate TypeScript types (openapi-typescript)
- Validate responses match schema
- Detect breaking changes in CI
