# Incident Runbook — Payment Verification Failure

> Full incident response plan in `21-Security/BOOK-21-SECURITY/14-Incident-Response.md`

## SEV-1: Payment Verification Bypass

### Detection
- Suspicious order marked "paid" without matching on-chain tx
- Alert from monitoring: `payment-verification-error`
- Manual report from finance team

### Assessment (5 min)
1. Check Supabase logs for `verify-payment` function
2. Check Sentry for errors
3. Check Alchemy status: [status.alchemy.com](https://status.alchemy.com)
4. Verify transaction on block explorer
5. Is this one user or all users?

### Containment (10 min)
1. Disable `verify-payment` Edge Function
2. Flag all pending orders for manual review
3. Revoke any suspiciously confirmed payments
4. Notify security team via Slack #incidents

### Investigation
1. Review function code for logic errors
2. Check RPC response for anomalies
3. Review recent deployments
4. Check for compromised credentials

### Recovery
1. Deploy fix
2. Re-enable function
3. Re-verify pending orders
4. Notify affected users if needed

### Post-Mortem
1. Document timeline
2. Identify root cause
3. Add regression test
4. Update runbook
5. Report to leadership

## Runbook: RPC Provider Outage

### Steps
1. Verify: check Alchemy status page
2. Fallback: switch to backup RPC URL
3. Queue: pending verifications retried automatically
4. Notify: team Slack #incidents

## Runbook: Webhook Failure

### Steps
1. Check webhook signature verification
2. Verify secret hasn't changed
3. Check provider IP hasn't changed
4. Replay webhook from provider dashboard
