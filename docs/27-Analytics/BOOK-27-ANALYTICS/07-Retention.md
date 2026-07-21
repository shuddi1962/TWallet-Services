# Retention Analysis

## Retention Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Day 1 Retention | % of users active on day 1 after signup | > 40% |
| Day 7 Retention | % of users active on day 7 | > 20% |
| Day 30 Retention | % of users active on day 30 | > 10% |
| Day 90 Retention | % of users active on day 90 | > 5% |
| Weekly Retention | % of users active in each subsequent week | Declining curve |
| Monthly Retention | % of users active in each subsequent month | > 30% at month 3 |
| Repeat Order Rate | % of users with ≥ 2 orders | > 20% |

## Retention Query

```sql
-- Weekly retention cohort
WITH user_cohorts AS (
  SELECT
    id,
    DATE_TRUNC('week', created_at) AS cohort_week
  FROM users
),
weekly_activity AS (
  SELECT
    uc.id,
    uc.cohort_week,
    DATE_TRUNC('week', ae.created_at) AS activity_week
  FROM user_cohorts uc
  JOIN analytics_events ae ON ae.user_id = uc.id
  WHERE ae.event_name = 'user_logged_in'
  GROUP BY uc.id, uc.cohort_week, DATE_TRUNC('week', ae.created_at)
)
SELECT
  cohort_week,
  COUNT(DISTINCT id) AS cohort_size,
  ROUND(100.0 * COUNT(DISTINCT id) FILTER (WHERE activity_week = cohort_week) / COUNT(DISTINCT id), 1) AS week_0,
  ROUND(100.0 * COUNT(DISTINCT id) FILTER (WHERE activity_week = cohort_week + INTERVAL '1 week') / COUNT(DISTINCT id), 1) AS week_1,
  ROUND(100.0 * COUNT(DISTINCT id) FILTER (WHERE activity_week = cohort_week + INTERVAL '2 weeks') / COUNT(DISTINCT id), 1) AS week_2,
  ROUND(100.0 * COUNT(DISTINCT id) FILTER (WHERE activity_week = cohort_week + INTERVAL '3 weeks') / COUNT(DISTINCT id), 1) AS week_3,
  ROUND(100.0 * COUNT(DISTINCT id) FILTER (WHERE activity_week = cohort_week + INTERVAL '4 weeks') / COUNT(DISTINCT id), 1) AS week_4
FROM weekly_activity
GROUP BY cohort_week
ORDER BY cohort_week;
```

## Retention Improvement Strategies

| Retention Period | Strategy | Owner |
|-----------------|----------|-------|
| Day 1 | Welcome email, quick-start guide | Product |
| Day 7 | Push notification (future), email with tips | Marketing |
| Day 30 | Re-engagement email, feature highlight | Marketing |
| Day 90 | "We miss you" email, special offer | Marketing |
| Repeat purchase | Post-purchase email, referral incentive | Product |
| Reactivation | Feature announcement, product update | Marketing |

## Churn Analysis

```sql
-- Churned users (no activity in 30+ days)
SELECT
  DATE_TRUNC('week', u.created_at) AS signup_week,
  COUNT(*) FILTER (WHERE last_login < NOW() - INTERVAL '30 days') AS churned,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE last_login < NOW() - INTERVAL '30 days') / COUNT(*), 1) AS churn_rate
FROM users u
LEFT JOIN (
  SELECT user_id, MAX(created_at) AS last_login
  FROM analytics_events
  WHERE event_name = 'user_logged_in'
  GROUP BY user_id
) a ON a.user_id = u.id
GROUP BY signup_week
ORDER BY signup_week;
```
