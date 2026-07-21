# Service Level Objectives (SLOs)

## Tier 1 — Critical (99.99% uptime target)

| Service | Target | Measurement Period | Error Budget |
|---------|--------|-------------------|--------------|
| Payment verification | 99.99% success | 30 days | 4.32 min downtime |
| Auth service | 99.99% success | 30 days | 4.32 min downtime |
| Database availability | 99.99% uptime | 30 days | 4.32 min downtime |
| API gateway | 99.99% uptime | 30 days | 4.32 min downtime |

## Tier 2 — High (99.9% uptime target)

| Service | Target | Measurement Period | Error Budget |
|---------|--------|-------------------|--------------|
| Card management | 99.9% success | 30 days | 43.2 min downtime |
| Transaction history | 99.9% success | 30 days | 43.2 min downtime |
| Storage | 99.9% success | 30 days | 43.2 min downtime |
| Realtime | 99.9% success | 30 days | 43.2 min downtime |

## Tier 3 — Standard (99% uptime target)

| Service | Target | Measurement Period | Error Budget |
|---------|--------|-------------------|--------------|
| Admin portal | 99% success | 30 days | 7.2 hours downtime |
| Customer dashboard | 99% success | 30 days | 7.2 hours downtime |
| Public marketing site | 99% success | 30 days | 7.2 hours downtime |

## Performance SLOs

| Metric | Target | Measurement Period |
|--------|--------|-------------------|
| API response time (p50) | < 200 ms | 30 days |
| API response time (p95) | < 500 ms | 30 days |
| API response time (p99) | < 1 s | 30 days |
| Page load (LCP) | < 2.5 s | 30 days |
| Page load (CLS) | < 0.1 | 30 days |
| Page load (INP) | < 200 ms | 30 days |
| Deployment frequency | > 1 per week | 30 days |
| Time to detect (SEV-1) | < 5 min | 30 days |
| Time to resolve (SEV-1) | < 1 hour | 30 days |
