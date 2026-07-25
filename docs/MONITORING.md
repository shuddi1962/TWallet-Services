# Monitoring & Observability

> Current monitoring infrastructure and what still needs configuration.

## Implemented

### Sentry (error tracking)
- **Files:** `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- **DSN:** `NEXT_PUBLIC_SENTRY_DSN` — set in Vercel env vars
- **Captures:** client-side errors, server-side errors, edge function errors
- **Source maps:** require `SENTRY_AUTH_TOKEN` in CI for readable stack traces
- **Status:** 🔴 Needs real DSN (placeholder value)

### PostHog (product analytics)
- **File:** `components/posthog-provider.tsx`
- **Key:** `NEXT_PUBLIC_POSTHOG_KEY`, host: `NEXT_PUBLIC_POSTHOG_HOST`
- **Auto-capture:** page views, sessions, feature usage
- **Opt-out:** dev environment (`NODE_ENV !== "production"` disables capture)
- **Status:** 🔴 Needs real key (placeholder value)

### Health endpoint
- **Route:** `GET /api/ready`
- **Checks:** database connectivity (query `profiles` table)
- **Returns:** `200 { status: "ready", checks: { database: "ok" } }` or `503`
- **Status:** ✅ Implemented

### Version endpoint
- **Route:** `GET /api/version`
- **Returns:** package version, commit SHA, environment name
- **Status:** ✅ Implemented

## Missing (not implemented)

### Uptime monitoring
- No external uptime checker configured (e.g., Better Uptime, Pingdom, Checkly)
- **Recommendation:** Set up Better Uptime or Checkly to hit `/api/ready` every 60s

### Alerting
- No alert channels configured (email/PagerDuty/Slack)
- Sentry alert rules not configured
- **Recommendation:** Configure Sentry alert rules for:
  - 5+ errors in 5 minutes → Slack notification
  - Any `PAY_005` (double-spend detection) → immediate Slack + email
  - Any `PAY_010` (verification failure) → immediate Slack + email

### Database monitoring
- No Supabase observability dashboard reviewed
- **Recommendation:** Enable Supabase Monitoring in dashboard; set up:
  - Connection pool alerts (>80% utilization)
  - Query performance alerts (slow queries >1s)
  - Storage growth alerts

### Logging
- No structured logging library
- All logging is ad-hoc via `console.log` / `console.error`
- **Recommendation:** Add `pino` or `@opentelemetry/instrumentation-http` for structured, level-based logging

### Performance monitoring (RUM)
- No Real User Monitoring for Core Web Vitals
- Vercel Analytics (`NEXT_PUBLIC_VERCEL_ANALYTICS`) is boolean-flagged but not confirmed active
- **Recommendation:** Enable Vercel Speed Insights; add Web Vitals reporting component

### Custom metrics
- No business-level metrics tracked (orders created, payments verified, signups completed)
- **Recommendation:** Add PostHog custom events at key business milestones

## Dashboard monitoring checklist

- [ ] Sentry DSN set to real value
- [ ] PostHog key set to real value
- [ ] Uptime monitor hitting `/api/ready` every 60s
- [ ] Slack alert channel configured
- [ ] Double-spend alert (`PAY_005`) configured
- [ ] Verification failure alert (`PAY_010`) configured
- [ ] Database pool alert configured
- [ ] Structured logging (pino) added
- [ ] Vercel Speed Insights enabled
- [ ] PostHog custom events added (order.created, payment.verified, user.signedUp)
- [ ] Sentry source maps uploading in CI