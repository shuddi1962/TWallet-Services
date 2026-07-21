# Database Functions

> PostgreSQL functions used by RLS policies, triggers, and application logic.

---

## Function Inventory

| Function | Purpose | Called By |
|----------|---------|-----------|
| `fn_set_updated_at()` | Auto-update timestamps | Triggers (all tables) |
| `fn_handle_new_user()` | Create profile on signup | Trigger (auth.users) |
| `fn_on_payment_confirmed()` | Update order + notify | Trigger (payment_transactions) |
| `fn_on_order_shipped()` | Notify customer | Trigger (card_orders) |
| `fn_is_admin()` | RLS helper | RLS policies |
| `fn_is_super_admin()` | RLS helper | RLS policies |
| `fn_get_user_orders()` | User's order summary | Application (via RPC) |
| `fn_get_dashboard_stats()` | Admin dashboard stats | Admin API |
| `fn_get_revenue_report()` | Revenue aggregation | Reports API |

---

## RLS Helper Functions

```sql
-- Check if current user is an admin
CREATE OR REPLACE FUNCTION fn_is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE profile_id = auth.uid()
  );
$$;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION fn_is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE profile_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Check admin role
CREATE OR REPLACE FUNCTION fn_admin_role()
RETURNS admin_role
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM admins WHERE profile_id = auth.uid();
$$;
```

---

## Application Functions

### Get User Orders Summary

```sql
CREATE OR REPLACE FUNCTION fn_get_user_orders(p_user_id UUID)
RETURNS TABLE (
  total_orders BIGINT,
  pending_orders BIGINT,
  completed_orders BIGINT,
  total_spent NUMERIC
)
LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*)::BIGINT AS total_orders,
    COUNT(*) FILTER (WHERE status IN ('pending', 'paid'))::BIGINT AS pending_orders,
    COUNT(*) FILTER (WHERE status IN ('delivered', 'completed'))::BIGINT AS completed_orders,
    COALESCE(SUM(paid_usdc), 0) AS total_spent
  FROM card_orders
  WHERE user_id = p_user_id AND deleted_at IS NULL;
$$;
```

### Get Dashboard Stats (Admin)

```sql
CREATE OR REPLACE FUNCTION fn_get_dashboard_stats()
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles WHERE deleted_at IS NULL),
    'active_wallets', (SELECT COUNT(*) FROM wallets WHERE deleted_at IS NULL),
    'pending_orders', (SELECT COUNT(*) FROM card_orders WHERE status = 'pending'),
    'completed_orders', (SELECT COUNT(*) FROM card_orders WHERE status IN ('delivered', 'completed')),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM payment_transactions WHERE status = 'confirmed'),
    'open_tickets', (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'pending')),
    'today_transactions', (SELECT COUNT(*) FROM payment_transactions WHERE created_at >= CURRENT_DATE)
  );
$$;
```

### Get Revenue Report

```sql
CREATE OR REPLACE FUNCTION fn_get_revenue_report(
  p_date_from TIMESTAMPTZ,
  p_date_to TIMESTAMPTZ,
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  period TEXT,
  revenue NUMERIC,
  transaction_count BIGINT,
  avg_transaction NUMERIC
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT
      to_char(created_at, %L) AS period,
      COALESCE(SUM(amount), 0) AS revenue,
      COUNT(*)::BIGINT AS transaction_count,
      COALESCE(AVG(amount), 0) AS avg_transaction
    FROM payment_transactions
    WHERE status = ''confirmed''
      AND created_at >= $1
      AND created_at <= $2
    GROUP BY 1
    ORDER BY 1',
    CASE p_group_by
      WHEN 'day' THEN 'YYYY-MM-DD'
      WHEN 'week' THEN 'YYYY-IW'
      WHEN 'month' THEN 'YYYY-MM'
    END
  ) USING p_date_from, p_date_to;
END;
$$;
```

---

## Calling Functions from Application Code

```ts
// Via supabase.rpc()
const { data: stats } = await supabase.rpc('fn_get_user_orders', {
  p_user_id: userId,
});

const { data: revenue } = await supabase.rpc('fn_get_revenue_report', {
  p_date_from: '2026-06-01',
  p_date_to: '2026-07-01',
  p_group_by: 'week',
});

// RLS helper functions used automatically in policies
// No direct call needed — Supabase evaluates auth.uid() in policies
```

---

## Function Naming Convention

| Prefix | Purpose |
|--------|---------|
| `fn_` | Database functions |
| `trg_` | Trigger functions |

All functions are named `fn_<purpose>()` for consistency.
