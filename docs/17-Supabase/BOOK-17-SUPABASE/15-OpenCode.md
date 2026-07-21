# OpenCode — Build Prompt

> Complete directive for implementing the TWallet Services Supabase backend.

---

## Source Documents

Read all 14 files in `17-Supabase/BOOK-17-SUPABASE/` before writing any code. Every configuration, policy, function, trigger, and migration strategy is specified.

---

## Implementation Summary

Configure and deploy the full Supabase backend for TWallet Services:

1. **Supabase Auth** — email/password, JWT sessions, secure cookies, middleware
2. **Database Schema** — 19 tables with RLS on every table (apply Book 08 DDL)
3. **RLS Policies** — per-table policies for user + admin access
4. **Storage Buckets** — 5 buckets with RLS policies and upload flows
5. **Realtime Subscriptions** — 7 channels for notifications, orders, support, admin
6. **Edge Functions** — verify-payment (viem + Alchemy), send-email (Resend), health-check
7. **Triggers** — 6 triggers (updated_at, new user, payment confirmed, order shipped, audit validation, prevent last admin delete)
8. **Database Functions** — RLS helpers (fn_is_admin, fn_is_super_admin), application functions (get_user_orders, get_dashboard_stats, get_revenue_report)
9. **Indexes** — 35+ indexes for query performance
10. **Migrations** — Named, timestamped, version-controlled SQL migration files
11. **Backups** — Daily Supabase managed + weekly external pg_dump + quarterly restore tests
12. **Environment** — All env vars configured in Vercel + Supabase secrets

---

## Step-by-Step Implementation

### Step 1: Supabase Project Setup

```bash
# Create project (or use existing)
supabase projects create twallet-services --org-id <org-id> --db-password <password>

# Link local project
supabase link --project-ref <ref>

# Start local development
supabase start
```

### Step 2: Apply Database Schema

Use Book 08 DDL to create all migrations:

```bash
# Create migrations from Book 08
supabase migration new create_tables
# Copy Book 08 DDL into the migration file
supabase migration new create_enums
# Copy enum definitions
supabase migration new add_rls_policies
# Copy RLS policies from 03-RLS.md
supabase migration new add_triggers
# Copy triggers from 07-Triggers.md
supabase migration new add_functions
# Copy functions from 08-Database-Functions.md
supabase migration new add_indexes
# Copy indexes from 09-Indexes.md
supabase migration new add_storage_buckets
# Copy storage policies from 04-Storage.md

# Apply all migrations
supabase migration up
```

### Step 3: Configure Auth

```bash
# Supabase Dashboard → Authentication → Settings
# Enable email confirmations
# Set min password length to 8
# Configure redirect URLs
```

### Step 4: Set Environment Variables

Create `.env.local` with Supabase anon key + URL, WalletConnect ID, Resend key, Alchemy key.

### Step 5: Create Supabase Client Files

Create the 3 client patterns from 01-Authentication.md:
- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/admin.ts`

### Step 6: Create Middleware

```ts
// src/middleware.ts
// Route protection for /app/* and /admin/*
// Redirect logic for auth pages
```

### Step 7: Deploy Edge Functions

```bash
cd supabase
supabase functions deploy verify-payment --no-verify-jwt
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy health-check --no-verify-jwt

# Verify
supabase functions list
```

### Step 8: Configure Storage Buckets

```bash
# Create buckets via Supabase dashboard or SQL
# Apply storage RLS policies from 04-Storage.md
```

### Step 9: Enable Realtime

```bash
# Supabase Dashboard → Database → Replication
# Enable replication on tables:
# - notifications, card_orders, payment_transactions
# - ticket_messages, support_tickets
# - admin_notifications, audit_logs
```

### Step 10: Verify

```bash
# Run security advisors
supabase db diff --linked
# Check RLS policies
# Verify auth flow
# Test Edge Functions
# Verify Realtime subscriptions
```

---

## Key Code Patterns

### Supabase Server Client
```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } }
  );
}
```

### RLS Policy Pattern
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all" ON table_name
  FOR SELECT USING (fn_is_admin());
```

### Edge Function Pattern
```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SERVICE_ROLE_KEY")!);
  // ... business logic
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});
```

### Trigger Pattern
```sql
CREATE OR REPLACE FUNCTION fn_on_event()
RETURNS TRIGGER AS $$ BEGIN ... RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_event AFTER INSERT ON table FOR EACH ROW EXECUTE FUNCTION fn_on_event();
```

---

## Verification Checklist

### Before deployment
- [ ] Supabase project created and linked
- [ ] All 19 tables created via migrations
- [ ] All 11 enums created
- [ ] RLS enabled on every table
- [ ] RLS policies written for user + admin access
- [ ] `fn_is_admin()` and `fn_is_super_admin()` helper functions created
- [ ] `trg_handle_new_user` trigger active (profile auto-creation)
- [ ] `trg_set_updated_at` on all tables
- [ ] `trg_payment_confirmed` and `trg_order_shipped` triggers active
- [ ] 35+ indexes created
- [ ] 5 Storage buckets created with RLS policies
- [ ] Realtime enabled on notification/order/ticket tables
- [ ] 3 Edge Functions deployed
- [ ] Edge Function secrets set
- [ ] Environment variables configured in Vercel + Supabase
- [ ] Auth settings configured (email confirmations, passwords)
- [ ] Redirect URLs configured in Supabase Auth
- [ ] Migrations committed to git
- [ ] TypeScript types generated and committed
- [ ] Security advisors pass (no findings)
- [ ] Backup strategy configured (Supabase managed + external)
- [ ] Vercel project linked and deployed
