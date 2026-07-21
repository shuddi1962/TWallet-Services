# Revenue Analytics

## Revenue Metrics

| Metric | Definition | SQL Source |
|--------|------------|------------|
| Gross Revenue | Total confirmed payment amounts | `payments WHERE status = 'confirmed'` |
| Net Revenue | Gross — Refunds | `payments WHERE status IN ('confirmed', 'refunded')` |
| Revenue per Day | Daily sum of confirmed payments | `DATE_TRUNC('day', confirmed_at)` |
| Revenue per User | Total revenue / distinct users | Aggregate |
| Average Order Value (AOV) | Revenue / order count | Aggregate |
| Monthly Recurring Revenue (MRR) | Recurring subscription revenue | Future — not MVP |
| Lifetime Value (LTV) | Avg revenue per user over lifetime | Cohort analysis |

## Revenue SQL Queries

```sql
-- Daily Revenue
SELECT
  DATE(confirmed_at) AS day,
  COUNT(*) AS transactions,
  SUM(amount_usd) AS revenue_usd
FROM payments
WHERE status = 'confirmed'
GROUP BY DATE(confirmed_at)
ORDER BY day DESC;

-- Revenue by Token
SELECT
  token_symbol,
  COUNT(*) AS transactions,
  SUM(amount_usd) AS revenue_usd
FROM payments
WHERE status = 'confirmed'
GROUP BY token_symbol
ORDER BY revenue_usd DESC;

-- Revenue by Network
SELECT
  network,
  COUNT(*) AS transactions,
  SUM(amount_usd) AS revenue_usd
FROM payments
WHERE status = 'confirmed'
GROUP BY network
ORDER BY revenue_usd DESC;

-- Average Order Value (30-day rolling)
SELECT
  AVG(amount_usd) AS aov_30d
FROM payments
WHERE status = 'confirmed'
  AND confirmed_at > NOW() - INTERVAL '30 days';

-- Revenue Per User (top 10)
SELECT
  user_id,
  COUNT(*) AS transactions,
  SUM(amount_usd) AS total_revenue
FROM payments
WHERE status = 'confirmed'
GROUP BY user_id
ORDER BY total_revenue DESC
LIMIT 10;
```

## Revenue Dashboard

| Widget | Query | Refresh |
|--------|-------|---------|
| Revenue Today | Today's confirmed amount | Real-time |
| Revenue This Week | Weekly sum | 1 hour |
| Revenue This Month | Monthly sum | 1 hour |
| Revenue by Token | Pie chart | Daily |
| Revenue by Network | Bar chart | Daily |
| AOV Trend | 30-day rolling AOV | Daily |
| Revenue Forecast | Linear projection (future) | Weekly |
| Top Customers | Highest revenue users | Daily |
