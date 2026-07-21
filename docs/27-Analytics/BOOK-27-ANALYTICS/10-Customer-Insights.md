# Customer Insights

## Insight Queries

### Most Popular Card

```sql
SELECT
  cp.name AS card_name,
  COUNT(oi.id) AS order_count,
  SUM(p.amount_usd) AS total_revenue
FROM order_items oi
JOIN card_products cp ON cp.id = oi.card_product_id
JOIN orders o ON o.id = oi.order_id
JOIN payments p ON p.order_id = o.id
WHERE p.status = 'confirmed'
GROUP BY cp.name
ORDER BY order_count DESC;
```

### Most Used Wallet

```sql
SELECT
  wallet_type,
  COUNT(*) AS connection_count,
  COUNT(DISTINCT user_id) AS unique_users
FROM wallets
GROUP BY wallet_type
ORDER BY connection_count DESC;
```

### Top Countries

```sql
SELECT
  country,
  COUNT(*) AS user_count,
  COUNT(DISTINCT o.id) AS order_count
FROM profiles
LEFT JOIN orders o ON o.user_id = profiles.user_id
GROUP BY country
ORDER BY user_count DESC
LIMIT 10;
```

### Peak Usage Hours

```sql
SELECT
  EXTRACT(HOUR FROM created_at) AS hour,
  COUNT(*) AS event_count
FROM analytics_events
WHERE event_name IN ('user_logged_in', 'card_ordered', 'crypto_payment_started')
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY hour
ORDER BY hour;
```

### Repeat Customer Rate

```sql
SELECT
  order_count,
  COUNT(*) AS customer_count
FROM (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
) sub
GROUP BY order_count
ORDER BY order_count;
```

### Support Trends

```sql
SELECT
  category,
  COUNT(*) AS ticket_count,
  AVG(CASE WHEN status = 'closed' THEN EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600 END) AS avg_resolution_hours
FROM support_tickets
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY category
ORDER BY ticket_count DESC;
```

## Customer Segmentation

```sql
-- RFM-style segmentation
SELECT
  user_id,
  recency_days,
  order_count,
  total_revenue,
  CASE
    WHEN recency_days <= 7 AND order_count >= 3 THEN 'Power User'
    WHEN recency_days <= 30 AND order_count >= 1 THEN 'Active'
    WHEN recency_days <= 90 AND order_count >= 1 THEN 'At Risk'
    WHEN recency_days > 90 OR order_count = 0 THEN 'Inactive'
    ELSE 'New'
  END AS segment
FROM (
  SELECT
    u.id AS user_id,
    COALESCE(DATE_PART('day', NOW() - MAX(o.created_at)), 999) AS recency_days,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(p.amount_usd), 0) AS total_revenue
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
  LEFT JOIN payments p ON p.order_id = o.id AND p.status = 'confirmed'
  GROUP BY u.id
) sub;
```
