# Performance

> Database and application performance optimization strategy for TWallet Services.

---

## Performance Principles

1. **Index everything** — every query pattern has a covering index
2. **Paginate everything** — no unbounded result sets
3. **Server Components first** — minimize client-side data fetching
4. **Cache aggressively** — Next.js ISR + Supabase in-memory for hot data
5. **Profile before optimizing** — measure, then optimize

---

## Indexes

51 indexes across 19 tables. See 09-Indexes.md for the complete list.

Key performance indexes:
| Table | Index | Justification |
|-------|-------|---------------|
| card_orders | (user_id, status, created_at DESC) | User order list with status filter |
| payment_transactions | (tx_hash) UNIQUE | Replay protection + lookup |
| card_orders | (tracking_number) | Public tracking lookup |

---

## Pagination

Cursor-based (keyset pagination) for all list endpoints:

```sql
-- Before cursor: get first page
SELECT * FROM card_orders
WHERE user_id = '...'
ORDER BY created_at DESC, id DESC
LIMIT 21;  -- 20 + 1 extra to detect has_more

-- After cursor: get next page
SELECT * FROM card_orders
WHERE user_id = '...'
  AND (created_at < '2026-07-20T10:00:00Z'
    OR (created_at = '2026-07-20T10:00:00Z' AND id < 'last-uuid'))
ORDER BY created_at DESC, id DESC
LIMIT 21;
```

Why cursor-based over offset:
- Stable under concurrent writes
- O(1) pagination cost (vs O(n) for offset)
- No duplicate/skip issues when rows are inserted

---

## Server Components

```tsx
// GOOD: Server Component — fetches on server, no client waterfall
export default async function OrderListPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('card_orders')
    .select('*, card:card_products(name)')
    .order('created_at', { ascending: false })
    .limit(20);

  return <OrderTable orders={orders} />;
}

// AVOID: Client Component with useEffect fetching
// Causes waterfall: page load → JS load → fetch → render
```

---

## Caching Strategy

| Layer | Cache | TTL | Mechanism |
|-------|-------|-----|-----------|
| Next.js | Page (ISR) | Revalidate on demand | `revalidatePath()` / `revalidateTag()` |
| Next.js | Data cache | 60s (static data) | `unstable_cache` |
| Supabase | Query result | Varies | Postgres query cache |
| Browser | Static assets | 1 year | `Cache-Control: immutable` |
| CDN (Vercel) | Static pages | Edge cache | Automatic |

```ts
// Next.js data cache for stable queries
import { unstable_cache } from 'next/cache';

const getCardProducts = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase.from('card_products').select('*').eq('active', true);
    return data;
  },
  ['card-products'],
  { revalidate: 300 }  // 5 minutes
);
```

---

## Connection Pooling

- Supabase manages connection pooling automatically via PgBouncer
- Serverless functions (Edge Functions, Next.js) use short-lived connections
- Transaction mode pooling for web requests
- Session mode for long-running operations (reports, exports)

---

## Query Optimization

### SELECT only needed columns

```ts
// GOOD
supabase.from('profiles').select('id, full_name, avatar_url');

// AVOID
supabase.from('profiles').select('*');
```

### Use count with head: true

```ts
// Fast count (no data returned)
const { count } = await supabase
  .from('card_orders')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending');
```

### Batch queries with Promise.all

```ts
const [orders, payments, users] = await Promise.all([
  supabase.from('card_orders').select('*').limit(5),
  supabase.from('payment_transactions').select('*').limit(5),
  supabase.from('profiles').select('*').limit(5),
]);
```

### Use EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM card_orders
WHERE user_id = '...'
ORDER BY created_at DESC
LIMIT 20;
```

Check for: sequential scans, missing indexes, sort operations.

---

## Monitoring

| Tool | What to Watch | Alert Threshold |
|------|---------------|-----------------|
| Supabase Dashboard | Query performance, slow queries | > 500ms avg |
| Supabase Logs | Error rate | > 1% error rate |
| Supabase Advisors | Missing indexes, cache hit ratio | < 95% cache hit |
| Vercel Analytics | API response times | > 1000ms p95 |
| Sentry | Database errors, N+1 queries | Any increase |

---

## N+1 Query Prevention

```tsx
// BAD: N+1 — queries profiles in a loop
{orders.map(order => (
  <CustomerInfo userId={order.user_id} />  // N queries!
))}

// GOOD: Single query with join
const { data: orders } = await supabase
  .from('card_orders')
  .select('*, profiles!inner(full_name, email)')
  .limit(20);
```
