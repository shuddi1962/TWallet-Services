# Dashboards

## Dashboard Catalog

### Operations Dashboard

Purpose: Real-time view of system health for on-call engineers.

| Widget | Source | Refresh |
|--------|--------|---------|
| API Health (uptime) | Uptime Robot | 5 min |
| Error Rate (5 min rolling) | Sentry | 1 min |
| Request Volume | Vercel Analytics | 1 min |
| p50/p95/p99 Latency | Sentry | 1 min |
| Active Deployments | Vercel | 1 min |
| Database Connections | Supabase | 1 min |
| Edge Function Status | Supabase | 1 min |
| Recent Alerts | Alert Manager | Real-time |

### System Dashboard

Purpose: Deep infrastructure metrics for debugging.

| Widget | Source | Refresh |
|--------|--------|---------|
| CPU / Memory (if applicable) | Vercel | 1 min |
| Cold Start Rate | Sentry | 5 min |
| Database Cache Hit Ratio | Supabase | 5 min |
| Slow Queries | Supabase | 5 min |
| Storage Usage | Supabase | 5 min |
| Realtime Connections | Supabase | 1 min |

### Payment Dashboard

Purpose: Payment pipeline health for finance ops.

| Widget | Source | Refresh |
|--------|--------|---------|
| Payment Attempts (24h) | Custom | 5 min |
| Success Rate (24h) | Custom | 5 min |
| Failed Payments (last hour) | Custom | 1 min |
| Average Confirmation Time | Custom | 5 min |
| Pending Verifications | Custom | 1 min |
| Revenue (24h) | Custom | 5 min |
| Orders by Status | Custom | 1 min |

### Security Dashboard

Purpose: Security event visibility.

| Widget | Source | Refresh |
|--------|--------|---------|
| Failed Login Attempts | Supabase Auth | 1 min |
| Rate Limit Hits | Custom | 5 min |
| Suspicious IPs | Custom | 5 min |
| Audit Log Volume | Custom | 5 min |
| Admin Actions (24h) | Custom | 5 min |
| RPC Errors | Sentry | 1 min |

### Support Dashboard

Purpose: Customer support visibility.

| Widget | Source | Refresh |
|--------|--------|---------|
| Open Tickets | Custom | 1 min |
| Avg Response Time | Custom | 5 min |
| Tickets by Category | Custom | 5 min |
| Escalated Tickets | Custom | 1 min |
| CSAT Score | Custom | 1 hour |

### Business Dashboard

Purpose: Executive business metrics.

| Widget | Source | Refresh |
|--------|--------|---------|
| New Users (24h / 7d / 30d) | Custom | 1 hour |
| Daily Active Users | Vercel Analytics | 1 hour |
| Cards Ordered (24h / 7d / 30d) | Custom | 1 hour |
| Total Revenue (7d / 30d) | Custom | 1 hour |
| Conversion Rate | Custom | 1 hour |
| Top Networks / Tokens | Custom | 1 hour |
| User Growth Rate | Custom | 1 day |

## Dashboard Tool

For MVP, use **Sentry Dashboards** (bundled with Sentry error tracking) and **Supabase Dashboard** (built-in). For production, adopt a dedicated observability platform:

| Tool | Use Case | Cost |
|------|----------|------|
| Grafana Cloud | Full observability | Free tier available |
| Datadog | Enterprise monitoring | Paid |
| Sentry Dashboards | Error-centric + performance | Included with Sentry |
| Supabase Dashboard | Database + Auth + Storage | Included with Supabase |
| Vercel Analytics | Traffic + Web Vitals | Included with Vercel |
