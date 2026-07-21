# Post-Launch Monitoring

## First 24 Hours

| Interval | Tasks |
|----------|-------|
| Every 15 min | Check Sentry for new errors |
| Every 15 min | Check Uptime Robot status |
| Every hour | Check Vercel Analytics traffic |
| Every hour | Review recent orders and payments |
| Every hour | Review support tickets |
| Every hour | Review database connection pool |
| Every 2 hours | Run manual smoke test on core flows |

## First Week

| Check | Frequency | Tool |
|-------|-----------|------|
| Error rate | Daily | Sentry |
| API latency | Daily | Sentry |
| Orders | Daily | Supabase |
| Payments | Daily | Supabase |
| Wallet connections | Daily | Supabase |
| User registrations | Daily | Supabase |
| Support tickets | Daily | Support tool |
| Database health | Daily | Supabase Dashboard |
| Storage usage | Daily | Supabase Dashboard |
| Security alerts | Daily | Sentry + Logs |
| Backup completion | Daily | Backup script |

## Post-Launch Stability Report

After 7 days of stable operation, produce a launch report:

| Section | Content |
|---------|---------|
| Uptime | % uptime over 7 days |
| Errors | Total errors, resolved, open |
| Performance | CWV metrics, API latency |
| Usage | DAU/WAU, orders, payments |
| Support | Ticket count, CSAT, response time |
| Security | Incidents, threats blocked |
| Stability | Change requests, hotfixes needed |

## Exit Criteria for Launch Mode

The platform exits "launch mode" when all conditions are met:

- [ ] 7 days without a P1 incident
- [ ] Error rate < 1% for 7 days
- [ ] API p95 < 500ms for 7 days
- [ ] All support tickets from launch period resolved
- [ ] Post-launch review completed
- [ ] All action items from post-launch review assigned
