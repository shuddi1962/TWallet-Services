# Maintenance

## Daily Maintenance

| Task | Responsible | Tool |
|------|-------------|------|
| Review Sentry errors | Engineering | Sentry |
| Review failed payments | Engineering | Supabase |
| Review open support tickets | Support | Support tool |
| Verify backups completed | Engineering | Backup script |
| Review database connections | Engineering | Supabase Dashboard |

## Weekly Maintenance

| Day | Task | Responsible |
|-----|------|-------------|
| Monday | Dependency review (Dependabot PRs) | Engineering |
| Tuesday | Performance review (p95 latency, error rate) | Engineering |
| Wednesday | Security review (access logs, rate limit hits) | Security Lead |
| Thursday | Support review (ticket trends, CSAT) | Support Lead |
| Friday | Deploy if needed (patch releases) | Engineering |

## Monthly Maintenance

| Week | Task | Responsible |
|------|------|-------------|
| 1 | Dependency audit + update | Engineering |
| 1 | Backup integrity verification | Engineering |
| 2 | Security audit (vulnerability scan) | Security Lead |
| 2 | Performance budget review | Tech Lead |
| 3 | Database health check (bloat, indexes, slow queries) | Engineering |
| 3 | Cost review (Vercel, Supabase, third-party) | CTO |
| 4 | Report generation (monthly KPIs) | Product Manager |
| 4 | Team retrospective | All |

## Quarterly Maintenance

| Month | Task | Responsible |
|-------|------|-------------|
| Jan, Apr, Jul, Oct | Disaster recovery drill | Engineering |
| Jan, Apr, Jul, Oct | Secret rotation (all service keys) | Engineering |
| Jan, Jul | Full penetration test | Security Lead |
| Apr, Oct | Architecture review + roadmap update | CTO |
| Jan, Apr, Jul, Oct | Capacity planning review | Engineering |
| Jan, Jul | Accessibility audit | QA Lead |

## Maintenance Windows

| Type | Window | Notice | Approval |
|------|--------|--------|----------|
| Database migration | Tue/Thu 02:00–04:00 UTC | 48 hours | Tech Lead |
| Dependency update | Weekly Tuesday | — | Developer |
| Infrastructure change | Monthly Saturday 02:00–06:00 UTC | 1 week | CTO |
| Emergency fix | Any time | ASAP | CTO |

## Change Management

| Change Type | Process | Approval |
|-------------|---------|----------|
| Bug fix | PR → review → merge → deploy | Tech Lead |
| Feature | Feature branch → PR → review → merge → staging → prod | Product + Tech Lead |
| Database | Migration → PR → review → apply to staging → apply to prod | Tech Lead |
| Infrastructure | RFC → review → implement → verify | CTO |
| Emergency | Hotfix → deploy → PR post-fact | CTO |
