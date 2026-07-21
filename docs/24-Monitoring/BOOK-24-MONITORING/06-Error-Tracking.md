# Error Tracking

## Captured Errors

Every error category below MUST be captured and sent to Sentry (or equivalent).

### Frontend

| Category | Examples | Severity |
|----------|----------|----------|
| Unhandled exceptions | `TypeError`, `ReferenceError` | ERROR |
| React render errors | Component crashes | ERROR |
| API call failures | 4xx/5xx from fetch | WARN / ERROR |
| Wallet connection errors | User rejected, network switch fail | WARN |
| Payment errors | Verification failed, timeout | ERROR |
| Realtime disconnection | Channel error | WARN |

### Backend (Edge Functions / Server Actions)

| Category | Examples | Severity |
|----------|----------|----------|
| Database errors | Connection failure, unique violation | ERROR |
| Auth errors | Token verification failed | WARN |
| Payment verification errors | RPC failed, tx not found | ERROR |
| Validation errors | Zod schema violation | WARN |
| Rate limit exceeded | Too many requests | WARN |
| External API errors | Alchemy RPC failure, email send fail | ERROR |

## Implementation

### Sentry Setup (Frontend)

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? 'development',
  tracesSampleRate: 0.2, // 20% sampling in production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network request failed',
  ],
});
```

### Sentry Setup (Edge Functions)

```typescript
// supabase/functions/_shared/sentry.ts
import * as Sentry from 'https://deno.land/x/sentry/index.mjs';

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  environment: Deno.env.get('ENVIRONMENT') ?? 'development',
  tracesSampleRate: 0.2,
});
```

### Capturing Errors

```typescript
// Wrapper for server actions
export async function withErrorTracking<T>(
  action: () => Promise<T>,
  context: { userId?: string; action: string },
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setUser({ id: context.userId });
      scope.setTag('action', context.action);
      Sentry.captureException(error);
    });
    throw error;
  }
}
```

## Error Grouping Rules

- Group by error message + stack trace fingerprint
- Different HTTP status codes on the same endpoint are separate groups
- Payment errors grouped by error code (see Book 11 error catalog)
- Wallet errors grouped by wallet type + error code

## Error Retention

| Environment | Retention |
|-------------|-----------|
| Production | 90 days |
| Staging | 30 days |
| Preview | 7 days |
