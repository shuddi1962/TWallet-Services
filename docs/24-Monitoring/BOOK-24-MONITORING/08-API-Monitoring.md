# API Monitoring

## Tracked Metrics

Every API endpoint MUST be monitored for:

| Metric | Description | Threshold |
|--------|-------------|-----------|
| Response time (p50) | Median latency | < 200 ms |
| Response time (p95) | 95th percentile latency | < 500 ms |
| Response time (p99) | 99th percentile latency | < 1 s |
| Error rate | 5xx / total requests | < 1% |
| Request rate | Requests per minute | Trend-based |
| Throttled requests | 429 responses | < 5% of total |

## Endpoint Groups

### Public Endpoints

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/api/health` | GET | Critical |
| `/api/ready` | GET | Critical |

### Auth Endpoints

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/auth/signup` | POST | High |
| `/auth/login` | POST | High |
| `/auth/callback` | GET | High |
| `/auth/logout` | POST | High |

### API Endpoints (Route Handlers)

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/api/users/*` | GET/PUT | High |
| `/api/wallets/*` | GET/POST | High |
| `/api/cards/*` | GET/POST | High |
| `/api/orders/*` | GET/POST | High |
| `/api/payments/*` | GET/POST | Critical |
| `/api/notifications/*` | GET/POST | Medium |
| `/api/admin/*` | GET/POST | High |

### Webhook Endpoints

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/api/webhooks/payment` | POST | Critical |
| `/api/webhooks/email` | POST | Low |

## Slow Endpoint Detection

Any endpoint exceeding the p95 threshold is flagged:

1. Flagged endpoint added to "Slow Endpoints" dashboard widget
2. Slack notification sent to #performance if sustained > 5 minutes
3. Weekly performance review includes top 5 slowest endpoints

## Monitoring Implementation

```typescript
// src/lib/monitor.ts
import { Sentry } from './sentry';

export function monitorApi(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const start = performance.now();
    const url = new URL(req.url);

    try {
      const response = await handler(req);
      const duration = performance.now() - start;

      Sentry.metrics.distribution('api.duration_ms', duration, {
        tags: {
          method: req.method,
          path: url.pathname,
          status: response.status.toString(),
        },
      });

      return response;
    } catch (error) {
      const duration = performance.now() - start;
      Sentry.metrics.distribution('api.duration_ms', duration, {
        tags: { method: req.method, path: url.pathname, status: '500' },
      });
      Sentry.captureException(error);
      throw error;
    }
  };
}
```
