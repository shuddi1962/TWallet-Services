# Observability — SLOs

## Service Level Objectives

| Tier | Service | SLO | Error Budget (30 days) |
|------|---------|-----|------------------------|
| Critical | API uptime | 99.9% | 43 min |
| Critical | Database | 99.99% | 4.3 min |
| Critical | Auth service | 99.9% | 43 min |
| Critical | Payment verification | 99.0% | 7.2 hours |
| High | API latency (p95 < 500ms) | 99.5% | 3.6 hours |
| High | LCP < 2.5s | 99.5% | 3.6 hours |
| Standard | Admin portal | 99.0% | 7.2 hours |

## Error Budget Policy

| Remaining | Action |
|-----------|--------|
| > 50% | Normal operations |
| 25–50% | Caution |
| 10–25% | Reduce deploys |
| < 10% | Freeze |
| Exhausted | Full freeze |

## Burn Rate Alerts

| Rate | Time to Exhaust | Alert |
|------|-----------------|-------|
| > 10x | < 3 days | Critical |
| 2–10x | 3–15 days | Warning |
| < 2x | > 15 days | Info |

## Reference

See `24-Monitoring/BOOK-24-MONITORING/14-SLI-SLO.md` for full specification.
