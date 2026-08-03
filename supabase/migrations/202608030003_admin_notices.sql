-- Admin notices + missing notification types
-- 1) 'notice' — admin-sent broadcast/individual notices to users
-- 2) Edge functions (verify-payment, transition-order, order-status) insert
--    order_paid / order_shipped / order_delivered / card_activated /
--    card_declined — these values were missing from the enum so those
--    notifications were silently rejected.
-- 3) audit_action 'notification_sent' for the send-notice audit trail.

ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'notice';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'order_paid';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'order_shipped';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'order_delivered';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'card_activated';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'card_declined';

ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_sent';
