# Environment Variables

> All environment variables required by TWallet Services. Each variable includes its source, purpose, and where it's used.

---

## Supabase

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Supabase project URL | Client, Server, Server Actions | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Public anon key (RLS) | Client, Server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Admin key (bypasses RLS) | Server only, Edge Functions | Yes |
| `SUPABASE_JWT_SECRET` | Supabase → Settings → API | JWT verification | Server (custom auth hooks) | Future |

---

## Vercel

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `NEXT_PUBLIC_APP_URL` | Vercel → Project → Domains | App base URL | All emails, redirects, OG images | Yes |
| `NEXT_PUBLIC_VERCEL_URL` | Vercel (auto-injected) | Deployment URL | Preview deployments | Auto |

---

## WalletConnect

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect → Cloud → Projects | WalletConnect v2 SDK | Client (wagmi config) | Yes |

---

## Alchemy

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `ALCHEMY_API_KEY` | Alchemy → Dashboard → Apps | RPC endpoint calls | Edge Functions (verify-payment) | Yes |
| `ALCHEMY_WEBHOOK_SECRET` | Alchemy → Notify → Webhooks | Webhook signature verification | Edge Functions (webhook-blockchain) | Yes |

---

## Resend

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `RESEND_API_KEY` | Resend → Dashboard → API Keys | Transactional emails | Server Actions, Edge Functions | Yes |
| `RESEND_WEBHOOK_SECRET` | Resend → Webhooks | Email event verification | Edge Functions (webhook-email) | Future |

---

## Cloudflare Turnstile (Phase 2)

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile | CAPTCHA widget | Client (auth forms) | Phase 2 |
| `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile | Server-side verification | Server Actions | Phase 2 |

---

## Sentry

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `SENTRY_DSN` | Sentry → Project → Client Keys | Error reporting | Client, Server | Recommended |
| `SENTRY_AUTH_TOKEN` | Sentry → Settings → Auth Tokens | Source map upload | Build time | Recommended |

---

## Database (Direct — Fallback)

| Variable | Source | Purpose | Used In | Required |
|----------|--------|---------|---------|----------|
| `DATABASE_URL` | Supabase → Settings → Database | Direct PostgreSQL connection | Migrations, pg_dump backups | Migrations only |

---

## Environment Files

### .env.local (Development)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...local-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...local-service-role-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_...
ALCHEMY_API_KEY=...
```

### .env.production (Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Encrypted in Vercel
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_APP_URL=https://twalletservices.com
RESEND_API_KEY=re_...
ALCHEMY_API_KEY=...
SENTRY_DSN=https://...
```

---

## Vercel Secrets

Sensitive variables stored as encrypted environment variables in Vercel:

```bash
vercel secret add supabase_service_role_key "eyJ..."
vercel secret add resend_api_key "re_..."
vercel secret add alchemy_api_key "..."
```

---

## Supabase Secrets (Edge Functions)

```bash
# Secrets for Edge Functions
supabase secrets set ALCHEMY_API_KEY=...
supabase secrets set RESEND_API_KEY=...
supabase secrets set SERVICE_ROLE_KEY=...
supabase secrets set SUPABASE_URL=...
```

---

## Variable Validation at Startup

```ts
// src/lib/env.ts
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  walletConnectProjectId: requireEnv('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'),
  appUrl: requireEnv('NEXT_PUBLIC_APP_URL'),
  resendApiKey: requireEnv('RESEND_API_KEY'),
  alchemyApiKey: requireEnv('ALCHEMY_API_KEY'),
};
```
