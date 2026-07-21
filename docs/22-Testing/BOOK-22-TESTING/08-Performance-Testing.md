# Performance Testing

## Metrics & Budgets

| Metric | Target | Tool |
|--------|--------|------|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse CI |
| Interaction to Next Paint (INP) | < 200ms | Lighthouse CI / Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse CI |
| Time to First Byte (TTFB) | < 800ms | Lighthouse CI |
| First Contentful Paint (FCP) | < 1.8s | Lighthouse CI |
| Speed Index | < 3.4s | Lighthouse CI |
| API latency (p95) | < 500ms | k6 |
| Database query time (p95) | < 100ms | Supabase Logs |
| Realtime event latency | < 200ms | Custom monitoring |
| Edge Function cold start | < 500ms | Sentry |
| Lighthouse Performance score | > 90 | Lighthouse CI |

## Load Testing

### k6 Script (Payment Verification)

```js
import http from "k6/http"
import { check, sleep } from "k6"

export const options = {
  stages: [
    { duration: "2m", target: 50 },  // ramp up
    { duration: "5m", target: 50 },  // stay
    { duration: "2m", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.01"],
  },
}

export default function () {
  const res = http.post("/api/payments/verify", {
    txHash: "0x...",
    orderId: "uuid",
  }, {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  })
  check(res, { "status is 200": (r) => r.status === 200 })
  sleep(1)
}
```

## Database Performance

- All queries should use indexes — verify with EXPLAIN ANALYZE
- No sequential scans on tables with > 10K rows
- Pagination uses cursor-based (keyset) pattern
- N+1 query detection in test suite

## Performance Testing Schedule

| Frequency | Tests |
|-----------|-------|
| Every PR | Lighthouse CI (desktop + mobile) |
| Daily | Core Web Vitals monitoring |
| Weekly | k6 load test (staging) |
| Monthly | Full Lighthouse report + bundle analysis |
| Pre-release | Full performance audit |
