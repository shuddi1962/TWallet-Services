-- =============================================================================
-- Migration: 202608020017_card_color.sql
-- Purpose: Admin-chosen card product color (hex) rendered on customer
--          card previews in real time.
-- =============================================================================

BEGIN;

ALTER TABLE public.card_products
  ADD COLUMN IF NOT EXISTS color TEXT;

COMMIT;
