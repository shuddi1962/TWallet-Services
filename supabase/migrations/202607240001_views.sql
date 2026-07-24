-- Customer dashboard views
CREATE OR REPLACE VIEW vw_dashboard_summary AS
SELECT
  p.id AS user_id,
  COUNT(DISTINCT w.id) FILTER (WHERE w.deleted_at IS NULL) AS wallet_count,
  COUNT(DISTINCT co.id) AS total_orders,
  COUNT(DISTINCT co.id) FILTER (WHERE co.status IN ('paid','processing','shipped','delivered')) AS active_orders,
  COALESCE(SUM(pt.amount) FILTER (WHERE pt.status = 'confirmed'), 0) AS total_spent
FROM profiles p
LEFT JOIN wallets w ON w.user_id = p.id AND w.deleted_at IS NULL
LEFT JOIN card_orders co ON co.user_id = p.id
LEFT JOIN payment_transactions pt ON pt.user_id = p.id
GROUP BY p.id;

-- Admin analytics views
CREATE OR REPLACE VIEW vw_revenue_daily AS
SELECT
  DATE(created_at) AS date,
  SUM(amount) AS revenue,
  COUNT(*) AS transactions
FROM payment_transactions
WHERE status = 'confirmed'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW vw_active_orders AS
SELECT
  co.*,
  cp.name AS product_name,
  cp.type AS product_type,
  p.full_name AS customer_name,
  p.email AS customer_email
FROM card_orders co
JOIN card_products cp ON cp.id = co.card_product_id
LEFT JOIN profiles p ON p.id = co.user_id
WHERE co.status NOT IN ('cancelled', 'refunded', 'delivered');

CREATE OR REPLACE VIEW vw_ticket_overview AS
SELECT
  st.*,
  p.full_name AS customer_name,
  p.email AS customer_email,
  a.full_name AS assigned_admin_name
FROM support_tickets st
LEFT JOIN profiles p ON p.id = st.user_id
LEFT JOIN admins adm ON adm.id = st.assigned_to
LEFT JOIN profiles a ON a.id = adm.profile_id;

-- Materialized views (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_order_stats AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_orders,
  COUNT(*) FILTER (WHERE status = 'shipped') AS shipped_orders,
  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_orders,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders
FROM card_orders
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_revenue AS
SELECT
  DATE(pt.created_at) AS date,
  COUNT(*) AS transaction_count,
  SUM(pt.amount) AS total_revenue,
  AVG(pt.amount) AS avg_transaction
FROM payment_transactions pt
WHERE pt.status = 'confirmed'
GROUP BY DATE(pt.created_at)
ORDER BY date DESC;

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
