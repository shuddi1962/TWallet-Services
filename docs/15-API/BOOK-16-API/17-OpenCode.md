# OpenCode — Build Prompt

> Complete directive for implementing the TWallet Services REST API using Next.js Route Handlers, Supabase, Server Actions, and Edge Functions.

---

## Source Documents

Read all 16 files in `15-API/BOOK-16-API/` before writing any code. Every endpoint, request shape, response shape, error code, and validation rule is specified.

---

## Implementation Summary

Build a complete REST API under `/api/v1/` with the following characteristics:

- Next.js 15 Route Handlers for all endpoints
- Server Actions for form-driven mutations (auth login, uploads)
- Edge Functions (Deno) for payment verification, health checks, webhooks
- JWT authentication via Supabase Auth
- Zod validation on every endpoint
- Rate limiting (upstash/redis or in-memory sliding window)
- Cursor-based pagination on all list endpoints
- Audit logging for all admin mutations
- OpenAPI 3.1 contracts in `contracts/` directory
- Generated TypeScript types via `openapi-typescript`
- Interactive API docs via Scalar at `/api/docs`

---

## Route Handlers Pattern

```ts
// src/app/api/v1/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { getCursor, paginatedResponse } from '@/lib/api/pagination';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const cursor = searchParams.get('cursor');
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

    let query = supabase
      .from('card_orders')
      .select('*, card:card_products(name, slug, type, card_art_url)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit + 1);  // fetch one extra to detect has_more

    if (status) {
      const statuses = status.split(',');
      query = query.in('status', statuses);
    }

    if (cursor) {
      const { id, created_at } = JSON.parse(atob(cursor));
      query = query.lt('created_at', created_at)
        .or(`created_at.eq.${created_at},id.lt.${id}`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const nextCursor = items.length > 0
      ? btoa(JSON.stringify({ id: items[items.length - 1].id, created_at: items[items.length - 1].created_at }))
      : null;

    return success(paginatedResponse(items, nextCursor, hasMore, count));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) { /* create order */ }
```

---

## Utility Functions

```ts
// src/lib/api/response.ts
export function success(data: any, message?: string, status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function created(data: any, message?: string) {
  return success(data, message, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: ErrorDetail[]) {
  return NextResponse.json({ success: false, message, errors }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function validationError(errors: z.ZodError) {
  return NextResponse.json({
    success: false,
    message: 'Validation failed',
    errors: errors.issues.map(i => ({
      code: 'VAL_001',
      field: i.path.join('.'),
      message: i.message,
    })),
  }, { status: 422 });
}

export function rateLimited(retryAfter = 60) {
  return new NextResponse(
    JSON.stringify({ success: false, message: 'Rate limit exceeded' }),
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}

export function serverError(error: unknown) {
  console.error('[API Error]', error);
  return NextResponse.json({
    success: false,
    message: 'An unexpected error occurred',
    errors: [{ code: 'SERVER_001', message: 'Internal server error' }],
  }, { status: 500 });
}
```

---

## Authentication Middleware

```ts
// src/middleware.ts (Next.js Edge Middleware)
// Routes: /api/v1/auth/* — no auth check
// Routes: /api/v1/system/health, /api/v1/system/version — no auth check
// Routes: /api/v1/wallets/networks — no auth check
// Routes: /api/v1/cards — no auth check
// All other /api/v1/* — JWT required
// Routes: /api/v1/admin/* — JWT + admin role check

// src/lib/api/require-auth.ts
export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError('Unauthorized');
  return user;
}

export async function requireAdmin(supabase: SupabaseClient, allowedRoles?: AdminRole[]) {
  const user = await requireAuth(supabase);
  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (!role || (allowedRoles && !allowedRoles.includes(role.role))) {
    throw new AuthError('Forbidden');
  }
  return { user, role: role.role };
}
```

---

## Rate Limiting

```ts
// src/lib/api/rate-limit.ts
// In-memory sliding window (use Upstash Redis in production)
const rateMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateMap.get(key);
  if (!record || now > record.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   ├── forgot-password/route.ts
│   │   │   │   ├── verify-email/route.ts
│   │   │   │   └── session/route.ts
│   │   │   ├── users/
│   │   │   │   ├── me/route.ts
│   │   │   │   ├── preferences/route.ts
│   │   │   │   └── security/route.ts
│   │   │   ├── wallets/
│   │   │   │   ├── route.ts (GET)
│   │   │   │   ├── connect/route.ts
│   │   │   │   ├── [id]/route.ts (DELETE)
│   │   │   │   ├── default/route.ts (PATCH)
│   │   │   │   └── networks/route.ts
│   │   │   ├── cards/
│   │   │   │   ├── route.ts (GET)
│   │   │   │   ├── [slug]/route.ts (GET)
│   │   │   │   └── order/route.ts (POST)
│   │   │   ├── orders/
│   │   │   │   ├── route.ts (GET)
│   │   │   │   ├── [id]/route.ts (GET)
│   │   │   │   ├── [id]/cancel/route.ts (PATCH)
│   │   │   │   ├── [id]/invoice/route.ts (GET)
│   │   │   │   └── tracking/[number]/route.ts (GET)
│   │   │   ├── payments/
│   │   │   │   ├── create/route.ts
│   │   │   │   ├── verify/route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── history/route.ts
│   │   │   │   └── estimate-fees/route.ts
│   │   │   ├── transactions/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [hash]/route.ts
│   │   │   │   └── export/route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   ├── read/route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── preferences/route.ts
│   │   │   ├── support/
│   │   │   │   ├── tickets/route.ts
│   │   │   │   ├── tickets/[id]/route.ts
│   │   │   │   └── tickets/[id]/reply/route.ts
│   │   │   ├── upload/
│   │   │   │   ├── avatar/route.ts
│   │   │   │   ├── document/route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── generate-url/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/route.ts
│   │   │   │   ├── users/route.ts
│   │   │   │   ├── users/[id]/route.ts
│   │   │   │   ├── orders/route.ts
│   │   │   │   ├── orders/[id]/route.ts
│   │   │   │   ├── payments/route.ts
│   │   │   │   ├── payments/[id]/route.ts
│   │   │   │   ├── cards/route.ts
│   │   │   │   ├── cards/[id]/route.ts
│   │   │   │   ├── reports/route.ts
│   │   │   │   └── settings/route.ts
│   │   │   ├── analytics/
│   │   │   │   ├── dashboard/route.ts
│   │   │   │   ├── orders/route.ts
│   │   │   │   ├── payments/route.ts
│   │   │   │   ├── users/route.ts
│   │   │   │   └── export/route.ts
│   │   │   ├── system/
│   │   │   │   ├── health/route.ts
│   │   │   │   ├── version/route.ts
│   │   │   │   ├── status/route.ts
│   │   │   │   └── config/route.ts
│   │   │   └── webhooks/
│   │   │       ├── walletconnect/route.ts
│   │   │       ├── blockchain/route.ts
│   │   │       ├── email/route.ts
│   │   │       ├── storage/route.ts
│   │   │       └── shipping/route.ts
│   │   └── docs/route.ts (Scalar API reference)
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   ├── api/
│   │   ├── response.ts
│   │   ├── require-auth.ts
│   │   ├── rate-limit.ts
│   │   ├── pagination.ts
│   │   ├── validation.ts
│   │   └── audit.ts
│   └── zod/
│       └── schemas.ts (all Zod schemas)
├── types/
│   └── api.ts (generated via openapi-typescript)
├── contracts/
│   ├── openapi.bundled.yaml
│   ├── auth.openapi.yaml
│   ├── users.openapi.yaml
│   ├── wallets.openapi.yaml
│   ├── cards.openapi.yaml
│   ├── orders.openapi.yaml
│   ├── payments.openapi.yaml
│   ├── transactions.openapi.yaml
│   ├── notifications.openapi.yaml
│   ├── support.openapi.yaml
│   ├── uploads.openapi.yaml
│   ├── admin.openapi.yaml
│   ├── analytics.openapi.yaml
│   ├── system.openapi.yaml
│   └── webhooks.openapi.yaml
└── integrations/
    ├── alchemy.ts
    ├── resend.ts
    └── walletconnect.ts
```

---

## Supabase Edge Functions

```
supabase/functions/
├── verify-payment/index.ts     → Payment verification (Alchemy)
├── health-check/index.ts       → System health monitoring
├── webhook-blockchain/index.ts → Blockchain event handler
└── generate-report/index.ts    → Report generation (PDF, CSV, XLSX)
```

---

## Verification Checklist

### Before deployment
- [ ] All 65+ route handlers implemented
- [ ] Zod schemas on every endpoint
- [ ] JWT authentication on protected routes
- [ ] Admin RBAC on all `/api/v1/admin/*` endpoints
- [ ] Rate limiting on all endpoints
- [ ] Cursor-based pagination on all list endpoints
- [ ] Standard error format on all responses
- [ ] CORS headers on all responses
- [ ] CSP headers on all responses
- [ ] Audit logging on all admin mutations
- [ ] OpenAPI 3.1 contracts for all domains
- [ ] TypeScript types generated from contracts
- [ ] Interactive API docs at `/api/docs`
- [ ] Edge Functions deployed to Supabase
- [ ] Webhook signature verification on all webhooks
- [ ] Idempotency on payment creation
- [ ] Rate limiting differently per endpoint group (auth: 10/min, api: 60/min, admin: 120/min)
- [ ] Error codes catalog matches implementation (all 50+ codes)
- [ ] Every endpoint tested with Playwright integration tests
- [ ] CI pipeline runs contract validation (OpenAPI vs implementation)
