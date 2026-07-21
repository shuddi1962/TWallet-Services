# Observability — Dashboards

## Dashboard Inventory

| Dashboard | Audience | Purpose |
|-----------|----------|---------|
| Operations | On-call | Real-time system health |
| System | Engineering | Deep infrastructure metrics |
| Payments | Finance + Ops | Payment pipeline health |
| Security | Security Lead | Security event visibility |
| Support | Support Team | Customer support metrics |
| Business | Executives | Growth and revenue KPIs |

## Widgets Per Dashboard

### Operations Dashboard

- API Health (uptime)
- Error Rate (5 min rolling)
- Request Volume
- p50/p95/p99 Latency
- Active Deployments
- Database Connections
- Recent Alerts

### System Dashboard

- Cold Start Rate
- Cache Hit Ratio
- Slow Queries
- Storage Usage
- Realtime Connections

### Payment Dashboard

- Payment Attempts (24h)
- Success Rate (24h)
- Failed Payments (last hour)
- Avg Confirmation Time
- Revenue (24h)
- Orders by Status

### Security Dashboard

- Failed Logins
- Rate Limit Hits
- Audit Log Volume
- Admin Actions (24h)

### Business Dashboard

- New Users (24h/7d/30d)
- DAU/MAU
- Cards Ordered
- Total Revenue
- Conversion Rate

## Reference

See `24-Monitoring/BOOK-24-MONITORING/05-Dashboards.md` for full specification.
