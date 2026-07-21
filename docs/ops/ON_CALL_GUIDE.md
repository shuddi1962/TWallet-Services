# On-Call Guide

## Before Your Shift

- [ ] Verify you have access to all dashboards (Vercel, Supabase, Sentry, Uptime Robot)
- [ ] Verify incident response phone/notifications are configured
- [ ] Review recent incidents and known issues
- [ ] Ensure laptop charged and internet stable
- [ ] Review runbook updates

## During Your Shift

- [ ] Respond to alerts within SLAs (SEV-1: 15 min, SEV-2: 1 hour)
- [ ] Acknowledge alerts immediately when actionable
- [ ] Log all incidents in INCIDENT_LOG.md
- [ ] Communicate status in Slack #incidents
- [ ] Escalate when stuck or SEV-1 confirmed
- [ ] Document steps taken for post-mortem

## Handoff

- [ ] Summarize active incidents to incoming on-call
- [ ] Transfer any open investigations
- [ ] Update runbook with any new procedures
- [ ] Confirm incoming on-call has access to everything

## Checklist: First 5 Minutes of an Alert

```
1. □ Acknowledge the alert
2. □ Determine severity (SEV-1 through SEV-4)
3. □ For SEV-1: Notify team in Slack #incidents
4. □ Check Sentry for error details
5. □ Check Supabase Logs for database/auth issues
6. □ Check Vercel Dashboard for deployment issues
7. □ Check Uptime Robot for site availability
8. □ Determine if rollback or hotfix needed
9. □ Communicate ETA to stakeholders (SEV-1 only)
10. □ Begin remediation
```

## On-Call Hours

- **Weekdays:** 09:00–18:00 (local time) — standard support
- **Weekdays:** 18:00–09:00 — only SEV-1/SEV-2 alerts
- **Weekends:** Follow-the-sun handoff for SEV-1/SEV-2
- **Holidays:** Reduced coverage, SEV-1 only
