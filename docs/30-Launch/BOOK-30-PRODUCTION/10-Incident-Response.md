# Incident Response

## Severity Levels

| Severity | Definition | Response SLA | Escalation |
|----------|------------|--------------|------------|
| P1 | Critical outage — platform down, payments failing, data loss | < 15 min | CTO |
| P2 | Major feature failure — degraded experience, partial outage | < 1 hour | Tech Lead |
| P3 | Minor bug — non-critical, workaround available | < 24 hours | Developer |
| P4 | Enhancement — cosmetic, nice-to-have | Next sprint | Product Manager |

## Incident Workflow

```text
       Detect
         │
         ▼
       Assess (severity, impact, scope)
         │
         ▼
       Assign (on-call engineer)
         │
         ▼
       Mitigate (rollback, feature flag, hotfix)
         │
         ▼
       Recover (verify resolution, monitor)
         │
         ▼
       Postmortem (within 48 hours for P1/P2)
```

## P1 Incident Response

### Detect

Sources:
- Sentry critical alert
- Uptime Robot down alert
- Multiple user reports

### Assess (2 min)

1. Check Sentry for error details
2. Check Vercel Dashboard for deployment status
3. Check Supabase Dashboard for database status
4. Determine scope: full platform or feature-specific

### Assign (1 min)

1. Notify Slack #incidents with severity + context
2. On-call engineer acknowledges
3. Escalate to CTO if not resolved in 15 min

### Mitigate (15 min)

1. **If deploy-related:** `vercel rollback` immediately
2. **If database-related:** Check connection pool, kill blocking queries, initiate PITR if needed
3. **If payment-related:** Disable payments via feature flag, verify receiving wallet
4. **If wallet-related:** Check Alchemy RPC status, switch to backup RPC

### Recover (30 min)

1. Verify all health endpoints return 200
2. Verify auth flow works
3. Verify payment flow works
4. Monitor Sentry for recurrence

### Postmortem (48 hours)

1. Complete postmortem template (see `ops/POSTMORTEM_TEMPLATE.md`)
2. Log incident in `ops/INCIDENT_LOG.md`
3. Create action items
4. Schedule incident review

## Incident Communication

| Channel | Audience | Update Frequency |
|---------|----------|-----------------|
| Slack #incidents | Internal team | Every 30 min |
| Status page | Customers | Every hour (P1 only) |
| Email | Affected users | After resolution (P1 only) |

## Incident Resources

- **Runbook:** `ops/RUNBOOK.md`
- **Incident log:** `ops/INCIDENT_LOG.md`
- **Postmortem template:** `ops/POSTMORTEM_TEMPLATE.md`
- **On-call guide:** `ops/ON_CALL_GUIDE.md`
