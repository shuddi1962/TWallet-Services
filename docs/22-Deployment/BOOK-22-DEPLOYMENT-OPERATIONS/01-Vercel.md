# Vercel Deployment

> **File:** `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Robots-Tag", "value": "index, follow" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
    ]}
  ],
  "rewrites": [
    { "source": "/api/docs", "destination": "/api/docs" }
  ]
}
```

## Environment Variables (Vercel)

| Variable | Encrypted |
|----------|-----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `RESEND_API_KEY` | Yes |
| `ALCHEMY_API_KEY` | Yes |
| `SENTRY_AUTH_TOKEN` | Yes |
| `NEXT_PUBLIC_*` | No (public) |

## Preview Deployments

- Auto-deploy on every PR
- Preview URL: `pr-{number}.twallet-services.vercel.app`
- Supabase branch created for each PR (for schema changes)
- Preview DB seeded with test data

# Supabase Deployment

## Migrations

```bash
# Apply migrations to production
supabase db push --linked

# Or specific environment
supabase db push --db-url $STAGING_DATABASE_URL
```

## Edge Functions

```bash
supabase functions deploy verify-payment --no-verify-jwt
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy health-check --no-verify-jwt
```

## Secrets

```bash
supabase secrets set --env-file .env.production
```

# Environments

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| Supabase | Local (`supabase start`) | Linked staging project | Linked production project |
| Database | Local Postgres | Staging DB | Production DB |
| Auth | Local | Staging config | Production config |
| Edge Functions | Local | Deployed to staging | Deployed to production |
| Storage | Local | Staging buckets | Production buckets |
| Vercel | `localhost` | `staging.*.com` | `twalletservices.com` |
| Environment vars | `.env.local` | Vercel staging env | Vercel production env |
| Seed data | `supabase/seed.sql` | Partial seed | No seed |

# Monitoring

| Tool | What It Monitors | Alert Channel |
|------|-----------------|---------------|
| Sentry | Errors, performance, N+1 queries | Email + Slack |
| Vercel Analytics | Page views, Web Vitals | Dashboard |
| Supabase Logs | API, Postgres, Auth, Storage | Dashboard |
| Uptime Robot (or Vercel) | Uptime | Slack ping |
| Edge Function logs | Function errors | Supabase dashboard |

# Incident Response

| Severity | Response Time | Example |
|----------|--------------|---------|
| SEV-1 | 15 min | Site down, payment system failing |
| SEV-2 | 1 hour | Feature broken, degraded performance |
| SEV-3 | 8 hours | Non-critical bug, cosmetic issue |

## Runbook: Payment verification failing
1. Check Supabase logs for Edge Function errors
2. Check Alchemy API status
3. Check environment variables for ALCHEMY_API_KEY
4. Check `verify-payment` function logs
5. Re-deploy function or rollback to previous version

# Release Process

1. Feature branch → PR → Preview deploy
2. PR approved + CI passes → merge to `main`
3. `main` auto-deploys to staging
4. Run E2E tests on staging
5. Tag release: `git tag v1.x.x && git push --tags`
6. Vercel deploys tag to production (manual promotion)
7. Run smoke tests on production
8. Post to #releases Slack channel

# Rollback

```bash
# Vercel: promote previous deployment
vercel promote --scope twallet-services

# Supabase: revert migration
supabase migration repair --status reverted <bad-migration>

# Git revert
git revert HEAD --no-edit
git push origin main
```
