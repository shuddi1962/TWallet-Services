# Observability — Incident Playbooks

## SEV-1 Incident: Platform Down

### Detection
- Uptime Robot alert or Sentry critical alert
- Complete loss of API availability

### Immediate Actions (First 5 min)
```
1. Acknowledge alert
2. Check Vercel Dashboard for recent deployment
3. Check Supabase Dashboard for database status
4. Notify Slack #incidents
5. If deploy-related: rollback immediately
```

### Investigation
```
1. Check Vercel build logs for failure
2. Check Supabase database connectivity
3. Check DNS resolution
4. Check SSL certificate validity
5. Check external dependency status (Alchemy, WalletConnect)
```

### Mitigation
```
1. Rollback Vercel deployment if deploy-related
2. Initiate database PITR if data corruption
3. Switch to backup RPC provider if Alchemy down
```

### Recovery
```
1. Verify API responds with 200
2. Verify auth flow works
3. Verify payment flow works
4. Monitor for 30 minutes
```

## SEV-1 Incident: Payment Verification Failure

### Detection
- Alert: payment verification failure rate > 1%
- User reports of payment failures via support

### Immediate Actions
```
1. Acknowledge alert
2. Check Sentry for payment errors
3. Check Edge Function logs
4. Notify Slack #incidents
```

### Investigation
```
1. Identify error codes from payment Edge Function
2. Check if RPC endpoint is healthy
3. Check if receiving wallet address changed
4. Check if transaction was already used (double-spend)
```

### Mitigation
```
1. If RPC failure: switch to backup RPC
2. If double-spend: manual reconciliation
3. If systemic bug: disable payments via feature flag
```

### Recovery
```
1. Manually verify pending transactions
2. Re-process failed payments
3. Monitor success rate for 30 minutes
```

## SEV-2 Incident: Degraded Performance

### Detection
- Sentry alert: p95 > 1s for 5+ minutes
- User complaints about slow page loads

### Investigation
1. Check Sentry Performance for slow endpoints
2. Check database query performance
3. Check for slow queries (pg_stat_statements)
4. Check for connection pool exhaustion

### Mitigation
1. Kill long-running queries
2. Add missing indexes (write migration)
3. Optimize N+1 queries
4. Increase connection pool if needed

## Post-Incident

1. Complete post-mortem within 48 hours (SEV-1) or 7 days (SEV-2)
2. Log in `ops/INCIDENT_LOG.md`
3. Create action items
4. Update runbook
5. Schedule incident review

## Reference

See `24-Monitoring/BOOK-24-MONITORING/13-Incident-Management.md` for full specification.
