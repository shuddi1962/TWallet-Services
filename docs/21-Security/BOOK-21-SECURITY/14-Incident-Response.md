# Incident Response

## Severity Levels

| Level | Definition | Examples | Response Time |
|-------|-----------|----------|---------------|
| SEV-1 | Critical — active financial loss, data breach | Payment verification bypass, unauthorized admin access | Immediate, < 15 min |
| SEV-2 | High — significant impact, no financial loss | Extended outage, RLS bypass on non-financial data | < 1 hour |
| SEV-3 | Medium — degraded experience | Slow queries, rate limit issues, UI bugs | < 24 hours |
| SEV-4 | Low — cosmetic or informational | Styling issues, non-functional | Next sprint |

## Response Process

```
1. DETECT   — Automated alert or user report
2. ASSESS   — Determine severity, assign incident lead
3. CONTAIN  — Stop active damage (disable feature, rollback)
4. INVESTIGATE — Root cause analysis
5. RECOVER  — Apply fix, verify, restore
6. REVIEW   — Post-mortem within 48 hours
7. DOCUMENT — Update runbooks, add to lessons learned
```

## Incident Runbook: Payment Verification Failure

### Detection
- Edge Function returns error or timeout
- Payment status stuck on "pending" for > 1 hour
- Monitoring alert on `verify-payment` function

### Assessment
- Is this one user or all users?
- Is the blockchain RPC endpoint responding?
- Is the transaction on-chain?

### Containment
- Flag affected orders (prevent auto-confirm)
- Switch to backup RPC provider if available
- Notify finance team

### Investigation
- Check Sentry for function errors
- Check Alchemy status page
- Verify transaction on block explorer
- Review function logs in Supabase

### Recovery
- Re-run verification manually via admin dashboard
- If RPC issue: switch to backup provider
- If code issue: deploy fix, re-verify pending orders

### Post-Mortem
- Document timeline
- Identify root cause
- Add monitoring if missing
- Update runbook

## Communication

| Audience | Channel | Timing |
|----------|---------|--------|
| Internal team | Slack #incidents | Immediate |
| Engineering | Slack #engineering | Within 15 min |
| Support | Internal ticket | Within 30 min |
| Customers | Status page | SEV-1 only, within 1 hour |
