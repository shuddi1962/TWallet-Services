# Unit Testing

## Framework

**Vitest** — fast, Vite-native test runner with TypeScript support.

## Configuration

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
      include: [
        "src/lib/**/*.ts",
        "src/components/**/*.tsx",
        "src/app/**/actions.ts",
        "src/lib/validators.ts",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/types.ts",
        "**/*.d.ts",
      ],
    },
  },
})
```

## What to Unit Test

| Module | Example | Priority |
|--------|---------|----------|
| Zod validators | Auth schemas, order schemas | Critical |
| Server Actions | `createOrder`, `submitPayment` | Critical |
| Utility functions | `generateOrderNumber`, `calculateTotal` | High |
| Permission helpers | `requireRole`, `isAdmin` | High |
| State machines | Order status transitions | High |
| React hooks | `useWallet`, `useOrders` | Medium |
| UI components | Button, Input, Badge | Medium |
| Formatters | `formatCurrency`, `shortenAddress` | Low |

## Test Pattern

```ts
import { describe, it, expect } from "vitest"
import { createOrderSchema } from "@/lib/validators"

describe("createOrderSchema", () => {
  it("accepts valid order data", () => {
    const result = createOrderSchema.safeParse({
      productId: "550e8400-e29b-41d4-a716-446655440000",
      network: "polygon",
      token: "USDC",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid productId", () => {
    const result = createOrderSchema.safeParse({
      productId: "not-a-uuid",
      network: "polygon",
      token: "USDC",
    })
    expect(result.success).toBe(false)
  })
})
```

## Mocking Strategy

- Use `vi.mock()` for Supabase client
- Use MSW for API mocking in integration tests
- Mock external services (Alchemy, WalletConnect) at network level
- Do NOT mock utility functions — test real implementations

## Coverage Target: **90%**
