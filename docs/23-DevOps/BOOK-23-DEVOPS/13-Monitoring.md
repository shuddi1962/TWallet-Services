# Monitoring

## What to Monitor

| Category | Metric | Tool | Alert |
|----------|--------|------|-------|
| API | Response time (p50/p95/p99) | Sentry | p95 > 500ms |
| API | Error rate (5xx) | Sentry | > 1% |
| API | Request volume | Vercel Analytics | — |
| Auth | Login failure rate | Supabase Logs | > 5% |
| Auth | Session refresh errors | Sentry | > 1% |
| Wallet | Connection failures | Sentry | > 5% |
| payments | Verification failures | Edge Function logs | Any failure |
| payments | Verification timeout | Sentry | > 5s |
| Database | Query performance (p95) | Supabase Logs | > 100ms |
| Database | Connection pool usage | Supabase Logs | > 80% |
| Database | Replication lag | Supabase Logs | > 10s |
| Storage | Upload failures | Sentry | > 5% |
| Storage | Signed URL errors | Sentry | > 5% |
| Edge Functions | Execution time | Sentry | > 5s |
| Edge Functions | Error rate | Sentry | > 1% |
| Realtime | Connection count | Supabase Logs | — |
| Realtime | Message delivery | Supabase Logs | > 5% failure |
| Frontend | LCP | Vercel Analytics | > 2.5s |
| Frontend | CLS | Vercel Analytics | > 0.1 |
| Frontend | INP | Vercel Analytics | > 200ms |
| Frontend | JS errors | Sentry | > 1% of pageviews |
| Uptime | Site availability | Uptime Robot | < 99.9% |

## Monitoring Stack

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking, performance monitoring, cron monitoring, alerting |
| **Vercel Analytics** | Web Vitals, traffic analysis, edge function metrics |
| **Supabase Logs** | Database queries, Auth events, Storage access, Edge Function logs |
| **Uptime Robot** | External uptime monitoring (5 min intervals) |
| **PagerDuty** (future) | On-call alerting and escalation |

## Alert Channels

| Severity | Channels | Response Time |
|----------|----------|---------------|
| Critical | SMS + Slack + Email | < 15 min |
| High | Slack + Email | < 1 hour |
| Warning | Slack | < 24 hours |
| Info | Log only | — |

## Dashboards

- **Vercel Dashboard:** Deployments, analytics, functions
- **Supabase Dashboard:** Database, Auth, Storage, Realtime, Edge Functions
- **Sentry Dashboard:** Errors, performance, releases
- **Uptime Robot:** External status checks
