-- =============================================================================
-- Migration: 202607200005_triggers.sql
-- Purpose: Create all database triggers (6 total)
-- Dependencies: 202607200001_initial_schema.sql, 202607200004_functions.sql
-- Rollback: DROP TRIGGER IF EXISTS ... ;
-- Verification: INSERT/UPDATE triggers fire correctly
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. updated_at trigger (applied to all tables with updated_at column)
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to tables
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_admins
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_wallets
  BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_supported_wallet_addresses
  BEFORE UPDATE ON supported_wallet_addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_card_products
  BEFORE UPDATE ON card_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_card_orders
  BEFORE UPDATE ON card_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_payment_transactions
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_support_tickets
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_notifications
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_admin_notifications
  BEFORE UPDATE ON admin_notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_system_settings
  BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_user_preferences
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 2. New user → create profile + user_role
-- =============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 3. Payment confirmed → create transaction + update order + notify user
-- =============================================================================
CREATE OR REPLACE FUNCTION payment_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    -- Create payment transaction record
    INSERT INTO payment_transactions (order_id, user_id, amount, network_id, token_id, tx_hash, status, from_address, to_address, confirmed_at)
    VALUES (NEW.id, NEW.user_id, NEW.amount_usdc, ...);

    -- Update order status
    UPDATE card_orders
    SET status = 'paid',
        paid_at = now(),
        paid_usdc = NEW.amount_usdc,
        tx_hash = NEW.tx_hash
    WHERE id = NEW.id;

    -- Notify user
    PERFORM create_notification(
      NEW.user_id,
      'payment_confirmed',
      'Payment Confirmed',
      'Your payment for order ' || NEW.order_number || ' has been confirmed.',
      'order',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_payment_confirmed
  AFTER UPDATE ON card_orders
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND OLD.status = 'pending')
  EXECUTE FUNCTION payment_confirmed();

-- =============================================================================
-- 4. Order shipped → notify user
-- =============================================================================
CREATE OR REPLACE FUNCTION order_shipped()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.shipping_status = 'shipped' AND OLD.shipping_status = 'processing' THEN
    PERFORM create_notification(
      NEW.user_id,
      'shipping_update',
      'Order Shipped',
      'Your order ' || NEW.order_number || ' has been shipped. Tracking: ' || COALESCE(NEW.tracking_number, 'N/A'),
      'order',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_shipped
  AFTER UPDATE OF shipping_status ON card_orders
  FOR EACH ROW
  WHEN (NEW.shipping_status = 'shipped')
  EXECUTE FUNCTION order_shipped();

-- =============================================================================
-- 5. Audit log validation — prevent tampering
-- =============================================================================
CREATE OR REPLACE FUNCTION audit_log_validation()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.created_at != NEW.created_at) THEN
    RAISE EXCEPTION 'Audit logs are append-only. No updates or deletes allowed.'
      USING HINT = 'Insert new audit entries, never modify existing ones.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_audit_tampering
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION audit_log_validation();

-- =============================================================================
-- 6. Prevent removal of last super_admin
-- =============================================================================
CREATE OR REPLACE FUNCTION prevent_last_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
AS $$
BEGIN
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.role = 'super_admin' AND NEW.role != 'super_admin') THEN
    IF (SELECT COUNT(*) FROM admins WHERE role = 'super_admin') <= 1 THEN
      RAISE EXCEPTION 'Cannot remove the last super_admin.'
        USING HINT = 'Assign super_admin to another admin first.';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER prevent_last_super_admin
  BEFORE UPDATE OR DELETE ON admins
  FOR EACH ROW EXECUTE FUNCTION prevent_last_admin();

COMMIT;
