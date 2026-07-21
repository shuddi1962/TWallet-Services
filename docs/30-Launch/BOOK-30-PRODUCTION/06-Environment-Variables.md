# Environment Variables

## Required Variables

### Public (NEXT_PUBLIC_ prefix — safe for client)

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | WalletConnect Cloud |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://twalletservices.com` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | Sentry Dashboard → Project Settings |

### Server-Only (no prefix — never exposed to client)

| Variable | Description | Source |
|----------|-------------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `RESEND_API_KEY` | Resend email API key | Resend Dashboard → API Keys |
| `SENTRY_AUTH_TOKEN` | Sentry auth token | Sentry Dashboard → Auth Tokens |
| `WALLETCONNECT_PRIVATE_KEY` (optional) | Webhook verification | WalletConnect Cloud |

## Setting Variables

### Vercel (Production)

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Repeat for all variables
```

### Supabase (Edge Functions)

```bash
supabase secrets set RESEND_API_KEY=<value>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<value>
```

## Environment Verification

```bash
# Check Vercel env vars
vercel env list production

# Check Supabase secrets
supabase secrets list
```

## Security Rules

| Rule | Description |
|------|-------------|
| Never expose server keys | `NEXT_PUBLIC_` prefix only for client-safe vars |
| Rotate quarterly | All secrets rotated every 3 months |
| Audit monthly | Review who has access to production secrets |
| No hardcoded values | All env vars stored in Vercel/Supabase, never in code |
| .env.example checked in | Template without real values committed to Git |
