# Database Performance

## Supabase PostgreSQL Optimization

### Indexes

Every query predicate MUST be indexed. The database schema already defines 65 indexes (see Book 18). Key categories:

| Index Type | Usage | Example |
|-----------|-------|---------|
| B-tree (default) | Equality and range queries | `WHERE user_id = 'abc'` |
| Composite | Multi-column queries | `WHERE status = 'pending' AND created_at > '2026-01-01'` |
| Partial | Filtered subsets | `WHERE deleted_at IS NULL` (soft delete support) |
| Covering | Index-only scans | Include `status` in index for status queries |

### Query Optimization

```sql
-- Always EXPLAIN ANALYZE new queries
EXPLAIN ANALYZE
SELECT id, amount, status
FROM payments
WHERE user_id = 'abc123'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Look for:
-- - Sequential scans on large tables (add index)
-- - Sort operations (add index on ORDER BY column)
-- - High row estimates vs actual (update statistics)
```

### Common Query Patterns

```typescript
// ✅ Cursor-based pagination
const orders = await db`
  SELECT id, amount, status, created_at
  FROM orders
  WHERE user_id = ${userId}
    AND ${cursor ? sql`created_at < ${cursor}` : sql`true`}
  ORDER BY created_at DESC
  LIMIT 20
`;

// ✅ Aggregation with index
const stats = await db`
  SELECT status, COUNT(*)::int AS count
  FROM orders
  WHERE user_id = ${userId}
  GROUP BY status
`;

// ✅ Batch fetch with IN clause
const cards = await db`
  SELECT * FROM cards
  WHERE id = ANY(${cardIds})
`;
```

### Connection Pooling

Supabase manages connection pooling automatically via PgBouncer. Monitor:

| Metric | Warning | Critical |
|--------|---------|----------|
| Active connections | > 80% of max | > 95% of max |
| Queued queries | > 0 | > 10 |
| Idle in transaction | > 5 | > 20 |

### Materialized Views (Future)

For expensive aggregations (dashboard stats, reports), consider materialized views with periodic refresh:

```sql
CREATE MATERIALIZED VIEW mv_daily_stats AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS orders,
  SUM(amount) AS revenue
FROM payments
WHERE status = 'confirmed'
GROUP BY DATE(created_at)
ORDER BY day DESC;

REFRESH MATERIALIZED VIEW mv_daily_stats;
```

### N+1 Detection

Add query logging in development to detect N+1 patterns:

```typescript
const queries: string[] = [];
const db = supabaseClient.from('orders');

// Log all queries to detect patterns
db.on('query', (query) => {
  queries.push(query.sql);
  if (queries.filter((q) => q.includes('FROM orders')).length > 5) {
    console.warn('Potential N+1 detected');
  }
});
```
