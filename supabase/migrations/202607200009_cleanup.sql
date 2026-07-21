-- =============================================================================
-- Migration: 202607200009_cleanup.sql
-- Purpose: Scheduled cleanup jobs, pg_cron setup for expired data
-- Dependencies: 202607200004_functions.sql
-- Rollback: DROP EXTENSION IF EXISTS pg_cron;
-- Verification: SELECT * FROM cron.job;
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- Enable pg_cron for scheduled maintenance
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =============================================================================
-- Cleanup expired payment transactions (every hour)
-- =============================================================================
SELECT cron.schedule(
  'cleanup-expired-payments',
  '0 * * * *',
  $$SELECT cleanup_expired_records();$$
);

-- =============================================================================
-- Archive old orders (daily at midnight)
-- =============================================================================
CREATE OR REPLACE FUNCTION archive_delivered_orders()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE card_orders
  SET deleted_at = now()
  WHERE status IN ('delivered')
    AND updated_at < now() - interval '90 days'
    AND deleted_at IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

SELECT cron.schedule(
  'archive-delivered-orders',
  '0 0 * * *',
  $$SELECT archive_delivered_orders();$$
);

-- =============================================================================
-- Rotate stale support tickets (daily at 2am)
-- =============================================================================
CREATE OR REPLACE FUNCTION close_stale_tickets()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE support_tickets
  SET status = 'closed'
  WHERE status IN ('open', 'pending')
    AND updated_at < now() - interval '14 days'
    AND deleted_at IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

SELECT cron.schedule(
  'close-stale-tickets',
  '0 2 * * *',
  $$SELECT close_stale_tickets();$$
);

-- =============================================================================
-- Summarize daily stats (daily at 3am)
-- =============================================================================
CREATE OR REPLACE FUNCTION log_daily_stats()
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_stats RECORD;
BEGIN
  SELECT * INTO v_stats FROM get_order_stats();
  INSERT INTO audit_logs (admin_id, action, target_type, details)
  VALUES (
    NULL,
    'system_setting_changed',
    'daily_stats',
    jsonb_build_object(
      'total_orders', v_stats.total_orders,
      'total_revenue', v_stats.total_revenue,
      'pending_orders', v_stats.pending_orders,
      'flagged_orders', v_stats.flagged_orders,
      'date', CURRENT_DATE
    )
  );
END;
$$;

SELECT cron.schedule(
  'log-daily-stats',
  '0 3 * * *',
  $$SELECT log_daily_stats();$$
);

COMMIT;
