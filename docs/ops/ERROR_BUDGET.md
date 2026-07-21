# Error Budget

## Definition

Error budget is the maximum allowed downtime or failure rate within an SLO period. It is calculated as:

```
Error Budget = (1 - SLO Target) × Measurement Period
```

If the error budget is exhausted, releases are paused until reliability is restored.

## Current Budgets (30-day rolling window)

### Tier 1 (99.99%)

| Service | Budget Used | Budget Remaining | Status |
|---------|-------------|------------------|--------|
| Payment verification | 0 min / 4.32 min | 4.32 min | ✅ Healthy |
| Auth service | 0 min / 4.32 min | 4.32 min | ✅ Healthy |
| Database availability | 0 min / 4.32 min | 4.32 min | ✅ Healthy |
| API gateway | 0 min / 4.32 min | 4.32 min | ✅ Healthy |

### Tier 2 (99.9%)

| Service | Budget Used | Budget Remaining | Status |
|---------|-------------|------------------|--------|
| Card management | 0 min / 43.2 min | 43.2 min | ✅ Healthy |
| Transaction history | 0 min / 43.2 min | 43.2 min | ✅ Healthy |
| Storage | 0 min / 43.2 min | 43.2 min | ✅ Healthy |
| Realtime | 0 min / 43.2 min | 43.2 min | ✅ Healthy |

### Tier 3 (99%)

| Service | Budget Used | Budget Remaining | Status |
|---------|-------------|------------------|--------|
| Admin portal | 0 min / 7.2 hr | 7.2 hr | ✅ Healthy |
| Customer dashboard | 0 min / 7.2 hr | 7.2 hr | ✅ Healthy |
| Public marketing | 0 min / 7.2 hr | 7.2 hr | ✅ Healthy |

## Error Budget Policy

| Budget Remaining | Action |
|------------------|--------|
| > 50% | Normal operations, deploy freely |
| 25–50% | Caution: thorough review of changes |
| 10–25% | Warning: reduce deployment frequency |
| < 10% | Freeze: only critical bug fixes and security patches |
| Exhausted | Full freeze until reliability restored |

## Burn Rate Alerting

| Burn Rate | Time to Exhaustion | Alert |
|-----------|-------------------|-------|
| Fast (> 10×) | < 3 days | Critical alert to on-call |
| Medium (2–10×) | 3–15 days | Warning to team |
| Slow (< 2×) | > 15 days | Info / monitoring |
