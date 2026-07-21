# Rate Limiting

## Strategy

Multi-layered rate limiting: application-level + Supabase + Vercel WAF.

## Rate Limit Tiers

| Endpoint | Window | Limit | Burst |
|----------|--------|-------|-------|
| POST `/auth/login` | 15 min | 5 | — |
| POST `/auth/register` | 1 hour | 3 | — |
| POST `/auth/forgot-password` | 1 hour | 3 | — |
| POST `/auth/reset-password` | 15 min | 3 | — |
| POST `/api/payments/verify` | 10 min | 10 | 5 |
| POST `/api/orders` | 1 hour | 10 | 3 |
| POST `/api/support/tickets` | 1 hour | 5 | 2 |
| POST `/api/upload` | 1 hour | 20 | 5 |
| GET `/api/admin/*` | 1 min | 60 | 10 |
| POST `/api/admin/*` | 1 min | 30 | 5 |
| All other endpoints | 1 min | 100 | 20 |

## Implementation

```ts
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimit = {
  auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "15 m"), prefix: "auth" }),
  payment: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 m"), prefix: "payment" }),
  api: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, "1 m"), prefix: "api" }),
}
```

## Supabase Auth Rate Limiting

Supabase Auth applies built-in rate limiting on:

- Login attempts: 5 per email per 15 min
- Signup attempts: 3 per email per hour
- Password reset: 3 per email per hour
- Token refresh: 10 per token per 5 min

## Response

When rate limit exceeded, return HTTP 429:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 45 seconds.",
    "retryAfter": 45
  }
}
```

## Distributed Rate Limiting

Use Upstash Redis (serverless, global) for cross-region rate limit enforcement in Edge Functions.
