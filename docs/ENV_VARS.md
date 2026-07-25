# Environment Variables Reference

> Where every var is set, what it does, and where to get the value.

## Quick Reference

| Variable | Scope | Required | Used In |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | yes | Supabase clients (browser, server, middleware, admin) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | yes | Supabase client & server clients |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | yes | Admin actions, audit, API routes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | public | yes | Wallet provider (Web3Modal) |
| `NEXT_PUBLIC_SENTRY_DSN` | public | yes (prod) | Sentry (client, server, edge) |
| `NEXT_PUBLIC_SITE_URL` | public | yes | sitemap, robots, layout, redirects |
| `RESEND_API_KEY` | server-only | yes | Email notifications (`lib/email.ts`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | public | yes | Analytics (`posthog-provider.tsx`) |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | public | yes | RPC, verify-payment edge function |
| `NEXT_PUBLIC_POSTHOG_HOST` | public | no | Defaults to `https://app.posthog.com` |
| `SENTRY_AUTH_TOKEN` | server-only | no | Sentry source maps upload (CI) |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | public | no | Vercel Speed Insights |
| `VERCEL_GIT_COMMIT_SHA` | injected | no | `/api/version` endpoint |
| `VERCEL_ENV` | injected | no | Runtime environment detection |
| `ANALYZE` | build-time | no | Bundle analyzer (`npm run analyze`) |
| `CI` | injected | no | CI environment detection |

### Supabase Edge Functions

Set in `supabase/secrets/` via CLI, or in Supabase dashboard → Edge Functions → Secrets:

| Secret | Used In |
|---|---|
| `ALCHEMY_API_KEY` | `verify-payment` (rpc.ts) |

## Where to set each variable

### Vercel (production + preview)

Add to **Project Settings → Environment Variables** in the Vercel dashboard.

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Preview, Production | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Preview, Production | |
| `SUPABASE_SERVICE_ROLE_KEY` | Preview, Production | **Never expose in client** |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Preview, Production | |
| `NEXT_PUBLIC_SENTRY_DSN` | Preview, Production | |
| `NEXT_PUBLIC_SITE_URL` | Production: `https://twalletservices.com` | Preview: auto-set by Vercel |
| `RESEND_API_KEY` | Preview, Production | |
| `NEXT_PUBLIC_POSTHOG_KEY` | Preview, Production | |
| `NEXT_PUBLIC_POSTHOG_HOST` | Production | |
| `SENTRY_AUTH_TOKEN` | Production (for source maps) | |

### Local development `.env.local`

```
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_ALCHEMY_API_KEY=abc123

# Optional
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_VERCEL_ANALYTICS=true
ANALYZE=false
```

### Supabase Edge Function secrets

```bash
supabase secrets set ALCHEMY_API_KEY=abc123
```

### CI (GitHub Actions)

See `.github/workflows/ci.yml`. Set as repository secrets in GitHub:

- `VERCEL_TOKEN` — for manual deploy (CI only)

## Where to get each API key

| Var | Provider | How to Get |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase](https://supabase.com) | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [Supabase](https://supabase.com) | Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | [Supabase](https://supabase.com) | Project Settings → API → service_role key |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com) | Create project → copy Project ID |
| `NEXT_PUBLIC_SENTRY_DSN` | [Sentry](https://sentry.io) | Project Settings → Client Keys → DSN |
| `SENTRY_AUTH_TOKEN` | [Sentry](https://sentry.io) | Settings → Auth Tokens → Create Token |
| `RESEND_API_KEY` | [Resend](https://resend.com) | API Keys → Create API Key |
| `NEXT_PUBLIC_POSTHOG_KEY` | [PostHog](https://posthog.com) | Project Settings → Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | [PostHog](https://posthog.com) | Instance URL (default: `https://app.posthog.com`) |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | [Alchemy](https://alchemy.com) | Dashboard → Create App → API Key |
| `ALCHEMY_API_KEY` | [Alchemy](https://alchemy.com) | Same key; used in Edge Functions |
| `VERCEL_TOKEN` | [Vercel](https://vercel.com) | Settings → Tokens → Create |