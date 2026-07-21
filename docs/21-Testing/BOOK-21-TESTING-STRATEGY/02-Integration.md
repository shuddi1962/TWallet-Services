# Integration Tests

> **Framework:** Vitest + Supabase local | **Location:** `tests/integration/`

## What to Test

- API Route Handlers (all endpoints)
- Supabase queries (RLS enforcement)
- Edge Functions (verify-payment, send-email)
- RLS policies (user isolation, admin access)
- Server Actions (auth, orders, profiles)

## API Route Test Pattern

```ts
import { describe, it, expect, beforeAll } from 'vitest';

describe('GET /api/v1/orders', () => {
  it('returns 401 without auth', async () => {
    const res = await fetch('http://localhost:3000/api/v1/orders');
    expect(res.status).toBe(401);
  });

  it('returns user orders when authenticated', async () => {
    const res = await fetch('http://localhost:3000/api/v1/orders', {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
```

## RLS Test Pattern

```ts
it('user cannot read another user profile', async () => {
  const { data } = await supabaseClientA
    .from('profiles')
    .select('*');
  expect(data?.every(p => p.id === userA.id)).toBe(true);
});

it('admin can read all profiles', async () => {
  const { data } = await supabaseAdminClient
    .from('profiles')
    .select('*');
  expect(data?.length).toBeGreaterThan(1);
});
```
