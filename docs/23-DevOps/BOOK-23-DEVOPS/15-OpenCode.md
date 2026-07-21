# OpenCode DevOps Build Instructions

Deploy the TWallet Services platform using Vercel + Supabase with full CI/CD.

## Requirements

- GitHub CI/CD (lint → typecheck → test → build → deploy)
- Preview deployments (every PR gets isolated URL + Supabase branch)
- Environment separation (local / preview / staging / production)
- Secret management (Vercel env vars + Supabase secrets, never committed)
- Automatic SSL (managed by Vercel)
- Migration pipeline (versioned, reviewed, reversible)
- Rollback strategy (Vercel promote + DB compensating migration)
- Backup strategy (daily pg_dump + PITR + storage replication)
- Monitoring (Sentry + Vercel Analytics + Supabase Logs + Uptime Robot)
- Production ready

## File Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Lint → test → build
│   ├── deploy.yml          # Deploy to Vercel
│   ├── security.yml        # Security scanning
│   └── dependabot.yml      # Auto dependency updates

ops/
├── RUNBOOK.md
├── ON_CALL_GUIDE.md
├── RELEASE_CALENDAR.md
├── CHANGELOG.md
├── DEPLOYMENT_CHECKLIST.md
├── INCIDENT_LOG.md
├── SERVICE_LEVEL_OBJECTIVES.md
├── SERVICE_LEVEL_INDICATORS.md
├── ERROR_BUDGET.md
└── POSTMORTEM_TEMPLATE.md
```

## Verification Checklist

- Build passes (`npm run build`)
- Lint passes (`npm run lint`)
- TypeScript clean (`npm run typecheck`)
- Unit tests pass (`npm run test:unit`)
- Integration tests pass (`npm run test:integration`)
- E2E tests pass (`npm run test:e2e`)
- Database migration deployed and verified
- Environment variables set in all environments
- SSL certificate active
- Monitoring configured (Sentry + Vercel + Supabase)
- Rollback plan documented and tested
- Backups running
- Production ready
