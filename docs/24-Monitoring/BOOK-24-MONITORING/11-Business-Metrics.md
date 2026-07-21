# Business Metrics

## Key Performance Indicators

### Growth KPIs

| Metric | Definition | Frequency |
|--------|------------|-----------|
| New Users | Registrations completed | Daily |
| Total Users | Cumulative user count | Daily |
| Daily Active Users (DAU) | Unique users with activity | Daily |
| Monthly Active Users (MAU) | Unique users in 30 days | Daily |
| User Growth Rate | (New — Churned) / Total | Weekly |

### Engagement KPIs

| Metric | Definition | Frequency |
|--------|------------|-----------|
| Wallet Connection Rate | Connections / Visits | Daily |
| Card Orders | Orders created | Daily |
| Order Completion Rate | Completed / Created | Daily |
| Average Order Value | Total revenue / Orders | Daily |
| Session Duration | Average time per session | Daily |

### Financial KPIs

| Metric | Definition | Frequency |
|--------|------------|-----------|
| Gross Revenue | Total payments received | Daily |
| Revenue per User | Revenue / Active users | Daily |
| Payment Success Rate | Successful / Total attempts | Daily |
| Average Payment Amount | Total / Number of payments | Daily |
| Top Token by Volume | Highest transaction volume | Daily |
| Top Network by Volume | Highest transaction volume | Daily |

### Customer Experience KPIs

| Metric | Definition | Frequency |
|--------|------------|-----------|
| Support Tickets Created | Count | Daily |
| Tickets Resolved | Resolved count | Daily |
| Average Resolution Time | Total time / Resolved | Daily |
| CSAT Score | Average satisfaction rating | Per ticket |
| NPS | Net Promoter Score | Monthly |

## Data Sources

| KPI | Source | Method |
|-----|--------|--------|
| User metrics | Supabase Auth + `profiles` table | SQL query |
| Order metrics | `orders` + `order_items` tables | SQL query |
| Payment metrics | `payments` + `transactions` tables | SQL query |
| Wallet metrics | `wallets` + `wallet_transactions` tables | SQL query |
| Revenue metrics | `payments` table | SQL query |
| Support metrics | `support_tickets` table | SQL query |
| Engagement metrics | Vercel Analytics + custom events | Platform API |

## Reporting Cadence

| Report | Audience | Frequency | Format |
|--------|----------|-----------|--------|
| Executive Summary | C-level | Weekly | Email + Slack |
| Growth Report | Product | Daily | Dashboard |
| Financial Report | Finance | Daily | Dashboard |
| Operations Report | Engineering | Real-time | Dashboard |
| Customer Health | Support | Weekly | Dashboard |
