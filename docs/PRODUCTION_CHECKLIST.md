# Production Readiness Checklist

> 10 items required before public launch. All currently unchecked.

## 1. Domain & SSL

- [ ] Custom domain (`twalletservices.com`) configured in Vercel
- [ ] SSL certificate active (Vercel auto-provisions)
- [ ] `NEXT_PUBLIC_SITE_URL` set to `https://twalletservices.com` in Vercel
- [ ] WWW → non-WWW redirect (or vice versa)
- [ ] DNS records verified (`dig twalletservices.com`)

## 2. Supabase Production Project

- [ ] Production Supabase project created (separate from local dev)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and keys set in Vercel env vars
- [ ] RLS policies verified on all 19 tables
- [ ] Security advisor run: `supabase_get_advisors type=security`
- [ ] Supabase Edge Functions deployed: `verify-payment`, `transition-order`, `send-email`
- [ ] Edge Function secrets set: `ALCHEMY_API_KEY`

## 3. WalletConnect

- [ ] WalletConnect Cloud project created
- [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` set in Vercel
- [ ] Allowed origins configured in WalletConnect dashboard to include `twalletservices.com`

## 4. Alchemy & RPC

- [ ] Alchemy app created (any free tier works)
- [ ] `NEXT_PUBLIC_ALCHEMY_API_KEY` set in Vercel
- [ ] `ALCHEMY_API_KEY` set in Supabase Edge Function secrets
- [ ] RPC endpoints tested with `curl`

## 5. Email (Resend)

- [ ] Resend account created, domain verified (`twalletservices.com`)
- [ ] `RESEND_API_KEY` set in Vercel env vars
- [ ] DKIM/SPF DNS records added for deliverability
- [ ] Welcome email, reset password, and order confirmation templates tested

## 6. Error Tracking (Sentry)

- [ ] Sentry project created
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set in Vercel env vars
- [ ] `SENTRY_AUTH_TOKEN` set in GitHub secrets for source maps
- [ ] Alert rule configured: 5+ errors in 5min → Slack

## 7. Analytics (PostHog)

- [ ] PostHog project created (self-host or cloud)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` set in Vercel env vars
- [ ] Custom events implemented: `order.created`, `payment.verified`, `user.signedUp`
- [ ] Opt-out mechanism verified for GDPR compliance

## 8. Monitoring

- [ ] Uptime monitor configured (Better Uptime / Checkly / Pingdom)
- [ ] Health endpoint (`/api/ready`) responding 200
- [ ] Slack alert for `/api/ready` returning 503
- [ ] Database connection pool alert configured (>80%)

## 9. Backups

- [ ] Supabase daily backups enabled (Pro plan or above)
- [ ] Storage bucket sync to S3 configured
- [ ] Recovery runbook documented (see `BACKUP_STRATEGY.md`)

## 10. CI & Rollback

- [ ] CI pipeline passing: lint → typecheck → test → build
- [ ] Vercel auto-deploys `main` branch on push
- [ ] Rollback tested: `npx vercel rollback <deployment-id>`
- [ ] Git tag created for each production deployment
- [ ] `CHANGELOG.md` updated for release

---

## Pre-launch sanity

- [ ] Build passes: `npm run build`
- [ ] Type check passes: `npm run typecheck`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm run test`
- [ ] Manual smoke test on production URL:
  - [ ] Landing page loads (no 404)
  - [ ] Registration + email verification flow works
  - [ ] Wallet connection works
  - [ ] Card ordering flow works
  - [ ] Payment flow works
  - [ ] Admin dashboard loads
  - [ ] `/api/ready` returns 200
- [ ] Production SSL valid (no mixed content warnings)
- [ ] Mobile responsive (320px breakpoint tested)
- [ ] Accessibility scan passes (Lighthouse)