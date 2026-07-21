# 16 — System Health

> Component ID: ADM-016 | Status: Approved
> Real-time system monitoring — status indicators, uptime, alerts.

## Route

`/admin/health` — Server Component + Client (polling)

## Access

- Super Admin only

## Monitors (9)

| # | Monitor | Check Method | Icon | Description |
|---|---------|-------------|------|-------------|
| 1 | API | HTTP GET to health endpoint | Globe | Next.js API routes reachable |
| 2 | Database | Test query to Supabase Postgres | Database | DB connection + query time |
| 3 | Auth | Test Supabase Auth status | Shield | Auth service available |
| 4 | Storage | Test Supabase Storage | HardDrive | Upload + list ability |
| 5 | Edge Functions | Invoke health edge function | FunctionSquare | Deno runtime |
| 6 | Blockchain RPC | Lightweight call to Alchemy | Link2 | RPC endpoint reachable |
| 7 | Email (Resend) | API key test via Resend | Send | Email service reachable |
| 8 | Redis (if used) | PING | Server | Cache layer reachable |
| 9 | Realtime | Test Supabase Realtime channel | Radio | WS connection works |

## Status Indicators

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| Healthy | Green | CheckCircle | < 1s response, all good |
| Degraded | Amber | AlertTriangle | > 2s response or intermittent |
| Down | Red | XCircle | No response or error |

## Layout

```
┌──────────────────────────────────────────────┐
│  System Health                  Last checked: │
│  dot   All systems operational    2s ago      │
├──────────────────────────────────────────────┤
│                                                │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ API          │  │ Database    │             │
│  │ ● Healthy    │  │ ● Healthy   │             │
│  │ 45ms         │  │ 23ms        │             │
│  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ Auth         │  │ Storage     │             │
│  │ ● Healthy    │  │ ● Degraded  │             │
│  │ 120ms        │  │ 2.4s        │             │
│  └─────────────┘  └─────────────┘             │
│  ...                                           │
│                                                │
├──────────────────────────────────────────────┤
│  Incidents (Past 24h)                          │
│  • 3h ago — Database degraded (2m)             │
│  • 7h ago — Auth intermittent (5m)             │
└──────────────────────────────────────────────┘
```

## Features

### Status Cards

Each monitor card:

| Element | Description |
|---------|-------------|
| Icon | Service icon |
| Name | Service name |
| Status | Dots + text (Healthy/Degraded/Down) |
| Latency | Response time in ms |
| Last Checked | Relative time |
| Check Button | Manual re-check |

### Overall Status

- Banner at top: overall status + "Last checked: X ago"
- Green: "All systems operational"
- Amber: "Some systems degraded"
- Red: "System issues detected"

### Incident History

- Past 24 hours of recorded incidents
- Auto-logged when a monitor transitions to Degraded/Down
- Each incident: time, duration, description

### Auto-refresh

- Polls every 30 seconds (client-side `setInterval`)
- Manual "Check Now" button for immediate refresh
- Edge Function (`health-check`) performs all checks server-side

## Component Tree

```
AdminHealthPage (Server Component)
├── PageHeader ("System Health" + Last Checked + Check Now button)
├── OverallStatusBanner (Healthy/Degraded/Down + description)
├── MonitorsGrid (3 columns)
│   ├── MonitorCard (API)
│   │   ├── StatusDot (color-coded)
│   │   ├── ServiceName
│   │   ├── Latency (ms)
│   │   └── LastChecked
│   ├── MonitorCard (Database)
│   ├── MonitorCard (Auth)
│   ├── MonitorCard (Storage)
│   ├── MonitorCard (Edge Functions)
│   ├── MonitorCard (Blockchain RPC)
│   ├── MonitorCard (Email)
│   ├── MonitorCard (Redis)
│   └── MonitorCard (Realtime)
└── IncidentsSection
    ├── SectionHeader ("Incidents — Past 24h")
    └── IncidentList
        └── IncidentItem (time, duration, description, status)
```

## Edge Function

```
health-check (Edge Function — Deno)
  → Checks each of 9 monitors
  → Returns status for each: { name, status, latency, error? }
  → Logs to audit_logs if any monitor is non-healthy
  → Creates incident if transition from healthy to degraded/down
```

## Server Actions

```ts
checkHealth(): Promise<HealthCheckResult[]>
getIncidents(hours: number): Promise<Incident[]>
```

## States

| State | UI |
|-------|-----|
| Loading (initial) | Skeleton cards (9) |
| Loading (refresh) | Spinner on "Check Now" button |
| All healthy | Green banner + all green cards |
| Some degraded | Amber banner + mixed cards |
| Down | Red banner + red card(s) + alert sound? |
| Error | "Failed to check health" + Retry |
