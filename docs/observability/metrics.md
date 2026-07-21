# Observability — Metrics

## Collected Metrics

### API

- `requests_total` — Total requests (counter)
- `request_duration_ms` — Latency histogram (p50/p95/p99)
- `errors_total` — Error count (counter)
- `errors_by_status` — Errors by HTTP status

### Business

- `orders_total` / `orders_by_status` — Order tracking
- `payments_total` / `payments_success` / `payments_failed` — Payment tracking
- `users_active` — Daily active users
- `wallet_connections` / `wallet_connections_success` — Wallet tracking

### Infrastructure

- `db_connections_active` — Active connections
- `db_query_duration_ms` — Query duration
- `db_slow_queries_total` — Slow queries
- `edge_function_duration_ms` — Edge function latency
- `edge_function_cold_starts` — Cold starts
- `edge_function_errors` — Edge function errors

## Metric Naming Convention

```
twallet.<service>.<metric_name>.<unit>
```

## Reference

See `24-Monitoring/BOOK-24-MONITORING/02-Metrics.md` for full specification.
