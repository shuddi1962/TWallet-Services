# Operations

## Operations Team

### Roles & Responsibilities

| Role | Name | Responsibilities |
|------|------|------------------|
| CTO | [Name] | Overall platform reliability, architecture decisions, escalation point |
| Tech Lead | [Name] | Deployment coordination, technical incident response, code review |
| Senior Developer | [Name] | Daily operations, monitoring, bug fixes |
| Support Lead | [Name] | Customer support, ticket triage, CSAT |
| Product Manager | [Name] | Release planning, stakeholder communication, roadmap |

### On-Call Rotation

| Week | Primary | Secondary |
|------|---------|-----------|
| Week 1 | Dev A | Dev B |
| Week 2 | Dev B | Dev C |
| Week 3 | Dev C | Dev A |
| Week 4 | Dev A | Dev C |

On-call hours:
- **Weekdays:** 09:00–18:00 (local) — standard support
- **Weekdays:** 18:00–09:00 — P1/P2 only
- **Weekends:** P1/P2 only

## Operational Cadence

| Frequency | Meeting | Attendees | Duration |
|-----------|---------|-----------|----------|
| Daily | Standup | Engineering | 15 min |
| Weekly | Ops review | Engineering + Support | 30 min |
| Weekly | Deployment | Engineering | 30 min |
| Monthly | Incident review | All | 1 hour |
| Monthly | Performance review | Engineering | 1 hour |
| Monthly | Security review | Engineering + Security | 1 hour |
| Quarterly | Disaster recovery drill | Engineering | 4 hours |
| Quarterly | Roadmap review | All | 2 hours |

## Communication Channels

| Channel | Purpose |
|---------|---------|
| Slack #general | Company-wide announcements |
| Slack #engineering | Technical discussion, PRs |
| Slack #incidents | Incident response coordination |
| Slack #deployments | Deployment notifications |
| Slack #support | Support handoff |
| Slack #security | Security alerts |
| Email | Formal notifications, reports |

## Operations Documentation

All operational procedures are documented in:

| Document | Location | Purpose |
|----------|----------|---------|
| RUNBOOK.md | `ops/` | Common operational procedures |
| ON_CALL_GUIDE.md | `ops/` | On-call responsibilities |
| INCIDENT_LOG.md | `ops/` | Incident history |
| POSTMORTEM_TEMPLATE.md | `ops/` | Post-incident analysis template |
| SLOs.md | `ops/` | Service level objectives |
| SLIs.md | `ops/` | Service level indicators |
| ERROR_BUDGET.md | `ops/` | Error budget tracking |
| DEPLOYMENT_CHECKLIST.md | `ops/` | Pre-deployment verification |
| RELEASE_CALENDAR.md | `ops/` | Release schedule |
| CHANGELOG.md | `ops/` | Release notes |
