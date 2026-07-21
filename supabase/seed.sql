-- =============================================================================
-- seed.sql — Development seed data
-- Run via: supabase db reset (automatically applied)
-- This file is managed by Supabase CLI and runs AFTER all migrations
-- =============================================================================

-- Reference the seed data from migration 202607200007
-- Additional development-only seed data below

-- Demo notifications for local testing
INSERT INTO notifications (user_id, type, title, message, read)
SELECT
  p.id,
  'system',
  'Welcome to TWallet Card',
  'Thank you for signing up. Get started by ordering your first card.',
  false
FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM notifications n WHERE n.user_id = p.id AND n.title = 'Welcome to TWallet Card');
