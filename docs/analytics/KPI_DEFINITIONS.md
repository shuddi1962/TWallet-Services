# KPI Definitions

## Growth KPIs

| KPI | Formula | Data Source | Frequency | Target |
|-----|---------|-------------|-----------|--------|
| New Users | COUNT(user_registered) | `analytics_events` | Daily | Growth MoM > 20% |
| Verified Users | COUNT(email_verified) | `analytics_events` | Daily | > 80% of registrations |
| Wallet Connections | COUNT(wallet_connected) | `analytics_events` | Daily | > 50% of verified users |
| DAU | COUNT(DISTINCT user_id with activity) | `analytics_events` | Daily | Growth > 5% |
| WAU | COUNT(DISTINCT user_id with activity in 7d) | `analytics_events` | Weekly | — |
| MAU | COUNT(DISTINCT user_id with activity in 30d) | `analytics_events` | Weekly | — |

## Conversion KPIs

| KPI | Formula | Data Source | Frequency | Target |
|-----|---------|-------------|-----------|--------|
| Card Orders | COUNT(card_ordered) | `analytics_events` | Daily | Growth MoM > 15% |
| Order Conversion Rate | Orders / Wallet connections | Aggregate | Weekly | > 20% |
| Payment Success Rate | Confirmed / Started | `payments` | Daily | > 95% |
| AOV | Revenue / Orders | `payments` | Daily | > $50 |
| Checkout Abandonment | Started — Completed / Started | Funnel | Weekly | < 40% |

## Customer KPIs

| KPI | Formula | Data Source | Frequency | Target |
|-----|---------|-------------|-----------|--------|
| Active Customers | Users with ≥ 1 order in 30d | `orders` | Daily | > 60% of paying users |
| Support Tickets per User | Tickets / Active users | `support_tickets` | Weekly | < 5% |
| CSAT Score | AVG(satisfaction_score) | `support_tickets` | Per ticket | > 4.0 |
| Customer Churn Rate | Churned / Total users | `analytics_events` | Monthly | < 5% |
| Day 1 Retention | Active D1 / Total signups | `analytics_events` | Daily | > 40% |
| Day 7 Retention | Active D7 / Total signups | `analytics_events` | Weekly | > 20% |
| Day 30 Retention | Active D30 / Total signups | `analytics_events` | Monthly | > 10% |

## Financial KPIs

| KPI | Formula | Data Source | Frequency | Target |
|-----|---------|-------------|-----------|--------|
| Gross Revenue | SUM(amount_usd) WHERE confirmed | `payments` | Daily | Growth MoM > 20% |
| ARPU | Revenue / Active users | Aggregate | Monthly | > $30 |
| LTV | ARPU × Avg customer lifespan | Aggregate | Quarterly | > 3× CAC |
| Revenue per Token | SUM(amount_usd) GROUP BY token | `payments` | Weekly | — |
| Revenue per Network | SUM(amount_usd) GROUP BY network | `payments` | Weekly | — |

## How to Add a New KPI

1. Add the event tracking (if new event needed)
2. Define the KPI in this document
3. Add widget to relevant dashboard
4. Add to reporting schedule
5. Announce to team
