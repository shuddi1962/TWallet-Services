# Secret Management

## Secrets Inventory

| Secret | Used By | Rotation |
|--------|---------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Quarterly |
| `SUPABASE_ANON_KEY` | Client SDK | On breach |
| `RESEND_API_KEY` | Email service | Quarterly |
| `WALLETCONNECT_PROJECT_ID` | Wallet integration | Yearly |
| `ALCHEMY_API_KEY` | On-chain verification | Quarterly |
| `NEXT_PUBLIC_SITE_URL` | Public config | On domain change |
| `WEBHOOK_SECRET` | Webhook verification | Quarterly |
| `SESSION_SECRET` | Cookie encryption | Yearly |

## Environment Files

| File | Purpose | Git |
|------|---------|-----|
| `.env.local` | Local development | Ignored |
| `.env.example` | Template with placeholder values | Committed |
| Vercel env vars | Production secrets | Managed in Vercel dashboard |
| Supabase secrets | Edge Function secrets | Managed via `supabase secrets` |

## Secret Rules

| Rule | Description |
|------|-------------|
| Never commit secrets | `.env.local`, `.env.production` in `.gitignore` |
| No secrets in client | `NEXT_PUBLIC_*` only for truly public values |
| Rotate regularly | Schedule in operations playbook |
| Separate per environment | Dev/staging/prod use different keys |
| Access logging | Admin actions logged in audit_logs |
| Least privilege | Each service gets minimum keys needed |

## Supabase Edge Function Secrets

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<key>
supabase secrets set RESEND_API_KEY=<key>
supabase secrets set ALCHEMY_API_KEY=<key>
supabase secrets set WEBHOOK_SECRET=<secret>
```

## Production Secret Audit

- All secrets verified before deployment
- No hardcoded values in source code
- No `.env` files in production
- Secret access reviewed quarterly
- Incident response includes secret rotation step
