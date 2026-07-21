# API Performance

## Response Time Targets

| Endpoint Group | Target (p95) |
|----------------|--------------|
| Authentication | < 300 ms |
| User profile | < 200 ms |
| Wallet operations | < 500 ms |
| Card operations | < 300 ms |
| Orders | < 500 ms |
| Payments | < 700 ms |
| Wallet verification | < 500 ms |
| Admin operations | < 1 s |
| Webhooks | < 2 s |

## Optimization Rules

### Pagination Required

Every list endpoint MUST use cursor-based pagination. No endpoint returns more than 100 items per page without explicit pagination parameters.

```typescript
// ✅ Cursor-based pagination
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

  const items = await db`
    SELECT id, amount, status, created_at
    FROM transactions
    WHERE user_id = ${userId}
      AND ${cursor ? sql`created_at < ${cursor}` : sql`true`}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return Response.json({
    data: items,
    nextCursor: items.length === limit ? items[items.length - 1].created_at : null,
  });
}
```

### Compression Enabled

Vercel automatically enables Brotli compression for all responses. Verify in production:

```bash
curl -H "Accept-Encoding: br" -I https://twallet.app/api/health
# Expected: content-encoding: br
```

### Structured Responses

Every API response follows a consistent shape:

```typescript
// Success
{ "data": T, "nextCursor": string | null }

// Error
{ "error": { "code": string, "message": string, "details": unknown } }

// List
{ "data": T[], "nextCursor": string | null, "total": number }
```

### Edge Functions vs Server Functions

| Runtime | Latency | Use When |
|---------|---------|----------|
| Edge Function (Vercel Edge) | ~50ms cold, ~5ms warm | Light processing, auth, redirects, geolocation |
| Server Function (Node.js) | ~200ms cold, ~10ms warm | Heavy processing, DB queries, complex logic |
| Supabase Edge Function (Deno) | ~100ms cold, ~10ms warm | Payment verification, admin operations |

### Reduce Payload Size

- Omit null/undefined fields from JSON responses
- Use integer IDs instead of strings where possible
- Shorten field names in response (trade-off: readability vs size; use sparingly)
- Prefer ISO date strings over full timestamps

## Monitoring

- All API endpoints monitored via Sentry for latency and error rate (see Book 24)
- Slow endpoints flagged in dashboard and reviewed weekly
- On-call alerted if p95 exceeds target for more than 5 minutes
