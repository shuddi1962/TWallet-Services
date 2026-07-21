# Views — TWallet Services Database

> Currently there are no database views or materialized views defined. This document will be updated as views are added.

## Planned Views (future)

| View | Purpose | Priority |
|------|---------|----------|
| `vw_dashboard_summary` | Aggregated stats for admin dashboard | High |
| `vw_user_portfolio` | User wallet balances across networks | Medium |
| `vw_revenue_daily` | Daily revenue aggregation | Medium |
| `vw_active_orders` | Currently active/pending orders | Low |
| `vw_ticket_overview` | Open tickets grouped by priority/category | Low |

## Materialized Views (future)

| View | Refresh | Purpose |
|------|---------|---------|
| `mv_order_stats` | Hourly | Cached aggregate order statistics |
| `mv_daily_revenue` | Daily | Revenue by day for charts |

When views are created, add a corresponding migration (`YYYYMMDDXXXXXX_create_views.sql`) and update this document.
