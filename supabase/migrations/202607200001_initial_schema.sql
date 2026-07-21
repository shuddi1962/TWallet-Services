-- =============================================================================
-- Migration: 202607200001_initial_schema.sql
-- Purpose: Create all enums + 19 tables + constraints + foreign keys
-- Dependencies: None (foundation migration)
-- Rollback: Fully reversible (DROP all)
-- Verification: \dt should show all tables
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- ENUMS (11)
-- =============================================================================
CREATE TYPE card_type AS ENUM ('physical', 'virtual');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'flagged', 'refunded');
CREATE TYPE shipping_status AS ENUM ('not_shipped', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'returned');
CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed', 'escalated');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM ('shipping', 'payment', 'card', 'account', 'other');
CREATE TYPE admin_role AS ENUM ('super_admin', 'operations', 'finance', 'support', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE notification_type AS ENUM ('new_order', 'new_payment', 'payment_confirmed', 'payment_failed', 'shipping_update', 'support_reply', 'system', 'promotion');
CREATE TYPE audit_action AS ENUM (
  'user_suspended', 'user_reactivated', 'user_deleted',
  'order_status_changed', 'order_tracking_assigned', 'order_refunded',
  'payment_confirmed', 'payment_flagged', 'payment_unflagged',
  'card_created', 'card_updated', 'card_archived',
  'wallet_added', 'wallet_rotated', 'wallet_disabled',
  'ticket_assigned', 'ticket_escalated', 'ticket_closed',
  'settings_updated', 'admin_created', 'admin_role_changed',
  'login', 'logout', 'export_generated', 'system_setting_changed'
);

-- =============================================================================
-- PROFILES
-- =============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  status user_status NOT NULL DEFAULT 'active',
  kyc_tier TEXT NOT NULL DEFAULT 'none',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles (LOWER(email));

-- =============================================================================
-- USER ROLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- =============================================================================
-- ADMINS
-- =============================================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- =============================================================================
-- WALLETS (user-connected)
-- =============================================================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  network TEXT NOT NULL,
  network_id INTEGER NOT NULL,
  label TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  signature TEXT NOT NULL,
  message TEXT NOT NULL,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(address, network_id)
);

-- =============================================================================
-- SUPPORTED NETWORKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS supported_networks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  chain_id INTEGER NOT NULL UNIQUE,
  currency TEXT NOT NULL,
  explorer_url TEXT NOT NULL,
  rpc_url TEXT NOT NULL,
  icon_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUPPORTED TOKENS
-- =============================================================================
CREATE TABLE IF NOT EXISTS supported_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id TEXT NOT NULL REFERENCES supported_networks(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 6,
  icon_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(symbol, network_id)
);

-- =============================================================================
-- SUPPORTED WALLET ADDRESSES (platform receiving wallets)
-- =============================================================================
CREATE TABLE IF NOT EXISTS supported_wallet_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id TEXT NOT NULL REFERENCES supported_networks(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  label TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  rotated_from UUID REFERENCES supported_wallet_addresses(id),
  total_received NUMERIC(20, 2) NOT NULL DEFAULT 0,
  tx_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_supported_wallet_addresses_addr ON supported_wallet_addresses (address);

-- =============================================================================
-- CARD PRODUCTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS card_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type card_type NOT NULL,
  description TEXT NOT NULL,
  price_usdc NUMERIC(20, 2) NOT NULL CHECK (price_usdc > 0),
  annual_fee_usdc NUMERIC(20, 2) NOT NULL DEFAULT 0,
  networks TEXT[] NOT NULL DEFAULT '{}',
  tokens TEXT[] NOT NULL DEFAULT '{}',
  currency TEXT NOT NULL DEFAULT 'USD',
  card_art_url TEXT,
  features JSONB DEFAULT '[]',
  terms_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- CARD ORDERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS card_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES card_products(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'pending',
  amount_usdc NUMERIC(20, 2) NOT NULL,
  paid_usdc NUMERIC(20, 2) NOT NULL DEFAULT 0,
  balance_usdc NUMERIC(20, 2) NOT NULL DEFAULT 0,
  network TEXT,
  token TEXT,
  tx_hash TEXT,
  shipping_status shipping_status NOT NULL DEFAULT 'not_shipped',
  tracking_number TEXT,
  carrier TEXT,
  flagged BOOLEAN NOT NULL DEFAULT false,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- =============================================================================
-- SHIPPING ADDRESSES
-- =============================================================================
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- =============================================================================
-- PAYMENT TRANSACTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(20, 2) NOT NULL,
  network_id TEXT NOT NULL REFERENCES supported_networks(id) ON DELETE RESTRICT,
  token_id UUID NOT NULL REFERENCES supported_tokens(id) ON DELETE RESTRICT,
  receiving_wallet_id UUID REFERENCES supported_wallet_addresses(id) ON DELETE RESTRICT,
  tx_hash TEXT UNIQUE,
  status payment_status NOT NULL DEFAULT 'pending',
  confirmations INTEGER DEFAULT 0,
  min_confirmations INTEGER NOT NULL DEFAULT 12,
  block_number INTEGER,
  from_address TEXT,
  to_address TEXT,
  network_fee NUMERIC(20, 8),
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- =============================================================================
-- SUPPORT TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES card_orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- =============================================================================
-- TICKET MESSAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  author TEXT NOT NULL CHECK (author IN ('customer', 'admin')),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TICKET ATTACHMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES ticket_messages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_type TEXT,
  related_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ADMIN NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_type TEXT,
  related_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- AUDIT LOGS (append-only)
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SYSTEM SETTINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL UNIQUE,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- USER PREFERENCES
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{"language":"en","currency":"USD","theme":"light","notifications":{"email_order_confirmed":true,"email_payment_received":true,"email_shipping_update":true,"push_order_status":true,"push_promotions":false}}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

COMMIT;
