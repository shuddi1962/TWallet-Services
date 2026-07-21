# Alerting

## Alert Conditions

### Critical (Immediate response — < 15 minutes)

| Condition | Severity | Channel |
|-----------|----------|---------|
| API error rate > 5% (rolling 5 min) | Critical | SMS + Slack + Email |
| Database connection failure | Critical | SMS + Slack + Email |
| Payment verification failure rate > 1% | Critical | SMS + Slack + Email |
| Wallet provider RPC failure | Critical | SMS + Slack + Email |
| Storage bucket unreachable | Critical | SMS + Slack + Email |

### High (Fast response — < 1 hour)

| Condition | Severity | Channel |
|-----------|----------|---------|
| API p95 latency > 1 second | High | Slack + Email |
| Auth login failure rate > 10% | High | Slack + Email |
| Edge function error rate > 5% | High | Slack + Email |
| Database connection pool > 80% | High | Slack + Email |
| Realtime disconnection rate > 5% | High | Slack + Email |

### Warning (Same-day response)

| Condition | Severity | Channel |
|-----------|----------|---------|
| Slow queries detected (> 1 second) | Warning | Slack |
| Storage usage > 80% | Warning | Slack |
| Daily active users drop > 20% | Warning | Slack |
| Certificate expiry < 30 days | Warning | Slack |
| Unusual traffic pattern | Warning | Slack |

## Alert Routing

| Alert Type | Primary | Secondary | Escalation |
|------------|---------|-----------|------------|
| Infrastructure | On-call engineer | Tech Lead | CTO (15 min) |
| Security | Security Lead | CTO | CEO (1 hour) |
| Payment | On-call engineer | Payment Lead | CTO (10 min) |
| Business | Product Manager | Tech Lead | COO (4 hours) |

## Alert Fatigue Prevention

- No alert fires more than once per 5 minutes per condition (cooldown)
- Alerts auto-resolve when condition clears
- Weekly alert review to tune thresholds and remove noisy alerts
- Maintenance windows suppress alerts during scheduled changes

## Implementation

### Sentry Alert Rules

```
Rule: High Error Rate
  Condition: error count > 50 in 5 minutes
  Action: Send to Slack #incidents + PagerDuty

Rule: Critical Error
  Condition: error level = FATAL
  Action: Send to Slack #incidents + SMS on-call

Rule: Performance Degradation
  Condition: p95 duration > 1000ms
  Action: Send to Slack #performance
```

### Uptime Robot Alert Rules

```
Monitor: Production Site (HTTPS)
  Check interval: 5 minutes
  Alert when: down for 2 consecutive checks
  Alert via: SMS + email

Monitor: API Health (/api/health)
  Check interval: 5 minutes
  Alert when: non-200 response
  Alert via: SMS + email
```
