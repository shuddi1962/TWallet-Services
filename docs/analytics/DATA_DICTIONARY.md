# Data Dictionary

## Database Tables

### analytics_events

Stores server-side analytics events that are not captured by PostHog.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_name | TEXT | Event identifier (snake_case) |
| user_id | UUID | FK to users (nullable for anonymous) |
| properties | JSONB | Event properties |
| timestamp | TIMESTAMPTZ | When the event occurred |
| session_id | TEXT | Session identifier |

### daily_metrics

Materialized daily aggregate metrics for dashboard queries.

| Column | Type | Description |
|--------|------|-------------|
| date | DATE | Metric date |
| metric_name | TEXT | KPI identifier |
| metric_value | NUMERIC | Numeric value |
| dimension | TEXT | Optional dimension (e.g., token, network) |

### user_sessions

Aggregated session data from analytics events.

| Column | Type | Description |
|--------|------|-------------|
| session_id | TEXT | Session identifier |
| user_id | UUID | FK to users |
| started_at | TIMESTAMPTZ | Session start |
| ended_at | TIMESTAMPTZ | Session end |
| duration_seconds | INTEGER | Session length |
| page_views | INTEGER | Pages visited |
| device_type | TEXT | mobile / desktop / tablet |
| country | TEXT | Country code |

## Analytics Tool Data

### PostHog

| Entity | Description |
|--------|-------------|
| Person | Identified by distinct_id (user UUID) |
| Event | User or system action with properties |
| Funnel | Ordered series of events |
| Cohort | Group of users by shared property |
| Dashboard | Collection of insight panels |
| Insight | Chart or table from event data |

### Vercel Analytics

| Entity | Description |
|--------|-------------|
| Page View | Route visit with referrer, device, country |
| Web Vital | LCP, CLS, INP, TTFB real-user measurements |
| Top Pages | Most visited routes |

### Sentry

| Entity | Description |
|--------|-------------|
| Error | Captured exception with stack trace |
| Transaction | Request/operation duration |
| Span | Individual step within a transaction |
| Performance | Aggregated transaction metrics |

## Data Lineage

```text
User Action (click, page load, API call)
    │
    ▼
Browser / Server
    │
    ├── PostHog SDK → PostHog Cloud → PostHog Dashboard
    │
    ├── Supabase Server → analytics_events table → Admin Reports
    │
    ├── Vercel Analytics → Vercel Dashboard
    │
    └── Sentry SDK → Sentry → Sentry Dashboard
```
