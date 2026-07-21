# Incident Management

## Incident Lifecycle

```text
Detect → Alert → Investigate → Mitigate → Recover → Review → Document
```

## Severity Levels

| SEV | Definition | Response SLA | Escalation |
|-----|------------|--------------|------------|
| SEV-1 | Platform down, payments failing, data loss | < 15 min | CTO immediately |
| SEV-2 | Partial outage, degraded performance | < 1 hour | Tech Lead |
| SEV-3 | Minor issue, non-critical bug | < 24 hours | Developer |
| SEV-4 | Cosmetic, enhancement request | Next sprint | Product Manager |

## Incident Workflow

### 1. Detection

Sources:
- Automated alerts (Sentry, Uptime Robot, Supabase)
- User reports via support tickets
- Manual observation during deployment

### 2. Alert

Channel: Slack #incidents + on-call SMS (SEV-1/2)

```text
[ALERT] SEV-1: Payment verification failure rate > 1%
  Started: 2026-07-21T09:15:00Z
  Duration: 2 minutes
  Impact: 15 failed verifications
  Assigned: @oncall
```

### 3. Investigate

Steps:
1. Check Sentry for error details
2. Check Supabase Logs for database/auth issues
3. Check Vercel Dashboard for recent deployments
4. Check Edge Function logs
5. Check Uptime Robot status
6. Determine root cause

### 4. Mitigate

Actions:
- Rollback recent deployment (if deploy-related)
- Disable feature via feature flag
- Scale resources (if capacity-related)
- Apply hotfix

### 5. Recover

- Verify mitigation resolved the issue
- Monitor for 30 minutes post-mitigation
- Confirm with stakeholders

### 6. Review

- Schedule post-mortem within 48 hours (SEV-1/2)
- Identify root cause
- Identify contributing factors
- Document lessons learned

### 7. Document

- Log incident in `ops/INCIDENT_LOG.md`
- Complete post-mortem template (`ops/POSTMORTEM_TEMPLATE.md`)
- Update runbook with new insights

## Incident Response Checklist

### First 5 Minutes

```
□ 1. Acknowledge the alert
□ 2. Determine severity
□ 3. Notify team (SEV-1: Slack #incidents)
□ 4. Check Sentry
□ 5. Check Supabase Logs
□ 6. Check Vercel Dashboard
□ 7. Check Uptime Robot
□ 8. Determine rollback or hotfix need
```

### Post-Incident

```
□ 1. Incident logged in INCIDENT_LOG.md
□ 2. Post-mortem completed (SEV-1/2)
□ 3. Action items created
□ 4. Runbook updated
□ 5. Team notified of resolution
```

## Blameless Culture

Incidents are learning opportunities, not blame opportunities. Post-mortems focus on system improvements, not individual error. All participants acted in good faith with the information available.
