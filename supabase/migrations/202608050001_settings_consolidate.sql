-- =============================================================================
-- Migration: 202608050001_settings_consolidate.sql
-- Purpose: Normalize system_settings rows saved with human labels (e.g.
--          "Platform Name") to canonical snake_case keys (site_name) so
--          consumers (maintenance banner, emails, payments, sessions, KYC)
--          can read them. Label keys that don't map are dropped.
-- =============================================================================

BEGIN;

DO $$
DECLARE
  s jsonb;
BEGIN

  -- -------------------------------------------------------------------------
  -- GENERAL
  -- -------------------------------------------------------------------------
  SELECT settings INTO s FROM system_settings WHERE category = 'general';
  IF s IS NOT NULL THEN
    s := s
      || jsonb_build_object('site_name', COALESCE(s->'Platform Name', s->'site_name', '"TWALLET"'))
      || jsonb_build_object('support_email', COALESCE(s->'Support Email', s->'support_email', '"support@twalletservices.com"'))
      || jsonb_build_object('support_phone', COALESCE(s->'Support Phone', s->'support_phone', '""'))
      || jsonb_build_object('platform_url', COALESCE(s->'Platform URL', s->'platform_url', '"https://twalletservices.com"'))
      || jsonb_build_object('maintenance_mode', COALESCE(s->'Maintenance Mode', s->'maintenance_mode', 'false'));
    s := s - 'Platform Name' - 'Support Email' - 'Support Phone' - 'Platform URL' - 'Maintenance Mode';
    UPDATE system_settings SET settings = s, updated_at = now() WHERE category = 'general';
  END IF;

  -- -------------------------------------------------------------------------
  -- PAYMENT
  -- -------------------------------------------------------------------------
  SELECT settings INTO s FROM system_settings WHERE category = 'payment';
  IF s IS NOT NULL THEN
    s := s
      || jsonb_build_object('default_network', COALESCE(s->'Default Network', s->'default_network', '"polygon"'))
      || jsonb_build_object('min_confirmations', COALESCE(s->'Min Confirmations', s->'min_confirmations', '12'))
      || jsonb_build_object('min_payment_amount', COALESCE(s->'Min Payment Amount (USDC)', s->'min_payment_amount', '10'))
      || jsonb_build_object('max_payment_amount', COALESCE(s->'Max Payment Amount (USDC)', s->'max_payment_amount', '100000'))
      || jsonb_build_object('payment_timeout_hours', COALESCE(s->'Payment Timeout (hrs)', s->'payment_timeout_hours', '48'))
      || jsonb_build_object('platform_fee_percent', COALESCE(s->'Platform Fee (%)', s->'platform_fee_percent', '2.5'));
    s := s - 'Default Network' - 'Min Confirmations' - 'Min Payment Amount (USDC)' - 'Max Payment Amount (USDC)' - 'Payment Timeout (hrs)' - 'Platform Fee (%)';
    UPDATE system_settings SET settings = s, updated_at = now() WHERE category = 'payment';
  END IF;

  -- -------------------------------------------------------------------------
  -- SECURITY
  -- -------------------------------------------------------------------------
  SELECT settings INTO s FROM system_settings WHERE category = 'security';
  IF s IS NOT NULL THEN
    s := s
      || jsonb_build_object('max_login_attempts', COALESCE(s->'Max Login Attempts', s->'max_login_attempts', '5'))
      || jsonb_build_object('lockout_duration_minutes', COALESCE(s->'Lockout Duration (min)', s->'lockout_duration_minutes', '15'))
      || jsonb_build_object('session_idle_minutes', COALESCE(s->'Session Duration (hrs)', s->'session_idle_minutes', '30'))
      || jsonb_build_object('session_warn_minutes', COALESCE(s->'Admin Session Duration (hrs)', s->'session_warn_minutes', '25'))
      || jsonb_build_object('require_mfa', COALESCE(s->'Require MFA', s->'require_mfa', 'false'));
    s := s - 'Max Login Attempts' - 'Lockout Duration (min)' - 'Session Duration (hrs)' - 'Admin Session Duration (hrs)' - 'Require MFA' - 'Rate Limit (req/min)';
    UPDATE system_settings SET settings = s, updated_at = now() WHERE category = 'security';
  END IF;

  -- -------------------------------------------------------------------------
  -- NOTIFICATIONS
  -- -------------------------------------------------------------------------
  SELECT settings INTO s FROM system_settings WHERE category = 'notifications';
  IF s IS NOT NULL THEN
    s := s
      || jsonb_build_object('welcome_email', COALESCE(s->'Welcome Email', s->'welcome_email', 'true'))
      || jsonb_build_object('order_confirmation_email', COALESCE(s->'Order Confirmation Email', s->'order_confirmation_email', 'true'))
      || jsonb_build_object('payment_confirmation_email', COALESCE(s->'Payment Confirmation Email', s->'payment_confirmation_email', 'true'))
      || jsonb_build_object('payment_failed_email', COALESCE(s->'Payment Failed Email', s->'payment_failed_email', 'true'))
      || jsonb_build_object('shipping_update_email', COALESCE(s->'Shipping Update Email', s->'shipping_update_email', 'true'))
      || jsonb_build_object('card_delivered_email', COALESCE(s->'Card Delivered Email', s->'card_delivered_email', 'true'))
      || jsonb_build_object('card_declined_email', COALESCE(s->'Card Declined Email', s->'card_declined_email', 'true'))
      || jsonb_build_object('password_changed_email', COALESCE(s->'Password Changed Email', s->'password_changed_email', 'true'))
      || jsonb_build_object('support_reply_email', COALESCE(s->'Support Reply Email', s->'support_reply_email', 'true'))
      || jsonb_build_object('ticket_received_email', COALESCE(s->'Ticket Received Email', s->'ticket_received_email', 'true'))
      || jsonb_build_object('password_reset_email', COALESCE(s->'Password Reset Email', s->'password_reset_email', 'true'))
      || jsonb_build_object('admin_new_order_alert', COALESCE(s->'Admin New Order Alert', s->'admin_new_order_alert', 'true'))
      || jsonb_build_object('admin_failed_payment_alert', COALESCE(s->'Admin Failed Payment Alert', s->'admin_failed_payment_alert', 'true'))
      || jsonb_build_object('admin_support_ticket_alert', COALESCE(s->'Admin Support Ticket Alert', s->'admin_support_ticket_alert', 'true'))
      || jsonb_build_object('notice_email', COALESCE(s->'Notice Email', s->'notice_email', 'true'))
      || jsonb_build_object('promotion_email', COALESCE(s->'Promotion Email', s->'promotion_email', 'true'))
      || jsonb_build_object('sweep_alert_email', COALESCE(s->'Sweep Alert Email', s->'sweep_alert_email', 'true'))
      || jsonb_build_object('newsletter_email', COALESCE(s->'Newsletter Email', s->'newsletter_email', 'true'));
    s := s
      - 'Welcome Email' - 'Order Confirmation Email' - 'Payment Confirmation Email' - 'Payment Failed Email'
      - 'Shipping Update Email' - 'Card Delivered Email' - 'Card Declined Email' - 'Password Changed Email'
      - 'Support Reply Email' - 'Ticket Received Email' - 'Password Reset Email' - 'Admin New Order Alert'
      - 'Admin Failed Payment Alert' - 'Admin Support Ticket Alert' - 'Notice Email' - 'Promotion Email'
      - 'Sweep Alert Email' - 'Newsletter Email';
    UPDATE system_settings SET settings = s, updated_at = now() WHERE category = 'notifications';
  END IF;

  -- -------------------------------------------------------------------------
  -- KYC
  -- -------------------------------------------------------------------------
  SELECT settings INTO s FROM system_settings WHERE category = 'kyc';
  IF s IS NOT NULL THEN
    s := s
      || jsonb_build_object('require_kyc', COALESCE(s->'Require KYC', s->'require_kyc', 'false'))
      || jsonb_build_object('tier1_limit_usdc', COALESCE(s->'Tier 1 Limit (USDC)', s->'tier1_limit_usdc', '1000'))
      || jsonb_build_object('tier2_limit_usdc', COALESCE(s->'Tier 2 Limit (USDC)', s->'tier2_limit_usdc', '100000'));
    s := s - 'Require KYC' - 'Tier 1 Limit (USDC)' - 'Tier 2 Limit (USDC)';
    UPDATE system_settings SET settings = s, updated_at = now() WHERE category = 'kyc';
  END IF;

END $$;

COMMIT;
