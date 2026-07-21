# Performance Monitoring

## Web Vitals

All Core Web Vitals MUST be measured and reported:

| Metric | Target (Good) | Threshold (Needs Improvement) | Poor |
|--------|---------------|-------------------------------|------|
| LCP (Largest Contentful Paint) | < 1.5s | 1.5s – 2.5s | > 2.5s |
| FID (First Input Delay) | < 100ms | 100ms – 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 – 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | < 200ms | 200ms – 500ms | > 500ms |
| TTFB (Time to First Byte) | < 800ms | 800ms – 1.8s | > 1.8s |

## Collection

Vercel Analytics automatically captures Web Vitals for all routes. Send to Sentry for correlation with errors:

```typescript
// src/lib/reportWebVitals.ts
export function reportWebVitals(metric: any) {
  Sentry.metrics.distribution(
    `web_vital.${metric.name}`,
    metric.value,
    { unit: metric.name === 'CLS' ? '' : 'millisecond' },
  );
}
```

## Custom Performance Metrics

| Metric | Method | Where |
|--------|--------|-------|
| Page render time | `performance.mark()` / `performance.measure()` | Client |
| API call duration | Wrapped fetch with timing | Client + Server |
| Wallet connection time | `performance.now()` around connect | Client |
| Payment confirmation time | Edge Function log duration | Server |
| Database query time | pg_stat_statements | Server |
| Edge function cold start | Sentry span | Server |

## Performance Budgets

| Asset | Budget | Source |
|-------|--------|--------|
| Total JS (initial load) | < 200 KB | Lighthouse |
| Total CSS | < 50 KB | Lighthouse |
| Largest image | < 200 KB | Lighthouse |
| Fonts | < 50 KB total | Lighthouse |
| API response (p50) | < 200 ms | Sentry |
| API response (p95) | < 500 ms | Sentry |
| Edge function (p50) | < 2 s | Sentry |
| Edge function (p95) | < 5 s | Sentry |

## Monitoring Tools

| Tool | What It Monitors |
|------|------------------|
| Vercel Analytics | Web Vitals, traffic, routes |
| Sentry Performance | API durations, frontend spans, Edge Function traces |
| Lighthouse CI | Bundle analysis, performance score |
| Supabase Dashboard | Query performance, slow queries |
