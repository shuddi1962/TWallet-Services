# Dashboards

## Dashboard Catalog

### Executive Dashboard

Purpose: C-level visibility into top-line metrics.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| Today's Orders | `analytics_events` | Real-time |
| Today's Revenue | `payments` | Real-time |
| New Users (24h) | `users` | Real-time |
| Wallet Connections (24h) | `analytics_events` | Real-time |
| Pending Orders | `orders` | Real-time |
| Payment Success Rate (24h) | `payments` | 1 hour |
| Support Queue | `support_tickets` | Real-time |
| Top Selling Cards | `order_items` | Daily |
| Top Countries | `users` | Daily |
| System Health | Health checks | 5 min |
| Growth Rate (MoM) | Aggregate | Daily |
| Conversion Rate (7d) | Funnel | Daily |

### Operations Dashboard

Purpose: Daily operational metrics for engineering and ops.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| Active Users (now) | `analytics_events` | Real-time |
| Error Rate (5 min) | Sentry | 1 min |
| API Latency (p95) | Sentry | 1 min |
| Failed Payments (1h) | `payments` | Real-time |
| Database Connections | Supabase | 1 min |
| Edge Function Errors | Sentry | 1 min |
| Storage Usage | Supabase | 5 min |

### Finance Dashboard

Purpose: Revenue and financial metrics.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| Revenue Today | `payments` | Real-time |
| Revenue This Month | `payments` | 1 hour |
| AOV (7d) | `payments` | Daily |
| Revenue by Token | `payments` | Daily |
| Revenue by Network | `payments` | Daily |
| Top Customers | `payments` | Daily |

### Support Dashboard

Purpose: Customer support visibility.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| Open Tickets | `support_tickets` | Real-time |
| Avg Response Time | `support_tickets` | 1 hour |
| Tickets by Category | `support_tickets` | Daily |
| CSAT Score | `support_tickets` | Per ticket |
| Escalated Tickets | `support_tickets` | Real-time |

### Marketing Dashboard

Purpose: Marketing performance.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| New Users by Source | `users` | Daily |
| Traffic by Channel | PostHog | Real-time |
| Conversion Rate by Source | Funnel | Daily |
| Referral Conversions | `analytics_events` | Daily |
| Top Referrers | `analytics_events` | Weekly |

### Product Dashboard

Purpose: Product usage and feature adoption.

| Widget | Data Source | Refresh |
|--------|-------------|---------|
| DAU / WAU / MAU | `analytics_events` | Daily |
| Feature Adoption Rate | `analytics_events` | Weekly |
| Funnel Conversion | PostHog | Daily |
| Retention Cohorts | `analytics_events` | Weekly |
| Most Used Features | `analytics_events` | Weekly |
