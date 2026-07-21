-- =============================================================================
-- Migration: 202607200002_rls.sql
-- Purpose: Enable RLS + define policies on all tables (19 tables)
-- Dependencies: 202607200001_initial_schema.sql
-- Rollback: DROP POLICY ... ON ... ;
-- Verification: Security advisor should pass cleanly
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- HELPER: is_admin()
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins a WHERE a.profile_id = user_id
  );
$$;

-- =============================================================================
-- HELPER: current_user_is_admin()
-- =============================================================================
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT public.is_admin(auth.uid());
$$;

-- =============================================================================
-- HELPER: current_user_role()
-- =============================================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS admin_role
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT COALESCE(
    (SELECT a.role FROM admins a WHERE a.profile_id = auth.uid()),
    'viewer'::admin_role
  );
$$;

-- =============================================================================
-- 1. PROFILES
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (current_user_is_admin());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (current_user_is_admin());

-- =============================================================================
-- 2. USER ROLES
-- =============================================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 3. ADMINS
-- =============================================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admins"
  ON admins FOR SELECT
  USING (current_user_is_admin());

CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

-- =============================================================================
-- 4. WALLETS
-- =============================================================================
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallets"
  ON wallets FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Users can insert own wallets"
  ON wallets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own wallets"
  ON wallets FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own wallets"
  ON wallets FOR DELETE
  USING (user_id = auth.uid());

-- =============================================================================
-- 5. SUPPORTED NETWORKS
-- =============================================================================
ALTER TABLE supported_networks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Networks are publicly readable"
  ON supported_networks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage networks"
  ON supported_networks FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 6. SUPPORTED TOKENS
-- =============================================================================
ALTER TABLE supported_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tokens are publicly readable"
  ON supported_tokens FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tokens"
  ON supported_tokens FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 7. SUPPORTED WALLET ADDRESSES
-- =============================================================================
ALTER TABLE supported_wallet_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Addresses are publicly readable"
  ON supported_wallet_addresses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage wallet addresses"
  ON supported_wallet_addresses FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 8. CARD PRODUCTS
-- =============================================================================
ALTER TABLE card_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active card products are publicly readable"
  ON card_products FOR SELECT
  USING (active = true OR current_user_is_admin());

CREATE POLICY "Admins can manage card products"
  ON card_products FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 9. CARD ORDERS
-- =============================================================================
ALTER TABLE card_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON card_orders FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Users can create own orders"
  ON card_orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update orders"
  ON card_orders FOR UPDATE
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

CREATE POLICY "Admins can delete orders"
  ON card_orders FOR DELETE
  USING (current_user_is_admin());

-- =============================================================================
-- 10. SHIPPING ADDRESSES
-- =============================================================================
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipping addresses"
  ON shipping_addresses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM card_orders co WHERE co.id = order_id AND co.user_id = auth.uid())
    OR current_user_is_admin()
  );

CREATE POLICY "Users can create shipping addresses for own orders"
  ON shipping_addresses FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM card_orders co WHERE co.id = order_id AND co.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage shipping addresses"
  ON shipping_addresses FOR ALL
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 11. PAYMENT TRANSACTIONS
-- =============================================================================
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Users can create payment transactions for own orders"
  ON payment_transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update payment transactions"
  ON payment_transactions FOR UPDATE
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 12. SUPPORT TICKETS
-- =============================================================================
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 13. TICKET MESSAGES
-- =============================================================================
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for own tickets"
  ON ticket_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = ticket_id AND (st.user_id = auth.uid() OR current_user_is_admin()))
    AND (internal = false OR current_user_is_admin())
  );

CREATE POLICY "Users can add messages to own tickets"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = ticket_id AND (st.user_id = auth.uid()))
    AND author = 'customer'
  );

CREATE POLICY "Admins can add messages to any ticket"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    current_user_is_admin()
    AND author = 'admin'
  );

-- =============================================================================
-- 14. TICKET ATTACHMENTS
-- =============================================================================
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments for own tickets"
  ON ticket_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ticket_messages tm
      JOIN support_tickets st ON st.id = tm.ticket_id
      WHERE tm.id = message_id AND (st.user_id = auth.uid() OR current_user_is_admin())
    )
  );

CREATE POLICY "Users can attach files to own tickets"
  ON ticket_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ticket_messages tm
      JOIN support_tickets st ON st.id = tm.ticket_id
      WHERE tm.id = message_id AND st.user_id = auth.uid()
    )
  );

-- =============================================================================
-- 15. NOTIFICATIONS
-- =============================================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark own notifications as read"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);  -- Edge Functions with service_role

-- =============================================================================
-- 16. ADMIN NOTIFICATIONS
-- =============================================================================
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own admin notifications"
  ON admin_notifications FOR SELECT
  USING (admin_id = (SELECT id FROM admins WHERE profile_id = auth.uid()));

CREATE POLICY "Admins can update own notifications"
  ON admin_notifications FOR UPDATE
  USING (admin_id = (SELECT id FROM admins WHERE profile_id = auth.uid()))
  WITH CHECK (admin_id = (SELECT id FROM admins WHERE profile_id = auth.uid()));

CREATE POLICY "System can insert admin notifications"
  ON admin_notifications FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- 17. AUDIT LOGS (append-only — no update/delete)
-- =============================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (current_user_is_admin());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- 18. SYSTEM SETTINGS
-- =============================================================================
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are publicly readable"
  ON system_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON system_settings FOR UPDATE
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

CREATE POLICY "Admins can insert settings"
  ON system_settings FOR INSERT
  WITH CHECK (current_user_is_admin());

-- =============================================================================
-- 19. USER PREFERENCES
-- =============================================================================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

COMMIT;
