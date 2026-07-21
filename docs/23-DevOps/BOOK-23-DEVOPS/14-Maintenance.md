# Maintenance

## Daily

```
☐ Review Sentry errors (new issues)
☐ Check Supabase Logs for anomalies
☐ Verify backup completion
```

## Weekly

```
☐ Review error trends in Sentry
☐ Check dependency updates (Dependabot PRs)
☐ Review Supabase project usage
☐ Team standup: ops review
```

## Monthly

```
☐ Performance review (Lighthouse report)
☐ Backup integrity check
☐ Security review (access logs review)
☐ Dependency audit + update
☐ Review and update runbooks
☐ Capacity planning review
```

## Quarterly

```
☐ Disaster recovery test
☐ Restore test (database from backup)
☐ Full dependency audit
☐ Secret rotation
☐ Access review (admin users, API keys)
☐ Security audit + penetration test
☐ Performance audit
☐ Budget review (Vercel, Supabase, third-party services)
☐ Update on-call schedule
☐ Update documentation
```

## Maintenance Windows

| Type | Window | Notice | Approval |
|------|--------|--------|----------|
| Database migration | Tue/Thu 02:00–04:00 UTC | 48 hours | Tech Lead |
| Dependency update | Weekly Tuesday | — | Developer |
| Infrastructure change | Monthly Saturday 02:00–06:00 UTC | 1 week | CTO |
| Emergency fix | Any time | As soon as possible | CTO |

## Dependency Update Policy

| Type | Cadence | Review |
|------|---------|--------|
| Patch | Auto (Dependabot PR) | Quick review |
| Minor | Monthly | Standard review |
| Major | Quarterly | Full review + QA |
| Security | Within 7 days | Expedited |

## On-Call

| Role | Responsibility |
|------|----------------|
| Primary on-call | Respond to alerts within 15 min (SEV-1) |
| Secondary on-call | Backup, assist with incidents |
| Incident lead | Coordinate response for SEV-1/SEV-2 |
