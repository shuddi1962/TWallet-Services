# TWallet Services — Operations Runbook

## Overview

This runbook documents operational procedures for TWallet Services production environment.

- **Product:** TWallet Card (non-custodial crypto-funded card platform)
- **Stack:** Next.js 15 (Vercel) + Supabase + TypeScript strict
- **Repository:** github.com/twallet-services/twallet-services

## Quick Reference

| Service | URL | Credentials |
|---------|-----|-------------|
| Production Site | https://twallet.app | — |
| Vercel Dashboard | https://vercel.com/twallet | Owner: [email] |
| Supabase Dashboard | https://supabase.com/dashboard/project/[ref] | Owner: [email] |
| Sentry | https://sentry.io/organizations/twallet | Owner: [email] |
| Uptime Robot | https://uptimerobot.com/login | Owner: [email] |
| GitHub | https://github.com/twallet-services | Owner: [email] |

## On-Call Rotation

| Week | Primary | Secondary |
|------|---------|-----------|
| Week 1 | Dev A | Dev B |
| Week 2 | Dev B | Dev C |
| Week 3 | Dev C | Dev A |
| Week 4 | Dev A | Dev C |

## Severity Levels

| SEV | Definition | Response | Escalation |
|-----|------------|----------|------------|
| SEV-1 | Platform down, payments failing, data loss | < 15 min | CTO |
| SEV-2 | Partial outage, degraded performance | < 1 hour | Tech Lead |
| SEV-3 | Minor issue, non-critical bug | < 24 hours | Developer |
| SEV-4 | Cosmetic, enhancement | Next sprint | Developer |

## Common Procedures

### Verify Deployment Health

```bash
curl -I https://twallet.app
# Expected: 200 OK

curl https://api.twallet.app/health
# Expected: {"status":"ok"}
```

### Restart Edge Functions

1. Go to Supabase Dashboard → Edge Functions
2. Select function → Deploy → Last deployed version
3. Click "Deploy"

### Force Vercel Redeploy

```bash
vercel deploy --prod
```

### Rollback Deployment

```bash
vercel rollback
```

### Database Point-in-Time Recovery

1. Supabase Dashboard → Database → Backups
2. Select restore point (max 7 days)
3. Confirm restoration

### Rotate Service Key

1. Supabase Dashboard → Project Settings → API
2. Regenerate `service_role` key
3. Update Vercel environment variables
4. Restart Edge Functions

## Escalation Contacts

| Role | Name | Phone |
|------|------|-------|
| CTO | [Name] | [Phone] |
| Tech Lead | [Name] | [Phone] |
| Senior Developer | [Name] | [Phone] |
| Security Lead | [Name] | [Phone] |
