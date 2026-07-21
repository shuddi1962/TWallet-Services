# Operations — Incident Playbook

## P1 Playbook: Full Platform Down

### Detection
- Uptime Robot alert or Sentry critical alert
- Complete loss of API availability

### Immediate (First 5 min)
1. Acknowledge alert
2. Check Vercel Dashboard for recent deployment
3. Check Supabase Dashboard for database status
4. Notify Slack #incidents
5. Rollback immediately if deploy-related

### Investigation
1. Check Vercel build logs
2. Check Supabase database connectivity
3. Check DNS resolution
4. Check SSL certificate validity
5. Check external dependencies (Alchemy, WalletConnect)

### Mitigation
1. Rollback Vercel deployment
2. Initiate database PITR if data corruption
3. Switch to backup RPC provider

## P1 Playbook: Payment Verification Failure

### Detection
- Alert: payment verification failure rate > 1%

### Immediate (First 5 min)
1. Acknowledge alert
2. Check Sentry for payment errors
3. Check Edge Function logs
4. Notify Slack #incidents

### Investigation
1. Identify error codes
2. Check RPC endpoint health
3. Check receiving wallet address
4. Check for double-spend

### Mitigation
1. Switch to backup RPC
2. Manual reconciliation if double-spend
3. Disable payments via feature flag if systemic bug

## P2 Playbook: Degraded Performance

### Detection
- Sentry alert: p95 > 1s for 5+ minutes

### Investigation
1. Check Sentry Performance for slow endpoints
2. Check database query performance
3. Check for slow queries
4. Check connection pool

### Mitigation
1. Kill long-running queries
2. Add missing indexes
3. Optimize N+1 queries
