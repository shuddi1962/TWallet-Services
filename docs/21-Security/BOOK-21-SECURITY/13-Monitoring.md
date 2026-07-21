# Security Monitoring

## Monitored Events

| Event | Alert Level | Action |
|-------|-------------|--------|
| Failed login > 5 per 15 min | Warning | Log, rate limit already enforced |
| Repeated 403/401 responses | Warning | Monitor for scanning activity |
| High error rate (>5% in 5 min) | Critical | Page Sentry alert, notify on-call |
| Unusual order activity (bulk) | Warning | Flag orders for manual review |
| Webhook verification failure | Warning | Log, check provider status |
| Storage upload errors | Info | Log |
| Database connection errors | Critical | Page engineer |
| Edge Function timeout | Warning | Log, investigate |
| Realtime disconnection | Info | Log |
| Payment verification failure | High | Flag order, notify finance |
| Rate limit threshold hit | Info | Log for capacity planning |

## Monitoring Stack

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking, performance, cron monitoring |
| Vercel Analytics | Web vitals, traffic, edge function metrics |
| Supabase Logs | Database, Auth, Storage, Edge Function logs |
| Uptime Robot | External uptime monitoring |
| PagerDuty (future) | Incident alerting |

## Alert Channels

| Severity | Channel | Response |
|----------|---------|----------|
| Critical | SMS + email + Slack | Within 15 min |
| High | Email + Slack | Within 1 hour |
| Warning | Slack | Within 24 hours |
| Info | Log | No response needed |

## Dashboard Metrics

Security dashboard (admin) shows:

- Failed login attempts (24h chart)
- Active sessions count
- Flagged orders count
- Rate limit hits
- Audit log volume
- Error rate by endpoint
- Recent security events
