-- =============================================================================
-- Migration: 202607200004_functions.sql
-- Purpose: Create all database functions (10 total)
-- Dependencies: 202607200001_initial_schema.sql
-- Rollback: DROP FUNCTION IF EXISTS ...
-- Verification: SELECT each function with test inputs
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. generate_order_number()
-- Format: ORD-YYYYMMDD-XXXXX (sequential per day)
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  date_part TEXT;
  seq_num INTEGER;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM card_orders
  WHERE order_number LIKE 'ORD-' || date_part || '-%';
  RETURN 'ORD-' || date_part || '-' || LPAD(seq_num::TEXT, 5, '0');
END;
$$;

-- =============================================================================
-- 2. generate_ticket_number()
-- Format: TKT-YYYYMMDD-XXXXX
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  date_part TEXT;
  seq_num INTEGER;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(MAX(CAST(SPLIT_PART(ticket_number, '-', 3) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM support_tickets
  WHERE ticket_number LIKE 'TKT-' || date_part || '-%';
  RETURN 'TKT-' || date_part || '-' || LPAD(seq_num::TEXT, 5, '0');
END;
$$;

-- =============================================================================
-- 3. create_notification()
-- =============================================================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_related_type, p_related_id)
  RETURNING id INTO v_notification_id;
  RETURN v_notification_id;
END;
$$;

-- =============================================================================
-- 4. create_admin_notification()
-- =============================================================================
CREATE OR REPLACE FUNCTION create_admin_notification(
  p_admin_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO admin_notifications (admin_id, type, title, message, related_type, related_id)
  VALUES (p_admin_id, p_type, p_title, p_message, p_related_type, p_related_id)
  RETURNING id INTO v_notification_id;
  RETURN v_notification_id;
END;
$$;

-- =============================================================================
-- 5. log_audit_event()
-- =============================================================================
CREATE OR REPLACE FUNCTION log_audit_event(
  p_admin_id UUID,
  p_action audit_action,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_ip_address TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_logs (admin_id, action, target_type, target_id, details, ip_address)
  VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_details, p_ip_address)
  RETURNING id INTO v_audit_id;
  RETURN v_audit_id;
END;
$$;

-- =============================================================================
-- 6. calculate_order_total()
-- Returns base price + annual fee proration
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_order_total(p_product_id UUID)
RETURNS NUMERIC(20, 2)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_price NUMERIC(20, 2);
  v_annual_fee NUMERIC(20, 2);
BEGIN
  SELECT price_usdc, annual_fee_usdc
  INTO v_price, v_annual_fee
  FROM card_products
  WHERE id = p_product_id;
  RETURN v_price + v_annual_fee;
END;
$$;

-- =============================================================================
-- 7. verify_transaction_sender()
-- Checks whether a from_address owns a wallet in our wallets table
-- =============================================================================
CREATE OR REPLACE FUNCTION verify_transaction_sender(
  p_from_address TEXT,
  p_network_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM wallets
    WHERE address ILIKE p_from_address
    AND network_id::TEXT = p_network_id
    AND deleted_at IS NULL
  );
END;
$$;

-- =============================================================================
-- 8. get_order_stats()
-- Summary statistics for admin dashboard
-- =============================================================================
CREATE OR REPLACE FUNCTION get_order_stats()
RETURNS TABLE (
  total_orders BIGINT,
  total_paid BIGINT,
  total_revenue NUMERIC(20, 2),
  pending_orders BIGINT,
  flagged_orders BIGINT,
  avg_order_value NUMERIC(20, 2)
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COUNT(*) FILTER (WHERE status IN ('paid', 'processing', 'shipped', 'delivered'))::BIGINT,
    COALESCE(SUM(paid_usdc) FILTER (WHERE status IN ('paid', 'processing', 'shipped', 'delivered')), 0),
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT,
    COUNT(*) FILTER (WHERE flagged = true)::BIGINT,
    COALESCE(AVG(amount_usdc) FILTER (WHERE status IN ('paid', 'processing', 'shipped', 'delivered')), 0)
  FROM card_orders
  WHERE deleted_at IS NULL;
END;
$$;

-- =============================================================================
-- 9. get_daily_revenue(date_range)
-- =============================================================================
CREATE OR REPLACE FUNCTION get_daily_revenue(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  revenue NUMERIC(20, 2),
  order_count BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    paid_at::DATE,
    SUM(paid_usdc)::NUMERIC(20, 2),
    COUNT(*)::BIGINT
  FROM card_orders
  WHERE paid_at IS NOT NULL
    AND paid_at >= now() - (p_days || ' days')::INTERVAL
    AND deleted_at IS NULL
  GROUP BY paid_at::DATE
  ORDER BY paid_at::DATE;
END;
$$;

-- =============================================================================
-- 10. cleanup_expired_records()
-- Called by pg_cron to clean up stale data
-- =============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_records()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_deleted INTEGER := 0;
BEGIN
  DELETE FROM payment_transactions
  WHERE status = 'pending'
    AND expires_at < now()
    AND deleted_at IS NULL;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  UPDATE notifications
  SET deleted_at = now()
  WHERE created_at < now() - interval '90 days'
    AND deleted_at IS NULL;

  DELETE FROM audit_logs
  WHERE created_at < now() - interval '365 days';

  UPDATE support_tickets
  SET status = 'closed'
  WHERE status IN ('open', 'pending')
    AND updated_at < now() - interval '30 days';

  RETURN v_deleted;
END;
$$;

COMMIT;
