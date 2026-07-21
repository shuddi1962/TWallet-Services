# Analytics API

> Base route: `/api/v1/analytics`
> All endpoints require JWT + admin role (Super Admin, Finance, Viewer). Data aggregated from orders, payments, and users tables.

---

## GET /api/v1/analytics/dashboard

Get aggregated dashboard analytics with time-series data.

**Auth:** JWT + admin role

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| date_from | ISO 8601 | 30 days ago | Start date |
| date_to | ISO 8601 | now | End date |
| granularity | string | day | `day`, `week`, `month` |

### Response `200`
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_revenue_usdc": "45230.50",
      "prev_period_revenue_usdc": "38500.00",
      "revenue_growth_pct": 17.5,
      "total_orders": 712,
      "prev_period_orders": 645,
      "orders_growth_pct": 10.4,
      "total_users": 1250,
      "new_users_period": 85,
      "active_users_period": 620
    },
    "revenue_timeseries": [
      { "date": "2026-06-21", "revenue_usdc": 1500.00, "orders": 24 },
      { "date": "2026-06-22", "revenue_usdc": 1820.00, "orders": 28 }
    ],
    "orders_by_status": {
      "pending": 34,
      "paid": 156,
      "processing": 89,
      "shipped": 45,
      "delivered": 678,
      "cancelled": 12,
      "refunded": 3
    },
    "revenue_by_network": [
      { "network": "ethereum", "revenue_usdc": 28500.00, "percentage": 63 },
      { "network": "polygon", "revenue_usdc": 12300.00, "percentage": 27 },
      { "network": "arbitrum", "revenue_usdc": 4430.50, "percentage": 10 }
    ],
    "users_by_country": [
      { "country": "US", "count": 450 },
      { "country": "GB", "count": 120 },
      { "country": "DE", "count": 85 }
    ]
  }
}
```

---

## GET /api/v1/analytics/orders

Detailed order analytics.

**Auth:** JWT + admin role

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| date_from | ISO 8601 | 30 days ago | — |
| date_to | ISO 8601 | now | — |
| granularity | string | day | `day`, `week`, `month` |

### Response `200`
```json
{
  "success": true,
  "data": {
    "total_orders": 712,
    "avg_order_value_usdc": "63.50",
    "orders_by_card": [
      { "card": "Visa Platinum", "count": 320, "revenue_usdc": 16000.00 },
      { "card": "Visa Virtual", "count": 250, "revenue_usdc": 7500.00 }
    ],
    "orders_by_type": {
      "physical": 480,
      "virtual": 232
    },
    "timeseries": [ ... ]
  }
}
```

---

## GET /api/v1/analytics/payments

Payment analytics.

**Auth:** JWT + admin role

### Response `200`
```json
{
  "success": true,
  "data": {
    "total_transactions": 680,
    "success_rate_pct": 97.2,
    "avg_confirmation_time_min": 2.5,
    "failed_transactions": 19,
    "payments_by_network": [ ... ],
    "payments_by_token": [ ... ],
    "daily_volume": [ ... ]
  }
}
```

---

## GET /api/v1/analytics/users

User growth and engagement analytics.

**Auth:** JWT + admin role

### Response `200`
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "new_users_today": 8,
    "new_users_this_week": 45,
    "new_users_this_month": 185,
    "users_with_wallet_pct": 71.2,
    "users_with_order_pct": 42.5,
    "users_by_country": [ ... ],
    "growth_timeseries": [
      { "date": "2026-06-21", "new_users": 12, "total_users": 1180 }
    ]
  }
}
```

---

## GET /api/v1/analytics/export

Export analytics data as CSV.

**Auth:** JWT + admin role

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| dataset | string | required | `revenue`, `orders`, `payments`, `users` |
| date_from | ISO 8601 | 30 days ago | — |
| date_to | ISO 8601 | now | — |
| granularity | string | day | — |

### Response `200`
Content-Type: `text/csv`
Content-Disposition: `attachment; filename="analytics-revenue-2026-07-21.csv"`
