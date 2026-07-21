# Operational Reports

## Report Schedule

### Daily Reports

| Report | Content | Delivery | Owner |
|--------|---------|----------|-------|
| Daily Ops Summary | Orders, payments, errors, support | Slack #ops | Engineering |
| Payment Reconciliation | All payments (pending, confirmed, failed) | Email | Finance |
| Security Events | Auth failures, rate limit hits, suspicious IPs | Slack #security | Security |

### Weekly Reports

| Report | Content | Delivery | Owner |
|--------|---------|----------|-------|
| Growth Report | New users, DAU, wallet connects, orders | Email + Dashboard | Product |
| Performance Report | p95 latency, error rates, slow queries | Email | Engineering |
| Revenue Report | Weekly revenue, AOV, top tokens | Email | Finance |
| Support Report | Ticket volume, CSAT, resolution time | Email | Support |

### Monthly Reports

| Report | Content | Delivery | Owner |
|--------|---------|----------|-------|
| Executive Summary | All KPIs, growth trends, financials | Email + PDF | CTO |
| Customer Trends | Retention, churn, cohorts | Email | Product |
| Feature Usage | Feature adoption, popular features | Email | Product |
| Infrastructure | Cost analysis, scaling review | Email | Engineering |

## Report SQL Templates

### Daily Ops Summary

```sql
SELECT
  CURRENT_DATE AS report_date,
  (SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE) AS orders_today,
  (SELECT COUNT(*) FROM payments WHERE created_at::date = CURRENT_DATE) AS payments_today,
  (SELECT COUNT(*) FROM payments WHERE status = 'confirmed' AND confirmed_at::date = CURRENT_DATE) AS confirmed_today,
  (SELECT COUNT(*) FROM payments WHERE status = 'failed' AND created_at::date = CURRENT_DATE) AS failed_today,
  (SELECT COUNT(*) FROM support_tickets WHERE created_at::date = CURRENT_DATE) AS new_tickets,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') AS open_tickets;
```

### Weekly Revenue Report

```sql
SELECT
  DATE_TRUNC('week', confirmed_at) AS week,
  COUNT(*) AS transactions,
  SUM(amount_usd) AS revenue_usd,
  AVG(amount_usd) AS avg_order_value,
  COUNT(DISTINCT user_id) AS paying_users
FROM payments
WHERE status = 'confirmed'
  AND confirmed_at > NOW() - INTERVAL '12 weeks'
GROUP BY week
ORDER BY week DESC;
```

## Report Automation

Reports are generated in the admin dashboard (see Book 15 — Admin Reports section) with:

- Scheduled generation via pg_cron
- Delivery via Resend email
- Export options: CSV, Excel, PDF
- Dashboard widgets for real-time views
