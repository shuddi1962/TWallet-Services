# Operations — Maintenance Schedule

## Daily

| Time (UTC) | Task | Owner |
|------------|------|-------|
| 06:00 | Review overnight errors | Auto |
| 08:00 | Daily standup | Engineering |
| 18:00 | End-of-day check | On-call |

## Weekly

| Day | Task | Owner |
|-----|------|-------|
| Monday | Dependency review | Engineering |
| Tuesday | Performance review | Engineering |
| Wednesday | Security review | Security Lead |
| Thursday | Support review | Support Lead |
| Friday | Patch deploys | Engineering |

## Monthly

| Week | Task | Owner |
|------|------|-------|
| Week 1 | Dependency audit + backup verify | Engineering |
| Week 2 | Security audit | Security Lead |
| Week 3 | Performance + cost review | Tech Lead + CTO |
| Week 4 | KPI reporting + retrospective | Product + All |

## Quarterly

| Month | Task | Owner |
|-------|------|-------|
| Jan, Apr, Jul, Oct | Disaster recovery drill | Engineering |
| Jan, Apr, Jul, Oct | Secret rotation | Engineering |
| Jan, Jul | Penetration test | Security Lead |
| Apr, Oct | Architecture review | CTO + Engineering |

## Maintenance Windows

| Type | Window | Notice |
|------|--------|--------|
| Database migration | Tue/Thu 02:00–04:00 UTC | 48 hours |
| Infrastructure change | Monthly Sat 02:00–06:00 UTC | 1 week |
| Emergency fix | Any time | ASAP |
