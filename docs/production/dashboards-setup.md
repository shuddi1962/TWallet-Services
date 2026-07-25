# Production Dashboard Setup

Setup instructions for Sentry + PostHog dashboards.

## Sentry Dashboards

### Prerequisites
- Sentry account with `SENTRY_AUTH_TOKEN` and `SENTRY_DSN` configured
- `SENTRY_ORGANIZATION` slug and `SENTRY_PROJECT` set in `.env.local`

### Error Tracking Dashboard

1. Go to Sentry → Dashboards → Create Dashboard
2. Name: "TWallet Operations"
3. Add widgets:

| Widget | Dataset | Field | Aggregation | Display |
|--------|---------|-------|-------------|---------|
| Error Rate (5m) | Errors | count() | 5min avg | Line chart |
| p50/p95/p99 Latency | Transactions | duration | percentile | Line chart |
| Top Errors | Errors | title | count() | Table |
| Errors by Route | Errors | url | count() | Bar chart |
| Affected Users | Errors | user | count_unique | Number |
| Crash-Free Rate | Sessions | crashed | session.status | Percentage |
| HTTP Error Rate (5m) | Errors | status_code | 5min avg (4xx+5xx) | Line chart |

4. Set alerts:
   - Error rate > 5% in 5 min → Slack #incidents + email
   - Any FATAL error → Slack #incidents + PagerDuty
   - p95 > 1s → Slack #performance

### Creating Alert Rules in Sentry

```bash
# Via Sentry CLI (install: npm install -g @sentry/cli)
sentry-cli --auth-token $SENTRY_AUTH_TOKEN alerts create \
  --organization $SENTRY_ORGANIZATION \
  --project $SENTRY_PROJECT \
  --name "High Error Rate" \
  --query "error.count() > 50" \
  --time-interval 5m \
  --threshold-type count \
  --threshold-value 50 \
  --action slack:$SLACK_WEBHOOK_ID

sentry-cli --auth-token $SENTRY_AUTH_TOKEN alerts create \
  --organization $SENTRY_ORGANIZATION \
  --project $SENTRY_PROJECT \
  --name "Performance Degradation" \
  --query "transaction.duration > 1000" \
  --percentile p95 \
  --time-interval 5m \
  --threshold-type percentile \
  --threshold-value 1000 \
  --action slack:$SLACK_WEBHOOK_ID
```

## PostHog Dashboards

### Prerequisites
- PostHog account with `NEXT_PUBLIC_POSTHOG_KEY` configured
- PostHog snippet/plugin added to `app/providers/posthog.tsx`

### Analytics Dashboard

1. Go to PostHog → Dashboards → New Dashboard
2. Name: "TWallet Business Metrics"
3. Add insights:

| Insight | Event | Property | Display |
|---------|-------|----------|---------|
| Daily Active Users | $pageview | — | Trend line |
| New Signups | signup | — | Trend line |
| Wallet Connections | wallet_connected | wallet_type | Breakdown bar |
| Card Orders | card_ordered | card_type | Breakdown bar |
| Conversion Rate | signup → card_ordered | — | Funnel |
| Top Pages | $pageview | $current_url | Table |
| User Retention | $pageview | — | Retention |
| Revenue (7d) | payment_completed | amount | Cumulative sum |

### Setting up PostHog Events

Events are auto-captured by PostHog's `posthog-js` library. Custom events added in:

- `lib/posthog.ts` — PostHog provider config
- Server actions — `posthog.capture()` calls after key events

To verify: Open PostHog Live Events tab and perform an action on the site.

## Vercel Analytics

### Web Vitals Dashboard

1. Go to Vercel Dashboard → Analytics → Web Vitals
2. Verify LCP, FID, CLS, INP are being tracked
3. Set up alerts:
   - LCP > 2.5s → Slack
   - CLS > 0.1 → Slack
   - INP > 200ms → Slack

## Verification Checklist

- [ ] Sentry receiving error events
- [ ] Sentry transaction traces visible
- [ ] Sentry alert rules created and enabled
- [ ] PostHog receiving $pageview events
- [ ] PostHog custom events firing
- [ ] PostHog dashboard created with all insights
- [ ] Vercel Analytics showing Web Vitals data
- [ ] Slack integration configured for all alerts
