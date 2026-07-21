# Logging Standard

## Format

All logs MUST be emitted as structured JSON with the following fields.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 UTC | When the event occurred |
| `level` | string | One of: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` |
| `service` | string | Service name (e.g., `orders`, `auth`, `payments`) |
| `requestId` | string | Unique request identifier |
| `correlationId` | string | End-to-end request trace ID |
| `environment` | string | `local`, `preview`, `staging`, `production` |
| `message` | string | Human-readable event description |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Authenticated user ID |
| `action` | string | Business action (e.g., `order_created`, `payment_verified`) |
| `duration` | number | Operation duration in milliseconds |
| `error` | object | Error details (name, message, stack trace) |
| `metadata` | object | Additional context |

## Log Levels

| Level | Usage |
|-------|-------|
| `DEBUG` | Development/diagnostic detail; disabled in production |
| `INFO` | Normal operations (order created, user registered) |
| `WARN` | Unexpected but handled (retry succeeded, rate limit approached) |
| `ERROR` | Failure requiring investigation |
| `FATAL` | Unrecoverable; immediate attention required |

## Never Log

- Passwords or password hashes
- Private keys or recovery phrases
- Seed phrases or mnemonics
- JWT tokens or session tokens
- Service role keys or API secrets
- Full credit card numbers
- Personal data beyond necessity (GDPR)

## Example

```json
{
  "timestamp": "2026-07-21T09:12:31Z",
  "level": "INFO",
  "service": "orders",
  "requestId": "req_01ABC",
  "correlationId": "trace_001",
  "environment": "production",
  "userId": "user_123",
  "action": "order_created",
  "message": "New card order created",
  "metadata": {
    "orderId": "ord_456",
    "cardType": "virtual",
    "amount": 50
  }
}
```

## Implementation

### Server-Side Logging (Vercel Edge / Node.js)

```typescript
export function log(
  level: LogLevel,
  service: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    requestId: context?.requestId ?? crypto.randomUUID(),
    environment: process.env.VERCEL_ENV ?? 'local',
    message,
    ...context,
  };

  if (level === 'FATAL' || level === 'ERROR') {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}
```

### Client-Side Logging

Client logs are limited to `WARN` and above to reduce noise. Send to Sentry for error tracking and omit sensitive data.

```typescript
export function clientLog(
  level: 'WARN' | 'ERROR',
  message: string,
  context?: Record<string, unknown>,
): void {
  const sanitized = { ...context };
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.key;

  if (level === 'ERROR') {
    console.error(JSON.stringify({ level, message, ...sanitized }));
  } else {
    console.warn(JSON.stringify({ level, message, ...sanitized }));
  }
}
```

## Log Retention

| Environment | Retention | Storage |
|-------------|-----------|---------|
| production | 90 days | Vercel Logs + Sentry |
| staging | 30 days | Vercel Logs |
| preview | 7 days | Vercel Logs |
| local | N/A | Console |
