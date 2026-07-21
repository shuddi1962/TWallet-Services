# Business KPIs

## KPI Definitions

### Growth KPIs

| KPI | Formula | Frequency | Target |
|-----|---------|-----------|--------|
| New Users | Count of `user_registered` events | Daily | Growth MoM > 20% |
| Verified Users | Users with verified email | Daily | > 80% of registrations |
| Wallet Connections | Count of `wallet_connected` events | Daily | > 50% of verified users |
| DAU Growth Rate | (DAU today — DAU yesterday) / DAU yesterday | Daily | > 5% |

### Conversion KPIs

| KPI | Formula | Frequency | Target |
|-----|---------|-----------|--------|
| Card Orders | Count of `card_ordered` events | Daily | Growth MoM > 15% |
| Order Conversion Rate | Orders / Wallet connections | Weekly | > 20% |
| Payment Success Rate | Confirmed / Started payments | Daily | > 95% |
| Average Order Value (AOV) | Revenue / Orders | Daily | > $50 |

### Customer KPIs

| KPI | Formula | Frequency | Target |
|-----|---------|-----------|--------|
| Active Customers | Users with ≥ 1 order in 30 days | Daily | > 60% of paying users |
| Support Tickets | Count of tickets created | Daily | < 5% of active users |
| CSAT Score | Average satisfaction rating | Per ticket | > 4.0 / 5.0 |
| Customer Churn Rate | Churned users / Total users | Monthly | < 5% |

### Financial KPIs

| KPI | Formula | Frequency | Target |
|-----|---------|-----------|--------|
| Gross Revenue | Sum of confirmed payments | Daily | Growth MoM > 20% |
| ARPU (Average Revenue Per User) | Revenue / Active users | Monthly | > $30 |
| LTV (Lifetime Value) | ARPU × Average customer lifespan | Quarterly | > 3× CAC |
| MRR (Monthly Recurring Revenue) | Recurring revenue (if subscriptions added) | Monthly | TBD |

## KPI Dashboard Query

```sql
-- Daily KPI summary
SELECT
  CURRENT_DATE AS date,
  COUNT(DISTINCT u.id) FILTER (WHERE u.created_at::date = CURRENT_DATE) AS new_users,
  COUNT(DISTINCT e.user_id) FILTER (WHERE e.event_name = 'wallet_connected' AND e.created_at::date = CURRENT_DATE) AS wallet_connections,
  COUNT(DISTINCT e.user_id) FILTER (WHERE e.event_name = 'card_ordered' AND e.created_at::date = CURRENT_DATE) AS orders,
  COUNT(DISTINCT e.user_id) FILTER (WHERE e.event_name = 'crypto_payment_confirmed' AND e.created_at::date = CURRENT_DATE) AS payments,
  COUNT(DISTINCT s.id) FILTER (WHERE s.created_at::date = CURRENT_DATE) AS support_tickets
FROM users u
LEFT JOIN analytics_events e ON e.user_id = u.id
LEFT JOIN support_tickets s ON s.user_id = u.id;
```

## KPI Reporting Cadence

| Report | Audience | Frequency | Delivery |
|--------|----------|-----------|----------|
| Daily snapshot | Engineering, Ops | Daily | Slack + Dashboard |
| Weekly growth | Product, Marketing | Weekly | Email + Dashboard |
| Monthly executive | C-level, Board | Monthly | Email + PDF |
| Quarterly review | All stakeholders | Quarterly | Presentation |
