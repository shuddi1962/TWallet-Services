-- =============================================================================
-- TWallet Services — Database Functions
-- Version: 1.0.0
-- Description: All database functions used by RLS, triggers, and application.
-- Run order: 5th (after schema.sql, policies.sql, indexes.sql, triggers.sql)
-- =============================================================================

-- RLS helper: check if user is any admin
CREATE OR REPLACE FUNCTION fn_is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid());
$$;

-- RLS helper: check if user is super admin
CREATE OR REPLACE FUNCTION fn_is_super_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid() AND role = 'super_admin');
$$;

-- RLS helper: get current admin role
CREATE OR REPLACE FUNCTION fn_admin_role()
RETURNS admin_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM admins WHERE profile_id = auth.uid();
$$;

-- =============================================================================
-- Application Functions
-- =============================================================================

-- Get order summary for a user
CREATE OR REPLACE FUNCTION fn_get_user_orders(p_user_id UUID)
RETURNS TABLE (total_orders BIGINT, pending_orders BIGINT, completed_orders BIGINT, total_spent NUMERIC)
LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*)::BIGINT,
    COUNT(*) FILTER (WHERE status IN ('pending', 'paid'))::BIGINT,
    COUNT(*) FILTER (WHERE status IN ('delivered', 'completed'))::BIGINT,
    COALESCE(SUM(paid_usdc), 0)
  FROM card_orders WHERE user_id = p_user_id AND deleted_at IS NULL;
$$;

-- Admin dashboard stats
CREATE OR REPLACE FUNCTION fn_get_dashboard_stats()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER AS $$
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

-- Revenue report (grouped by day/week/month)
CREATE OR REPLACE FUNCTION fn_get_revenue_report(p_date_from TIMESTAMPTZ, p_date_to TIMESTAMPTZ, p_group_by TEXT DEFAULT 'day')
RETURNS TABLE (period TEXT, revenue NUMERIC, transaction_count BIGINT, avg_transaction NUMERIC)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT to_char(created_at, %L) AS period,
            COALESCE(SUM(amount), 0) AS revenue,
            COUNT(*)::BIGINT AS transaction_count,
            COALESCE(AVG(amount), 0) AS avg_transaction
     FROM payment_transactions
     WHERE status = ''confirmed'' AND created_at >= $1 AND created_at <= $2
     GROUP BY 1 ORDER BY 1',
    CASE p_group_by WHEN 'day' THEN 'YYYY-MM-DD' WHEN 'week' THEN 'YYYY-IW' WHEN 'month' THEN 'YYYY-MM' END
  ) USING p_date_from, p_date_to;
END;
$$;

-- Create notification helper
CREATE OR REPLACE FUNCTION fn_create_notification(p_user_id UUID, p_type notification_type, p_title TEXT, p_message TEXT, p_related_type TEXT DEFAULT NULL, p_related_id UUID DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_related_type, p_related_id)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Generate next order number
CREATE OR REPLACE FUNCTION fn_next_order_number()
RETURNS TEXT LANGUAGE sql AS $$
  SELECT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
$$;

-- Generate next ticket number
CREATE OR REPLACE FUNCTION fn_next_ticket_number()
RETURNS TEXT LANGUAGE sql AS $$
  SELECT 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
$$;
