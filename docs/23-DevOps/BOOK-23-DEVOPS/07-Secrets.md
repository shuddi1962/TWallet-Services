# Secrets Management

## Environment Variable Catalog

| Variable | Source | Required In | Example |
|----------|--------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | All environments | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | All environments | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Server only | `eyJhbGciOiJIUzI1NiIs...` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud | All environments | `1234abcd...` |
| `NEXT_PUBLIC_APP_URL` | Custom | All environments | `https://twalletservices.com` |
| `RESEND_API_KEY` | Resend Dashboard | Server only | `re_...` |
| `ALCHEMY_API_KEY` | Alchemy Dashboard | Edge Functions | `abc123...` |
| `WEBHOOK_SECRET` | Generated | Edge Functions | `whsec_...` |
| `SENTRY_DSN` | Sentry Dashboard | All environments | `https://...@o...ingest.sentry.io` |
| `UPSTASH_REDIS_REST_URL` | Upstash | Server only | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | Server only | `...` |

## Security Rules

| Rule | Rationale |
|------|-----------|
| Never commit `.env.local` | Added to `.gitignore` |
| No secrets in client bundle | `NEXT_PUBLIC_` prefix only for public values |
| Rotate quarterly | Calendar reminder for key rotation |
| Separate per environment | Dev/staging keys differ from production |
| Supabase secrets for Edge Functions | `supabase secrets set` for function env vars |

## Rotation Schedule

| Secret | Rotation | Last Rotated | Next Rotation |
|--------|----------|--------------|---------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Quarterly | — | — |
| `RESEND_API_KEY` | Quarterly | — | — |
| `ALCHEMY_API_KEY` | Quarterly | — | — |
| `WEBHOOK_SECRET` | Quarterly | — | — |
| `SENTRY_DSN` | Yearly | — | — |
| `UPSTASH_REDIS_REST_TOKEN` | Quarterly | — | — |

## Audit

All secret access should be logged. If a secret is compromised:

1. Rotate immediately
2. Update all environments
3. Review access logs for unauthorized use
4. Document in incident log
