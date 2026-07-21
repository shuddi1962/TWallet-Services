# 04 — Dashboard Widgets

> Component ID: ADM-004 | Status: Approved
> Statistics cards and charts (Recharts) for the admin overview.

## Statistics (6)

| Stat | Value | Icon | Color | Trend |
|------|-------|------|-------|-------|
| Users | COUNT profiles | Users | `--color-primary` | +12% vs last week |
| Orders | COUNT card_orders | ShoppingBag | `--color-info` | +8% |
| Revenue | SUM confirmed payments | DollarSign | `--color-success` | +23% |
| Transactions | COUNT confirmed tx | ArrowLeftRight | `--color-primary` | +15% |
| Wallet Connections | COUNT active wallets | Wallet | `--color-info` | +5% |
| Support Tickets | COUNT open tickets | LifeBuoy | `--color-warning` | -3% (good) |

- 3-column grid (desktop) / 2x3 (tablet) / 2x3 (mobile)
- Cards: white, 20px radius, `--shadow-md`
- Each: icon (40px circle) + label + value (count-up) + trend badge (up=success, down=danger or success if good)

## Charts (5 — Recharts)

### 1. Orders Trend (Line Chart)
- X-axis: last 30 days
- Y-axis: order count
- Lines: total orders, paid orders
- Colors: `--color-primary` (total), `--color-success` (paid)
- Height: 240px
- Tooltip on hover: date + counts

### 2. Revenue Trend (Area Chart)
- X-axis: last 30 days
- Y-axis: revenue (USDC equivalent)
- Area: gradient fill (primary at 20% → transparent)
- Height: 240px

### 3. Network Usage (Bar Chart)
- X-axis: network names (Ethereum, Polygon, etc.)
- Y-axis: transaction count
- Bars: color per network brand color
- Height: 240px

### 4. Token Distribution (Pie Chart)
- Slices: USDC, USDT, ETH, BNB, MATIC
- Colors: distinct per token
- Height: 240px
- Legend: right side with token name + percentage

### 5. New Users (Bar Chart)
- X-axis: last 14 days
- Y-axis: new user count
- Bars: `--color-primary`
- Height: 240px

## Chart Configuration

```ts
// Recharts theme matching Book 04 design tokens
const chartTheme = {
  primary: '#2563EB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#0EA5E9',
  muted: '#94A3B8',
  grid: '#E2E8F0',
  text: '#475569',
};

// Responsive container
<ResponsiveContainer width="100%" height={240}>
  <LineChart data={ordersData}>
    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
    <XAxis dataKey="date" stroke={chartTheme.text} fontSize={12} />
    <YAxis stroke={chartTheme.text} fontSize={12} />
    <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #E2E8F0' }} />
    <Line type="monotone" dataKey="total" stroke={chartTheme.primary} strokeWidth={2} />
    <Line type="monotone" dataKey="paid" stroke={chartTheme.success} strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

## Component Tree

```
DashboardWidgets (Client Component — Recharts)
├── StatsGrid (3 columns)
│   ├── StatsCard (Users, trend badge)
│   ├── StatsCard (Orders, trend badge)
│   ├── StatsCard (Revenue, trend badge)
│   ├── StatsCard (Transactions, trend badge)
│   ├── StatsCard (Wallet Connections, trend badge)
│   └── StatsCard (Support Tickets, trend badge)
└── ChartsGrid (2 columns)
    ├── OrdersTrendChart (Line)
    ├── RevenueTrendChart (Area)
    ├── NetworkUsageChart (Bar)
    ├── TokenDistributionChart (Pie)
    └── NewUsersChart (Bar)
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton charts (gray blocks) |
| Data present | Interactive charts with tooltips |
| No data | "No data available" in chart area |
| Error | "Failed to load chart" + retry |

## Accessibility

- Charts: `aria-label` describing the data (e.g., "Orders trend for last 30 days")
- Recharts has limited ARIA support; provide a data table fallback below chart (collapsible)
- Trend badges: text + icon (not color alone): "↑ 12% vs last week"
- Stats: `aria-label="[label]: [value], [trend]"`
