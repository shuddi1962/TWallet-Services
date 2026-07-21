# Analytics Architecture

## Stack Overview

```text
┌─────────────────────────────────────────────────────┐
│                  Data Sources                        │
│  ┌──────────┐ ┌─────────┐ ┌───────┐ ┌───────────┐  │
│  │ Frontend │ │ Backend │ │Admin  │ │ 3rd Party │  │
│  │ Events   │ │ Events  │ │Events │ │ (Email,   │  │
│  │          │ │         │ │       │ │  Wallet)  │  │
│  └────┬─────┘ └────┬────┘ └───┬───┘ └─────┬─────┘  │
│       │            │          │            │        │
│       ▼            ▼          ▼            ▼        │
│  ┌─────────────────────────────────────────────┐    │
│  │            Ingestion Layer                    │    │
│  │  PostHog SDK (client) + Custom API (server)  │    │
│  └─────────────────────┬───────────────────────┘    │
│                        │                            │
│                        ▼                            │
│  ┌─────────────────────────────────────────────┐    │
│  │            Storage Layer                      │    │
│  │  PostHog Cloud (events, funnels, retention)  │    │
│  │  Supabase (business data, operational KPIs)   │    │
│  │  Sentry (errors, performance traces)          │    │
│  └─────────────────────┬───────────────────────┘    │
│                        │                            │
│                        ▼                            │
│  ┌─────────────────────────────────────────────┐    │
│  │            Reporting Layer                    │    │
│  │  PostHog Dashboards (product)                │    │
│  │  Custom Admin Reports (business)             │    │
│  │  Vercel Analytics (traffic, Web Vitals)      │    │
│  │  Future: Looker Studio / Metabase (BI)       │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Recommended Stack

| Component | Tool | Justification |
|-----------|------|--------------|
| Product analytics | PostHog | Self-hostable, event-based, funnels, retention, feature flags |
| Web analytics | Vercel Analytics | Built-in, zero configuration, Core Web Vitals |
| Error tracking | Sentry | Already integrated (see Book 24) |
| Business reports | Custom (Supabase + Admin) | Full control, integrated with existing auth/RBAC |
| Database | Supabase (PostgreSQL) | Existing, analytics tables + materialized views |

## Future Stack

| Component | Tool | When |
|-----------|------|------|
| Data warehouse | BigQuery / Snowflake | > 10M events/month |
| BI platform | Looker Studio / Metabase | > 10 dashboard consumers |
| ETL pipeline | dbt / Airbyte | > 5 data sources |
| Predictive analytics | Custom ML models | > 100K users |
