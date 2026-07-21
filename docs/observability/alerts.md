# Observability — Alerts

## Alert Tiers

### Tier 1 — Critical (< 15 min response)

| Alert | Condition | Channel |
|-------|-----------|---------|
| API Down | Uptime Robot detects failure | SMS + Slack |
| High Error Rate | API 5xx > 5% (5 min) | SMS + Slack |
| Database Offline | Health check fails | SMS + Slack |
| Payment Failure | Verification failure > 1% | SMS + Slack |
| Storage Unreachable | Storage health check fails | SMS + Slack |

### Tier 2 — High (< 1 hour response)

| Alert | Condition | Channel |
|-------|-----------|---------|
| High Latency | p95 > 1s (5 min) | Slack + Email |
| High Login Failure | Auth failure > 10% | Slack + Email |
| Connection Pool | Pool usage > 80% | Slack |
| Edge Function Errors | Error rate > 5% | Slack |

### Tier 3 — Warning (Same day)

| Alert | Condition | Channel |
|-------|-----------|---------|
| Slow Queries | > 5/min exceeding 1s | Slack |
| Storage Usage | Usage > 80% | Slack |
| Certificate Expiry | < 30 days | Slack |
| Unusual Traffic | Spike > 300% of baseline | Slack |

## Alert Routing

- **Infrastructure:** On-call engineer → Tech Lead → CTO (15 min)
- **Security:** Security Lead → CTO → CEO (1 hour)
- **Payment:** On-call → Payment Lead → CTO (10 min)
- **Business:** Product Manager → Tech Lead → COO (4 hours)

## Alert Fatigue Prevention

- 5-minute cooldown between identical alerts
- Auto-resolve when condition clears
- Weekly alert review and tuning
- Maintenance windows suppress alerts

## Reference

See `24-Monitoring/BOOK-24-MONITORING/04-Alerting.md` for full specification.
