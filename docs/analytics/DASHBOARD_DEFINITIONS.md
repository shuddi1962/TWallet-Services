# Dashboard Definitions

## Executive Dashboard

Purpose: C-level visibility into top-line business metrics.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| Today's Orders | Counter | `analytics_events` | Real-time |
| Today's Revenue | Currency | `payments` | Real-time |
| New Users | Counter | `users` | Real-time |
| Wallet Connections | Counter | `analytics_events` | Real-time |
| Payment Success Rate | Percentage | `payments` | 1 hour |
| Support Queue | Counter | `support_tickets` | Real-time |
| Top Selling Cards | Bar chart | `order_items` | Daily |
| Growth Rate | Percentage | Aggregate | Daily |
| Conversion Rate | Percentage | Funnel | Daily |

## Operations Dashboard

Purpose: Real-time system health for engineering.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| Active Users | Counter | `analytics_events` | Real-time |
| Error Rate | Percentage | Sentry | 1 min |
| API Latency (p95) | Duration | Sentry | 1 min |
| Failed Payments | Counter | `payments` | Real-time |
| Database Connections | Gauge | Supabase | 1 min |
| Edge Function Errors | Counter | Sentry | 1 min |

## Finance Dashboard

Purpose: Revenue and financial metrics.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| Revenue Today | Currency | `payments` | Real-time |
| Revenue This Month | Currency | `payments` | 1 hour |
| AOV (7d) | Currency | `payments` | Daily |
| Revenue by Token | Pie chart | `payments` | Daily |
| Revenue by Network | Bar chart | `payments` | Daily |

## Support Dashboard

Purpose: Customer support visibility.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| Open Tickets | Counter | `support_tickets` | Real-time |
| Avg Response Time | Duration | `support_tickets` | 1 hour |
| Tickets by Category | Bar chart | `support_tickets` | Daily |
| CSAT Score | Rating | `support_tickets` | Per ticket |

## Marketing Dashboard

Purpose: Marketing performance.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| New Users by Source | Bar chart | `users` | Daily |
| Traffic by Channel | Pie chart | PostHog | Real-time |
| Conversion Rate by Source | Percentage | Funnel | Daily |
| Top Referrers | Table | `analytics_events` | Weekly |

## Product Dashboard

Purpose: Product usage and feature adoption.

| Widget | Type | Source | Refresh |
|--------|------|--------|---------|
| DAU / WAU / MAU | Area chart | `analytics_events` | Daily |
| Feature Adoption Rate | Percentage | `analytics_events` | Weekly |
| Funnel Conversion | Funnel chart | PostHog | Daily |
| Retention Cohorts | Table | `analytics_events` | Weekly |
