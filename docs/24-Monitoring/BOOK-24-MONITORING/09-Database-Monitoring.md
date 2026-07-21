# Database Monitoring

## Monitored Metrics

| Metric | Description | Warning | Critical |
|--------|-------------|---------|----------|
| Active connections | Current connection count | > 80% of max | > 95% of max |
| Query duration (p50) | Median query time | > 50 ms | > 100 ms |
| Query duration (p95) | Slow query threshold | > 200 ms | > 500 ms |
| Slow queries | Queries > 1 second | > 5/min | > 20/min |
| Cache hit ratio | Shared buffer hit rate | < 95% | < 90% |
| Replication lag | Standby lag (if applicable) | > 5 s | > 30 s |
| Deadlocks | Deadlock count | > 0 | > 5/hour |
| Table bloat | Estimated bloat ratio | > 20% | > 40% |

## Slow Query Detection

Supabase provides `pg_stat_statements` for query analysis. Use this query to identify slow queries:

```sql
SELECT
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  rows,
  (100 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0)) AS cache_hit_ratio
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
ORDER BY mean_exec_time DESC
LIMIT 20;
```

## Index Health

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY tablename;
```

## Connection Pool

Supabase manages the connection pool. Monitor:

- **Pool usage** — Current connections / max connections
- **Queued queries** — Queries waiting for a connection
- **Idle connections** — Connections in idle state

## Migration Monitoring

| Check | Condition | Action |
|-------|-----------|--------|
| Migration status | Pending migrations exist | Run migrations |
| Migration duration | > 30 seconds | Investigate lock contention |
| Schema drift | Schema differs from expected | Run migration repair |

## Supabase Dashboard Queries

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '5 seconds'
ORDER BY duration DESC;
```
