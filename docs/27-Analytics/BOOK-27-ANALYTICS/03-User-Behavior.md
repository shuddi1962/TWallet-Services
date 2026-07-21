# User Behavior Tracking

## Core Metrics

| Metric | Definition | Query / Event |
|--------|------------|---------------|
| Daily Active Users (DAU) | Unique users with ≥ 1 session | `user_logged_in` + page views |
| Weekly Active Users (WAU) | Unique users in 7-day window | Aggregated from DAU |
| Monthly Active Users (MAU) | Unique users in 30-day window | Aggregated from DAU |
| Session Duration | Time from first to last event in 30-min window | Event timestamps |
| Pages Visited | Distinct page paths per session | `$pageview` events |
| Feature Adoption | % of users who used a feature | Specific event (e.g., `card_ordered`) |
| Stickiness Ratio | DAU / MAU | Calculated |

## Session Definition

A session starts when a user lands on the site and ends after 30 minutes of inactivity. PostHog handles this automatically.

## User Cohorts

| Cohort | Definition | Query |
|--------|------------|-------|
| New Users | Registered within last 7 days | `created_at > NOW() - 7 days` |
| Active Users | ≥ 1 session in last 7 days | DAU in 7d window |
| At-Risk Users | No session in 14–30 days | Last login 14–30 days ago |
| Churned Users | No session in > 30 days | Last login > 30 days ago |
| Power Users | ≥ 10 sessions in last 30 days | Session count ≥ 10 |
| Paying Users | ≥ 1 completed payment | `crypto_payment_confirmed` |

## User Segments

| Segment | Criteria | Marketing |
|---------|----------|-----------|
| Wallet-only | Connected wallet, no order | Promote card features |
| First-time buyer | Completed 1 order | Onboarding, tips |
| Repeat buyer | Completed ≥ 3 orders | Loyalty, referral |
| High-value | Average order > $100 | Premium features |
| Inactive | No activity 30+ days | Re-engagement campaign |
| Mobile users | Sessions from mobile | Push notifications (future) |

## Engagement Metrics

```sql
-- Feature adoption rate
SELECT
  DATE_TRUNC('week', created_at) AS week,
  COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'card_ordered') AS card_ordered,
  COUNT(DISTINCT user_id) AS total_users,
  ROUND(
    100.0 * COUNT(DISTINCT user_id) FILTER (WHERE event_name = 'card_ordered')
    / NULLIF(COUNT(DISTINCT user_id), 0), 1
  ) AS adoption_rate
FROM analytics_events
GROUP BY week
ORDER BY week;
```
