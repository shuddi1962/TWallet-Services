# Row Level Security (RLS)

> RLS is **enabled on every table** — no exceptions. Every query from the client (browser) goes through RLS policies. Service role bypasses RLS for admin operations.

---

## RLS Strategy

| Access Pattern | Client / User | Admin (Service Role) |
|----------------|---------------|---------------------|
| Browser (anon key) | RLS enforced | RLS bypassed |
| Server Component (anon key) | RLS enforced | RLS bypassed |
| Server Action (anon key) | RLS enforced | RLS bypassed |
| Edge Function (service key) | — | RLS bypassed |
| Admin Client (service key) | — | RLS bypassed |

---

## Per-Table Policies

### profiles

| Policy | Type | SQL |
|--------|------|-----|
| Users read own profile | SELECT | `USING (auth.uid() = id)` |
| Users update own profile | UPDATE | `USING (auth.uid() = id) WITH CHECK (auth.uid() = id)` |
| Admins read all profiles | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins update profiles | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Insert (trigger only) | INSERT | `WITH CHECK (auth.uid() = id)` |

### wallets

| Policy | Type | SQL |
|--------|------|-----|
| Users read own wallets | SELECT | `USING (auth.uid() = user_id AND deleted_at IS NULL)` |
| Users insert own wallet | INSERT | `WITH CHECK (auth.uid() = user_id)` |
| Users delete own wallet | DELETE | `USING (auth.uid() = user_id)` |
| Admins read all | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins manage all | ALL | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |

### card_orders

| Policy | Type | SQL |
|--------|------|-----|
| Users read own orders | SELECT | `USING (auth.uid() = user_id AND deleted_at IS NULL)` |
| Users create order | INSERT | `WITH CHECK (auth.uid() = user_id)` |
| Users update own (cancel) | UPDATE | `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND NEW.status IN ('cancelled'))` |
| Admins read all | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins update all | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins delete (soft) | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |

### payment_transactions

| Policy | Type | SQL |
|--------|------|-----|
| Users read own payments | SELECT | `USING (auth.uid() = user_id AND deleted_at IS NULL)` |
| Users create payment | INSERT | `WITH CHECK (auth.uid() = user_id)` |
| Admins read all | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins update (verify, flag) | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |

### support_tickets

| Policy | Type | SQL |
|--------|------|-----|
| Users read own tickets | SELECT | `USING (auth.uid() = user_id AND deleted_at IS NULL)` |
| Users create ticket | INSERT | `WITH CHECK (auth.uid() = user_id)` |
| Users update own (close) | UPDATE | `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND NEW.status IN ('closed'))` |
| Admins read all | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Admins manage all | ALL | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |

### ticket_messages

| Policy | Type | SQL |
|--------|------|-----|
| Users read own ticket messages | SELECT | `USING (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()))` |
| Users insert own reply | INSERT | `WITH CHECK (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()))` |
| Admins CRUD | ALL | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |

### notifications

| Policy | Type | SQL |
|--------|------|-----|
| Users read own notifications | SELECT | `USING (auth.uid() = user_id)` |
| Users mark read | UPDATE | `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)` |
| Users delete own | DELETE | `USING (auth.uid() = user_id)` |

### admin_notifications

| Policy | Type | SQL |
|--------|------|-----|
| Admins read own | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE id = admin_id AND profile_id = auth.uid()))` |
| Admins mark read | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE id = admin_id AND profile_id = auth.uid()))` |

### audit_logs

| Policy | Type | SQL |
|--------|------|-----|
| No public read | — | No SELECT policy for non-admins |
| Admins read | SELECT | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid()))` |
| Immutable | — | No UPDATE or DELETE policies |
| Insert (service only) | INSERT | `WITH CHECK (true)` — only callable with service role |

### system_settings

| Policy | Type | SQL |
|--------|------|-----|
| Public read safe settings | SELECT | `USING (true)` (limited to non-sensitive rows) |
| Update (Super Admin only) | UPDATE | `USING (EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid() AND role = 'super_admin'))` |

---

## RLS Helper Functions

```sql
-- Check if current user is an admin
CREATE OR REPLACE FUNCTION fn_is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE profile_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION fn_is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE profile_id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

---

## RLS Policy Template

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- User reads own
CREATE POLICY "Users read own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Admin reads all
CREATE POLICY "Admins read all" ON table_name
  FOR SELECT USING (fn_is_admin());

-- Admin full access
CREATE POLICY "Admins full access" ON table_name
  FOR ALL USING (fn_is_admin());
```

---

## Testing RLS

```sql
-- Test as anonymous user
SET ROLE anon;
SELECT * FROM profiles;  -- Should return nothing (not authenticated)
RESET ROLE;

-- Test as authenticated user (simulate)
SELECT * FROM profiles WHERE id = auth.uid();  -- Should return own profile
SELECT * FROM profiles;  -- Should return only own profile (if policy allows)
```
