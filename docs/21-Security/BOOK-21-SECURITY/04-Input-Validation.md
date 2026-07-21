# Input Validation

## Library

**Zod** — schema declaration and validation library. Every API endpoint, Server Action, and form submission validates input against a Zod schema.

## Validation Rules

| Input | Schema | Constraints |
|-------|--------|-------------|
| Email | `z.string().email()` | Max 254 chars |
| Phone | `z.string().regex(/^\+[1-9]\d{1,14}$/)` | E.164 format |
| Wallet address | `z.string().regex(/^0x[a-fA-F0-9]{40}$/)` | Ethereum-style |
| Network ID | `z.string().uuid()` | Valid UUID |
| Country | `z.string().length(2)` | ISO 3166-1 alpha-2 |
| Full name | `z.string().min(2).max(100)` | — |
| Order amount | `z.number().positive().max(100000)` | — |
| Ticket message | `z.string().min(1).max(10000)` | — |

## Rejection Rules

| Condition | Response |
|-----------|----------|
| Malformed JSON | 400 — Invalid JSON body |
| Unknown fields | 400 — Unknown field `xyz` (strict mode) |
| Oversized payload | 413 — Payload too large (max 1MB) |
| Invalid types | 400 — Expected string, received number |
| Missing required | 400 — `field` is required |

## Sanitization

- Strip unknown fields from payloads (Zod `.strip()`)
- Escape HTML in user-generated content (display only)
- Normalize email addresses (downcase, trim)
- Sanitize file names (remove path separators, null bytes)

## Example

```ts
import { z } from "zod"

export const createOrderSchema = z.object({
  productId: z.string().uuid(),
  shippingAddress: z.object({
    fullName: z.string().min(2).max(100),
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().max(100).optional(),
    postalCode: z.string().max(20),
    country: z.string().length(2),
  }),
  network: z.string(),
  token: z.string(),
})
```
