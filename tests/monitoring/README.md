# Monitoring Scripts

| Script | Purpose | How to Run |
|--------|---------|------------|
| `uptime-checks.ts` | Generate monitor config for Better Uptime / UptimeRobot | `npx tsx tests/monitoring/uptime-checks.ts` |
| `verify-dashboards.ts` | Verify Sentry + PostHog are receiving events | (future) |

## Quick Start

```bash
# Generate uptime monitor config
npx tsx tests/monitoring/uptime-checks.ts

# Output will list all monitors to create in Better Uptime / UptimeRobot
```
