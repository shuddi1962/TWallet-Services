# Funnel Analysis

## Customer Funnel

```text
Landing Page (100%)
    │
    ▼
Sign Up (25% — 75% drop-off)
    │
    ▼
Verify Email (80% — 20% drop-off of signups)
    │
    ▼
Connect Wallet (60% — 40% drop-off of verified)
    │
    ▼
Select Card (50% — 50% drop-off of wallet connected)
    │
    ▼
Place Order (40% — 60% drop-off of card selected)
    │
    ▼
Crypto Payment (80% — 20% drop-off of order placed)
    │
    ▼
Order Confirmed (90% — 10% drop-off of payment)
    │
    ▼
Repeat Purchase (20% — of confirmed users)
```

## Funnel Implementation (PostHog)

```typescript
// Funnel steps are defined in PostHog UI as a series of events:
const funnelSteps = [
  { event: '$pageview', properties: { url: '/' } },        // Landing page
  { event: 'user_registered' },                              // Sign up
  { event: 'email_verified' },                               // Verify email
  { event: 'wallet_connected' },                             // Connect wallet
  { event: 'card_product_viewed' },                          // Select card
  { event: 'card_ordered' },                                 // Place order
  { event: 'crypto_payment_started' },                       // Payment
  { event: 'crypto_payment_confirmed' },                     // Confirmed
];
```

## Funnel Queries (SQL)

```sql
-- Registration → Payment completion funnel (daily)
SELECT
  DATE(created_at) AS day,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'user_registered') AS registered,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'email_verified') AS verified,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'wallet_connected') AS wallet_connected,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'card_ordered') AS ordered,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'crypto_payment_confirmed') AS paid
FROM analytics_events
GROUP BY day
ORDER BY day DESC;
```

## Drop-Off Analysis

| Funnel Step | Typical Drop-off | Investigation |
|-------------|-----------------|---------------|
| Landing → Signup | 75% | Improve hero CTA, reduce friction |
| Signup → Verify | 20% | Check email deliverability, resend prompt |
| Verify → Connect | 40% | Improve wallet connect UX, show supported wallets |
| Connect → Select | 50% | Improve card catalog, show pricing |
| Select → Order | 60% | Reduce checkout friction, add progress indicator |
| Order → Pay | 20% | Improve payment UX, show supported tokens |
| Pay → Confirm | 10% | Reduce verification time, show status |
| Confirm → Repeat | 80% | Improve onboarding, send follow-up, add value |
