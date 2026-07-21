# Metrics

## Service Metrics

Every service MUST emit the following metrics:

### Rate

- **requests_total** — Total HTTP requests (counter)
- **requests_by_status** — Requests grouped by status code (counter)

### Latency

- **request_duration_ms** — Request duration (histogram, p50/p95/p99)

### Errors

- **errors_total** — Total errors (counter)
- **errors_by_type** — Errors grouped by error type (counter)

### Business

- **orders_total** — Orders created (counter)
- **orders_by_status** — Orders grouped by status (gauge)
- **payments_total** — Payment attempts (counter)
- **payments_success** — Successful payments (counter)
- **payments_failed** — Failed payments (counter)
- **users_active** — Daily active users (gauge)
- **wallet_connections** — Wallet connection attempts (counter)
- **wallet_connections_success** — Successful connections (counter)

## Infrastructure Metrics

### Database

- **db_connections_active** — Active connections (gauge)
- **db_query_duration_ms** — Query duration (histogram)
- **db_slow_queries_total** — Queries exceeding threshold (counter)
- **db_pool_usage** — Connection pool percentage (gauge)

### Edge Functions

- **edge_function_duration_ms** — Execution duration (histogram)
- **edge_function_cold_starts** — Cold start count (counter)
- **edge_function_errors** — Error count (counter)

### Storage

- **storage_bytes_total** — Total bytes stored (gauge)
- **storage_requests_total** — Storage requests (counter)
- **storage_errors_total** — Storage errors (counter)

## Collection Strategy

| Source | Method | Tool |
|--------|--------|------|
| Vercel Functions | Built-in analytics | Vercel Dashboard |
| Edge Functions | Custom metrics via log parsing | Sentry + custom |
| Database | pg_stat_statements + Supabase | Supabase Dashboard |
| Client | Web Vitals API + Sentry | Vercel Analytics + Sentry |
| Uptime | External probes | Better Stack |

## Metric Naming Convention

```
twallet.<service>.<metric_name>.<unit>
```

Examples:
- `twallet.api.request_duration_ms`
- `twallet.payments.confirmation_time_ms`
- `twallet.db.connections_active`
