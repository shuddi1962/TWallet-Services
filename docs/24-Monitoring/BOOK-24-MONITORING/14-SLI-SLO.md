# SLIs & SLOs

## Service Level Indicators (SLIs)

### Availability SLIs

| Indicator | Source | Target |
|-----------|--------|--------|
| API availability | Uptime Robot | 99.9% |
| Database availability | Supabase | 99.99% |
| Auth service availability | Sentry / Vercel | 99.9% |
| Payment verification availability | Edge Function logs | 99.0% |

### Performance SLIs

| Indicator | Source | Target |
|-----------|--------|--------|
| API response time (p50) | Sentry | < 200 ms |
| API response time (p95) | Sentry | < 500 ms |
| API response time (p99) | Sentry | < 1 s |
| Page load (LCP) | Vercel Analytics | < 1.5 s |
| Page layout shift (CLS) | Vercel Analytics | < 0.1 |
| Interaction delay (INP) | Vercel Analytics | < 200 ms |

### Quality SLIs

| Indicator | Source | Target |
|-----------|--------|--------|
| API error rate (5xx) | Sentry | < 1% |
| Auth success rate | Supabase Auth | > 95% |
| Payment success rate | Edge Function logs | > 95% |
| Wallet connection success rate | Client events | > 90% |

## Service Level Objectives (SLOs)

### Tier 1 — Critical (99.9%+)

| Service | SLO | Measurement Period | Error Budget |
|---------|-----|-------------------|--------------|
| API uptime | 99.9% | 30 days | 43 minutes |
| Auth service | 99.9% | 30 days | 43 minutes |
| Database | 99.99% | 30 days | 4.3 minutes |
| Payment verification | 99.0% | 30 days | 7.2 hours |

### Tier 2 — High (99.5%+)

| Service | SLO | Measurement Period | Error Budget |
|---------|-----|-------------------|--------------|
| API performance (p95 < 500 ms) | 99.5% | 30 days | 3.6 hours |
| Page load LCP (< 2.5 s) | 99.5% | 30 days | 3.6 hours |
| Storage | 99.9% | 30 days | 43 minutes |

### Tier 3 — Standard (99%+)

| Service | SLO | Measurement Period | Error Budget |
|---------|-----|-------------------|--------------|
| Admin portal | 99.0% | 30 days | 7.2 hours |
| Support ticket response | 99.0% | 30 days | 7.2 hours |

## Error Budget Policy

| Budget Remaining | Action |
|------------------|--------|
| > 50% | Normal operations |
| 25–50% | Caution: review changes |
| 10–25% | Warning: reduce deploys |
| < 10% | Freeze: critical fixes only |
| Exhausted | Full freeze until recovery |

## Burn Rate Alerts

| Rate | Time to Exhaustion | Alert |
|------|--------------------|-------|
| Fast (> 10x) | < 3 days | Critical |
| Medium (2–10x) | 3–15 days | Warning |
| Slow (< 2x) | > 15 days | Info |
