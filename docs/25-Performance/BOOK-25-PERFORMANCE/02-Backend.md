# Backend Performance

## Optimization Areas

| Area | Optimization | Impact |
|------|-------------|--------|
| Edge Functions | Minimize cold starts, optimize imports | High |
| Server Actions | Batch DB calls, return minimal data | High |
| API Routes | Use Edge Runtime where possible | Medium |
| Database Calls | Indexed queries, keyset pagination | High |
| Authentication | Session reuse, JWT verification caching | Medium |
| Wallet Verification | RPC response caching, batch confirmations | High |
| Payment Verification | Optimistic confirmation + background verify | High |
| Background Jobs | Supabase pg_cron for scheduled tasks | Medium |

## Rules

1. **Avoid duplicate queries** — Deduplicate database calls within the same request; use React `cache()` or request-scoped memoization.
2. **Return only required fields** — Never `SELECT *` from the database; specify exact columns. Never return full entities from API when only a subset is needed.
3. **Use pagination** — Every list endpoint must use cursor-based pagination; no unbounded queries.
4. **Use indexes** — Every query predicate column must be indexed. Run `EXPLAIN ANALYZE` on every new query.
5. **Avoid N+1 queries** — Batch related data using joins or data loaders. Profile with Sentry to detect N+1 patterns.

## Implementation Patterns

### Batch Database Calls

```typescript
// ❌ N+1: fetching orders, then fetching each order's items
const orders = await db`SELECT * FROM orders WHERE user_id = ${userId}`;
for (const order of orders) {
  order.items = await db`SELECT * FROM order_items WHERE order_id = ${order.id}`;
}

// ✅ Batched: single join query
const orders = await db`
  SELECT o.*, oi.id AS item_id, oi.product_name, oi.amount
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.id
  WHERE o.user_id = ${userId}
`;
```

### Edge Function Optimization

```typescript
// supabase/functions/verify-payment/index.ts
// Defer heavy imports to reduce cold start
const prepare = () => {
  const { createPublicClient, http } = await import('npm:viem');
  const { mainnet } = await import('npm:viem/chains');
  return { createPublicClient, http, mainnet };
};

Deno.serve(async (req) => {
  const { createPublicClient, http, mainnet } = await prepare();
  // ...
});
```

### Minimal API Responses

```typescript
// ❌ Returns full entity
export async function GET() {
  const users = await db`SELECT * FROM users LIMIT 10`;
  return Response.json(users);
}

// ✅ Returns only required fields with pagination
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const users = await db`
    SELECT id, name, email, created_at
    FROM users
    ${cursor ? sql`WHERE id > ${cursor}` : sql``}
    ORDER BY id
    LIMIT 10
  `;
  return Response.json(users);
}
```
