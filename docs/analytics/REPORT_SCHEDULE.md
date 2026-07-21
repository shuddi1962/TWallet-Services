# Report Schedule

## Daily Reports

| Report | Time (UTC) | Content | Delivery | Owner |
|--------|------------|---------|----------|-------|
| Daily Ops Summary | 06:00 | Orders, payments, errors, support | Slack #ops | Engineering |
| Payment Reconciliation | 06:00 | All payments (pending, confirmed, failed) | Email to finance | Engineering |
| Security Events Digest | 08:00 | Auth failures, rate limit hits, suspicious IPs | Slack #security | Security |

### Daily Ops SQL

```sql
SELECT
  CURRENT_DATE AS date,
  (SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE) AS orders,
  (SELECT COUNT(*) FROM payments WHERE created_at::date = CURRENT_DATE) AS payments,
  (SELECT COUNT(*) FROM payments WHERE status = 'confirmed' AND confirmed_at::date = CURRENT_DATE) AS confirmed,
  (SELECT COUNT(*) FROM payments WHERE status = 'failed' AND created_at::date = CURRENT_DATE) AS failed,
  (SELECT COUNT(*) FROM support_tickets WHERE created_at::date = CURRENT_DATE) AS new_tickets,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') AS open_tickets;
```

## Weekly Reports

| Report | Day | Time (UTC) | Content | Delivery | Owner |
|--------|-----|------------|---------|----------|-------|
| Growth Report | Monday | 08:00 | New users, DAU, wallet connects, orders | Email + Dashboard | Product |
| Performance Report | Tuesday | 08:00 | p95 latency, error rates, slow queries | Email | Engineering |
| Revenue Report | Wednesday | 08:00 | Weekly revenue, AOV, top tokens/networks | Email | Finance |
| Support Report | Thursday | 08:00 | Ticket volume, CSAT, resolution time, categories | Email | Support |

## Monthly Reports

| Report | Day | Time (UTC) | Content | Delivery | Owner |
|--------|-----|------------|---------|----------|-------|
| Executive Summary | 1st | 08:00 | All KPIs, growth trends, financials, recommendations | Email + PDF + Dashboard | CTO |
| Customer Trends | 2nd | 08:00 | Retention cohorts, churn, customer segments | Email | Product |
| Feature Usage | 3rd | 08:00 | Feature adoption rates, popular features, power users | Email | Product |
| Infrastructure Review | Last Friday | 08:00 | Cost analysis, scaling metrics, capacity planning | Email | Engineering |

## Quarterly Reports

| Report | Month | Content | Delivery | Owner |
|--------|-------|---------|----------|-------|
| Business Review | Jan, Apr, Jul, Oct | All KPIs, YoY growth, strategic recommendations | Presentation | CTO |
| Security Audit | Jan, Jul | Security events, audit findings, compliance | Email + Dashboard | Security |
| Performance Audit | Apr, Oct | Performance trends, capacity planning | Email | Engineering |

## Automated Report System

Reports use the admin reporting system with:

- pg_cron scheduling (database queries)
- Resend email API (delivery)
- Supabase Storage (PDF report storage)
- Admin dashboard (on-demand access)
