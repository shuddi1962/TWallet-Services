# Integration Testing

## Framework

**Vitest + MSW (Mock Service Worker)**

## What to Integration Test

| Area | What to Test |
|------|-------------|
| Supabase queries | RLS enforcement, data fetching, mutations |
| Server Actions | Full request lifecycle with auth context |
| API routes | Request/response, validation, auth, rate limiting |
| Edge Functions | Payment verification flow with mock RPC |
| Auth flows | Registration → email verification → login → session |
| Notifications | Trigger → insert → user reads |
| Storage | Upload → policy enforcement → signed URL |
| Realtime | Channel subscription → event → UI update |

## MSW Setup

```ts
// src/mocks/server.ts
import { setupServer } from "msw/node"
import { handlers } from "./handlers"

export const server = setupServer(...handlers)
```

## Integration Test Pattern

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { server } from "@/mocks/server"
import { createOrder } from "@/app/orders/actions"

beforeAll(() => server.listen())
afterAll(() => server.close())

describe("createOrder", () => {
  it("creates an order for authenticated user", async () => {
    const result = await createOrder({
      productId: "550e8400-e29b-41d4-a716-446655440000",
      network: "polygon",
      token: "USDC",
      shippingAddress: { ... }
    })
    expect(result.orderNumber).toMatch(/^ORD-/)
    expect(result.status).toBe("pending")
  })

  it("rejects unauthenticated requests", async () => {
    // Test with no auth context
    await expect(createOrder({ ... }))
      .rejects.toThrow("Unauthenticated")
  })
})
```

## Test Database

- Use Supabase local instance for integration tests
- Reset state between test suites
- Seed with known data (see `13-Test-Data.md`)
- Clean up after each test

## Coverage Targets

| Area | Target |
|------|--------|
| API routes | 90% |
| Server Actions | 90% |
| RLS policies | 100% (key scenarios) |
| Edge Functions | 100% (verification flow) |
