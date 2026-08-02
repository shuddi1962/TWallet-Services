-- =============================================================================
-- Migration: 202608020009_ticket_notification_types.sql
-- Purpose: Allow distinct notification types for admin ticket resolution/closure.
-- =============================================================================

BEGIN;

ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ticket_resolved';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ticket_closed';

COMMIT;