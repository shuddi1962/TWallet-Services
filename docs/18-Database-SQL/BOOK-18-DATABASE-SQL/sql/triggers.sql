-- =============================================================================
-- TWallet Services — Triggers
-- Version: 1.0.0
-- Description: All database triggers for automated workflows.
-- Run order: 4th (after schema.sql, policies.sql, indexes.sql)
-- =============================================================================

-- =============================================================================
-- TRIGGER FUNCTION: fn_set_updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_admins BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_wallets BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_card_products BEFORE UPDATE ON card_products FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_card_orders BEFORE UPDATE ON card_orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_payments BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_support_tickets BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_notifications BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_admin_notifications BEFORE UPDATE ON admin_notifications FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_system_settings BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_user_preferences BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_wallet_addresses BEFORE UPDATE ON supported_wallet_addresses FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================================
-- TRIGGER FUNCTION: fn_handle_new_user
-- Creates profile + default preferences + user role on signup
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, country)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'country', 'US'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.user_preferences (user_id, preferences)
  VALUES (NEW.id, '{"language":"en","currency":"USD","theme":"light","notifications":{"email_order_confirmed":true,"email_payment_received":true,"email_shipping_update":true,"push_order_status":true,"push_promotions":false}}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION fn_handle_new_user();

-- =============================================================================
-- TRIGGER FUNCTION: fn_on_payment_confirmed
-- Updates order status, creates notification + admin alert
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_on_payment_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.card_orders SET status = 'paid', paid_at = now(), tx_hash = NEW.tx_hash, updated_at = now() WHERE id = NEW.order_id;
    INSERT INTO public.notifications (user_id, type, title, message, related_type, related_id)
    VALUES (NEW.user_id, 'payment_confirmed', 'Payment Confirmed', 'Your payment of ' || NEW.amount || ' USDC has been confirmed.', 'order', NEW.order_id);
    INSERT INTO public.admin_notifications (admin_id, type, title, message, related_type, related_id)
    SELECT id, 'new_payment', 'Payment Confirmed', 'Payment of ' || NEW.amount || ' USDC confirmed for order.', 'payment', NEW.id
    FROM public.admins WHERE role IN ('super_admin', 'finance');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_payment_confirmed ON payment_transactions;
CREATE TRIGGER trg_payment_confirmed AFTER UPDATE OF status ON public.payment_transactions
  FOR EACH ROW WHEN (NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed'))
  EXECUTE FUNCTION fn_on_payment_confirmed();

-- =============================================================================
-- TRIGGER FUNCTION: fn_on_order_shipped
-- Notifies customer when order ships
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_on_order_shipped()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'shipped' AND (OLD.status IS NULL OR OLD.status != 'shipped') THEN
    INSERT INTO public.notifications (user_id, type, title, message, related_type, related_id)
    VALUES (NEW.user_id, 'shipping_update', 'Order Shipped', 'Your order ' || NEW.order_number || ' has been shipped! Tracking: ' || COALESCE(NEW.tracking_number, 'N/A'), 'order', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_order_shipped ON card_orders;
CREATE TRIGGER trg_order_shipped AFTER UPDATE OF status ON public.card_orders
  FOR EACH ROW WHEN (NEW.status = 'shipped' AND (OLD.status IS NULL OR OLD.status != 'shipped'))
  EXECUTE FUNCTION fn_on_order_shipped();
