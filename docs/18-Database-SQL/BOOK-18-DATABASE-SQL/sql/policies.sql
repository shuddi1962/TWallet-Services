-- =============================================================================
-- TWallet Services — RLS Policies
-- Version: 1.0.0
-- Description: All Row Level Security policies for every table.
-- Run order: 2nd (after schema.sql)
-- =============================================================================

-- Helper functions used by policies
CREATE OR REPLACE FUNCTION fn_is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION fn_is_super_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE profile_id = auth.uid() AND role = 'super_admin');
$$;

-- =============================================================================
-- PROFILES
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT USING (fn_is_admin());
CREATE POLICY "Admins update profiles" ON profiles FOR UPDATE USING (fn_is_admin());
CREATE POLICY "Insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================================================
-- USER ROLES
-- =============================================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON user_roles FOR SELECT USING (fn_is_admin());
CREATE POLICY "Admins manage roles" ON user_roles FOR ALL USING (fn_is_super_admin());

-- =============================================================================
-- ADMINS
-- =============================================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read own" ON admins FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Admins read all" ON admins FOR SELECT USING (fn_is_admin());
CREATE POLICY "Super admin manage" ON admins FOR ALL USING (fn_is_super_admin());

-- =============================================================================
-- WALLETS
-- =============================================================================
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users insert wallet" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own wallet" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own wallet" ON wallets FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage wallets" ON wallets FOR ALL USING (fn_is_admin());

-- =============================================================================
-- SUPPORTED NETWORKS
-- =============================================================================
ALTER TABLE supported_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read networks" ON supported_networks FOR SELECT USING (true);
CREATE POLICY "Admins manage networks" ON supported_networks FOR ALL USING (fn_is_super_admin());

-- =============================================================================
-- SUPPORTED TOKENS
-- =============================================================================
ALTER TABLE supported_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read tokens" ON supported_tokens FOR SELECT USING (true);
CREATE POLICY "Admins manage tokens" ON supported_tokens FOR ALL USING (fn_is_super_admin());

-- =============================================================================
-- SUPPORTED WALLET ADDRESSES
-- =============================================================================
ALTER TABLE supported_wallet_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read active addresses" ON supported_wallet_addresses FOR SELECT USING (active = true);
CREATE POLICY "Super admin manage" ON supported_wallet_addresses FOR ALL USING (fn_is_super_admin());

-- =============================================================================
-- CARD PRODUCTS
-- =============================================================================
ALTER TABLE card_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read active cards" ON card_products FOR SELECT USING (active = true);
CREATE POLICY "Admins read all cards" ON card_products FOR SELECT USING (fn_is_admin());
CREATE POLICY "Admins manage cards" ON card_products FOR ALL USING (fn_is_admin());

-- =============================================================================
-- CARD ORDERS
-- =============================================================================
ALTER TABLE card_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON card_orders FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users create order" ON card_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel own order" ON card_orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND NEW.status IN ('cancelled'));
CREATE POLICY "Admins manage orders" ON card_orders FOR ALL USING (fn_is_admin());

-- =============================================================================
-- SHIPPING ADDRESSES
-- =============================================================================
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own shipping" ON shipping_addresses FOR SELECT USING (EXISTS (SELECT 1 FROM card_orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Users insert shipping" ON shipping_addresses FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM card_orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage shipping" ON shipping_addresses FOR ALL USING (fn_is_admin());

-- =============================================================================
-- PAYMENT TRANSACTIONS
-- =============================================================================
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payments" ON payment_transactions FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users create payment" ON payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage payments" ON payment_transactions FOR ALL USING (fn_is_admin());

-- =============================================================================
-- SUPPORT TICKETS
-- =============================================================================
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users create ticket" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users close own ticket" ON support_tickets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND NEW.status IN ('closed'));
CREATE POLICY "Admins manage tickets" ON support_tickets FOR ALL USING (fn_is_admin());

-- =============================================================================
-- TICKET MESSAGES
-- =============================================================================
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own ticket messages" ON ticket_messages FOR SELECT USING (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()));
CREATE POLICY "Users reply to own ticket" ON ticket_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()) AND author = 'customer');
CREATE POLICY "Admins manage messages" ON ticket_messages FOR ALL USING (fn_is_admin());

-- =============================================================================
-- TICKET ATTACHMENTS
-- =============================================================================
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ticket participants read" ON ticket_attachments FOR SELECT USING (EXISTS (SELECT 1 FROM ticket_messages tm JOIN support_tickets st ON st.id = tm.ticket_id WHERE tm.id = message_id AND (st.user_id = auth.uid() OR fn_is_admin())));
CREATE POLICY "Participants insert" ON ticket_attachments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM ticket_messages tm JOIN support_tickets st ON st.id = tm.ticket_id WHERE tm.id = message_id AND (st.user_id = auth.uid() OR fn_is_admin())));
CREATE POLICY "Admins manage attachments" ON ticket_attachments FOR ALL USING (fn_is_admin());

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users mark read" ON notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- ADMIN NOTIFICATIONS
-- =============================================================================
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read own" ON admin_notifications FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = admin_id AND profile_id = auth.uid()));
CREATE POLICY "Admins mark read" ON admin_notifications FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = admin_id AND profile_id = auth.uid()));

-- =============================================================================
-- AUDIT LOGS (append-only — no UPDATE or DELETE policies)
-- =============================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON audit_logs FOR SELECT USING (fn_is_admin());
-- No UPDATE policy — audit_logs are immutable
-- No DELETE policy — audit_logs are immutable
-- INSERT is allowed via service role only (no public INSERT policy)

-- =============================================================================
-- SYSTEM SETTINGS
-- =============================================================================
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read settings" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Super admin update" ON system_settings FOR UPDATE USING (fn_is_super_admin());
CREATE POLICY "Super admin insert" ON system_settings FOR INSERT WITH CHECK (fn_is_super_admin());

-- =============================================================================
-- USER PREFERENCES
-- =============================================================================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins read all" ON user_preferences FOR SELECT USING (fn_is_admin());
