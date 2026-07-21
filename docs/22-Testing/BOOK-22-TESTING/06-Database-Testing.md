# Database Testing

## What to Test

| Area | Test | Priority |
|------|------|----------|
| RLS policies | Each policy tested with authenticated/unauthenticated/wrong-role | Critical |
| Indexes | Query performance with EXPLAIN ANALYZE | High |
| Triggers | `handle_new_user`, `payment_confirmed`, `order_shipped` | Critical |
| Functions | `generate_order_number`, `create_notification`, `calculate_order_total` | High |
| Migrations | Apply forward → verify → rollback → verify | Critical |
| Data integrity | FK constraints, UNIQUE constraints, CHECK constraints | High |
| Performance | Query plans, index usage, sequential scans | Medium |

## RLS Test Pattern

```ts
import { describe, it, expect } from "vitest"
import { createClient } from "@supabase/supabase-js"

describe("profiles RLS", () => {
  it("user can view own profile", async () => {
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    })
    const { data } = await supabase.from("profiles").select("*").eq("id", userId)
    expect(data).toHaveLength(1)
  })

  it("user cannot view another user's profile", async () => {
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    })
    const { data } = await supabase.from("profiles").select("*").neq("id", userId)
    expect(data).toHaveLength(0)
  })

  it("admin can view all profiles", async () => {
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${adminToken}` } },
    })
    const { data } = await supabase.from("profiles").select("*", { count: "exact" })
    expect(data!.length).toBeGreaterThan(1)
  })
})
```

## Testing Tools

| Tool | Purpose |
|------|---------|
| Supabase local DB | Full PostgreSQL 16 for testing |
| `supabase db diff` | Compare schema before/after migration |
| EXPLAIN ANALYZE | Query performance verification |
| Custom test scripts | RLS enforcement, trigger behavior, function output |
