# OpenAPI Specification

> Machine-readable API contracts for code generation, documentation, and testing.

---

## Generation Strategy

Each API domain has a corresponding OpenAPI 3.1 YAML file in `contracts/`. These files are:

1. **Authoritative** — single source of truth for the API contract
2. **Machine-readable** — can generate TypeScript types, Zod schemas, API clients
3. **Human-reviewable** — YAML with clear structure and comments
4. **Version-controlled** — changes to the API start with a PR to the contract

---

## Contract Files

| File | Domain | Endpoints |
|------|--------|-----------|
| `contracts/auth.openapi.yaml` | Authentication | 7 endpoints |
| `contracts/users.openapi.yaml` | Users | 5 endpoints |
| `contracts/wallets.openapi.yaml` | Wallets | 5 endpoints |
| `contracts/cards.openapi.yaml` | Cards | 4 endpoints |
| `contracts/orders.openapi.yaml` | Orders | 5 endpoints |
| `contracts/payments.openapi.yaml` | Payments | 5 endpoints |
| `contracts/transactions.openapi.yaml` | Transactions | 3 endpoints |
| `contracts/notifications.openapi.yaml` | Notifications | 4 endpoints |
| `contracts/support.openapi.yaml` | Support | 5 endpoints |
| `contracts/uploads.openapi.yaml` | Uploads | 4 endpoints |
| `contracts/admin.openapi.yaml` | Admin | 7 endpoint groups |
| `contracts/analytics.openapi.yaml` | Analytics | 4 endpoints |
| `contracts/system.openapi.yaml` | System | 4 endpoints |
| `contracts/webhooks.openapi.yaml` | Webhooks | 5 webhooks |

---

## Generation Pipeline

```
OpenAPI YAML  ──►  openapi-typescript  ──►  src/types/api.ts
              ──►  zodios              ──►  src/lib/api/client.ts + src/lib/api/zod.ts
              ──►  Scalar/Swagger UI   ──►  /api/docs (Next.js route)
              ──►  k6/Playwright       ──►  tests/integration/api.test.ts
```

### Tools

| Tool | Purpose | Output |
|------|---------|--------|
| `openapi-typescript` | Type generation | `src/types/api.ts` — full typed API surface |
| `@zodios/core` | Client + validation | Typed fetch client with Zod validation |
| `Scalar` / `Swagger UI` | Interactive docs | `/api/docs` route in Next.js |
| `k6` / `Playwright` | Integration tests | Auto-generated test stubs |

---

## OpenAPI 3.1 Template

```yaml
openapi: 3.1.0
info:
  title: TWallet Services API
  version: 1.0.0
  description: Non-custodial crypto-funded card platform API
servers:
  - url: https://api.twalletservices.com/api/v1
    description: Production
  - url: https://staging-api.twalletservices.com/api/v1
    description: Staging
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Error:
      type: object
      properties:
        success: { type: boolean, enum: [false] }
        message: { type: string }
        errors:
          type: array
          items:
            type: object
            properties:
              code: { type: string }
              field: { type: string }
              message: { type: string }
    Pagination:
      type: object
      properties:
        cursor: { type: string }
        has_more: { type: boolean }
        total: { type: integer }
security:
  - bearerAuth: []
paths:
  # Per-domain path definitions in each contract file
```

---

## Serving Docs

```ts
// src/app/api/docs/route.ts (or pages/api/docs.ts)
// Serves Scalar API reference at /api/docs
import { Scalar } from '@scalar/nextjs-api-reference';
import spec from '@/contracts/openapi.bundled.yaml';

export const GET = Scalar({
  spec: { content: spec },
  theme: 'purple',
  darkMode: true,
  showSidebar: true,
});
```

---

## Code Generation Scripts

```json
// package.json
{
  "scripts": {
    "gen:api:types": "openapi-typescript contracts/openapi.bundled.yaml -o src/types/api.ts",
    "gen:api:client": "tsx scripts/generate-api-client.ts",
    "gen:api:docs": "tsx scripts/bundle-openapi.ts",
    "gen:api:all": "npm run gen:api:types && npm run gen:api:client && npm run gen:api:docs",
    "test:api:contract": "tsx scripts/validate-contracts.ts"
  }
}
```
