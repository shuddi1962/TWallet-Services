# Observability — Logging

## Logging Infrastructure

| Component | Implementation |
|-----------|----------------|
| Runtime | Structured JSON via `src/lib/logger.ts` |
| Storage | Vercel Logs (90 days) + Sentry (90 days) |
| Client | Sentry (`src/lib/sentry.ts`) |
| Edge Functions | `console.log` with JSON (captured by Supabase) |

## Log Streams

| Stream | Source | Destination |
|--------|--------|-------------|
| API requests | Vercel Edge/Functions | Vercel Logs |
| Server Actions | Next.js | Vercel Logs |
| Edge Functions | Supabase | Supabase Logs |
| Client errors | Browser | Sentry |
| Auth events | Supabase Auth | Supabase Logs |
| Database queries | Supabase Postgres | Supabase Logs |

## Logging Standards

All output MUST be structured JSON with these required fields:

```
timestamp, level, service, requestId, environment, message
```

## Log Levels

- **DEBUG** — Development only; suppressed in production
- **INFO** — Normal operations (user registered, order created)
- **WARN** — Handled anomalies (retry succeeded, rate limit approached)
- **ERROR** — Failure requiring investigation
- **FATAL** — Unrecoverable; immediate attention

## Never Log

- Passwords, private keys, seed phrases
- JWT tokens, API secrets, service role keys
- Full PII beyond business necessity

## Reference

See `24-Monitoring/BOOK-24-MONITORING/01-Logging.md` for full specification.
