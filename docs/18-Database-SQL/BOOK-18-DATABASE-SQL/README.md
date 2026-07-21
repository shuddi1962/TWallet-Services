# BOOK-18 — DATABASE SQL & MIGRATIONS

**Version:** 1.0.0 · **Status:** Production Ready · **Priority:** Critical

## Overview

This book contains every SQL file required to build and maintain the TWallet Services database. It follows the Supabase CLI migration workflow with versioned, idempotent, reversible migrations.

### Goals

- Database Versioning — every change is tracked in Git
- Easy Deployment — `supabase db push` to any environment
- Easy Rollback — compensating migrations, never edit old ones
- Easy Local Development — `supabase db reset` rebuilds in seconds
- CI/CD Friendly — automated migration + type generation

## Database

| Attribute | Value |
|-----------|-------|
| Engine | PostgreSQL 16 |
| Hosted By | Supabase |
| Migration Tool | Supabase CLI |
| Version Control | Git |

## Folder Structure

```
supabase/
├── config.toml
├── migrations/
│   ├── 202607200001_initial_schema.sql     — 19 tables + 11 enums + FKs
│   ├── 202607200002_rls.sql                — RLS policies (all tables)
│   ├── 202607200003_indexes.sql            — 51 performance indexes
│   ├── 202607200004_functions.sql          — 10 database functions
│   ├── 202607200005_triggers.sql           — 6 triggers (updated_at, new user, etc.)
│   ├── 202607200006_storage.sql            — 5 Storage buckets + policies
│   ├── 202607200007_seed_data.sql          — Development seed data
│   ├── 202607200008_admin.sql              — Admin setup
│   └── 202607200009_cleanup.sql            — pg_cron scheduled cleanup
├── seed.sql                                — Additional seed data
├── types.ts                                — TypeScript typegen placeholder
└── README.md
```

## Migration Rules

| Rule | Description |
|------|-------------|
| Never edit old migrations | Always create a new migration |
| Naming | `YYYYMMDDHHMMSS_description.sql` |
| Idempotent | `IF NOT EXISTS`, `CREATE OR REPLACE` |
| Rollback | Compensating migration, never delete old files |
| Review | Every migration must be reviewed before merge |

## Engineering Standards

Every migration header includes:

```sql
-- =============================================================================
-- Migration: YYYYMMDDHHMMSS_description.sql
-- Purpose: What this migration does
-- Dependencies: None / depends on migration X
-- Rollback: REVERSIBLE / IRREVERSIBLE
-- Verification: SELECT / EXPLAIN / test query
-- Author: Name
-- Date: YYYY-MM-DD
-- =============================================================================
```

## Supabase Commands

```bash
supabase start                          # Start local Supabase stack
supabase stop                           # Stop local Supabase
supabase db reset                       # Reset + apply all migrations + seed
supabase migration new add_card_theme   # Create a new migration
supabase db push                        # Push to linked remote
supabase db diff                        # Diff local vs remote
supabase gen types typescript           # Generate TypeScript types
supabase functions deploy verify-payment # Deploy an Edge Function
```

## Development Workflow

```
1. Pull latest code
2. supabase start
3. supabase db reset
4. supabase gen types typescript
5. npm run dev
6. Develop
7. supabase migration new <description>
8. Write SQL
9. supabase db push (test locally)
10. git commit migration + types
11. Deploy
```

## Three Synchronized Representations

| Layer | Format | Location | Purpose |
|-------|--------|----------|---------|
| Human-readable docs | Markdown | `docs/database/` | Onboarding, reviews, architecture |
| Executable SQL | SQL | `supabase/migrations/` | Versioned, repeatable deployments |
| TypeScript types | TS | `src/types/supabase.ts` | Type-safe frontend/backend |

## Senior Architect Improvements

The `docs/database/` directory contains complementary documentation:

- `ERD.md` — Entity Relationship Diagram (text-based Mermaid)
- `Schema.md` — Overview of schemas and extensions
- `Tables.md` — Full table reference with columns and types
- `Relationships.md` — Foreign key relationships
- `Constraints.md` — CHECK, UNIQUE, NOT NULL constraints
- `Indexes.md` — Index catalog with columns
- `Views.md` — Database views and materialized views

## Complete Book Status

```text
████████████████████████████████░░░░
Overall Progress: 65%

Books 01–18 complete.
Book 19 — Component Library (next)
```
