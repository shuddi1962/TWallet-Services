# Environments

## Environment Tiers

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | `http://localhost:3000` | Development + unit tests |
| Preview | `*.vercel.app` | PR-specific, every branch |
| Staging | `staging.twalletservices.com` | Pre-release validation |
| Production | `twalletservices.com` | Live customer traffic |

## Environment Separation

Every environment has:

| Resource | Local | Preview | Staging | Production |
|----------|-------|---------|---------|------------|
| Supabase project | Local (`supabase start`) | Branch project | Staging project | Production project |
| Database | Local PostgreSQL 16 | Branch DB | Staging DB | Production DB |
| Storage | Local | Branch bucket | Staging bucket | Production bucket |
| Auth config | Local | Branch config | Staging config | Production config |
| Edge Functions | Local | Branch deployment | Staging deployment | Production deployment |
| Environment vars | `.env.local` | Vercel preview vars | Vercel staging vars | Vercel production vars |
| API keys | Test keys | Test keys | Staging keys | Production keys |
| WalletConnect | Test project | Test project | Test project | Production project |
| Alchemy | Test API key | Test API key | Staging API key | Production API key |
| Resend | Test mode | Test mode | Test mode | Production API key |

## Supabase Branching

Every PR creates a Supabase branch with an isolated database:

```bash
supabase branches create
```

The branch is automatically deleted when the PR is merged or closed.

## Local Development

```bash
# Terminal 1: Start Supabase
supabase start

# Terminal 2: Start Next.js
npm run dev
```
