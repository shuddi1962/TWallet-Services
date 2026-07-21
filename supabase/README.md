# TWallet Services — Supabase Database

> PostgreSQL 16 · Supabase CLI · Git-versioned migrations

## Quick Start

```bash
# Start local Supabase
supabase start

# Apply all migrations
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts

# Start Next.js dev server
npm run dev
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
8. Write SQL in the new migration
9. supabase db push  (test locally)
10. git commit migration + types
11. Deploy
```

## Migration Rules

| Rule | Description |
|------|-------------|
| Never edit old migrations | Always create a new migration |
| Naming | `YYYYMMDDHHMMSS_description.sql` |
| Idempotent | Use `IF NOT EXISTS`, `CREATE OR REPLACE` |
| Transactional | Wrap DDL in `BEGIN; ... COMMIT;` |
| Rollback | Include `-- DOWN` comment or a compensating migration |

## Engineering Standards

Every migration header:

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

## File Structure

```
supabase/
├── config.toml               (Supabase project config)
├── migrations/
│   ├── 202607200001_initial_schema.sql
│   ├── 202607200002_rls.sql
│   ├── 202607200003_indexes.sql
│   ├── 202607200004_functions.sql
│   ├── 202607200005_triggers.sql
│   ├── 202607200006_storage.sql
│   ├── 202607200007_seed_data.sql
│   ├── 202607200008_admin.sql
│   └── 202607200009_cleanup.sql
├── seed.sql                  (development seed data)
├── types.ts                  (placeholder — generated via supabase gen types)
└── README.md                 (this file)
```

## Commands

| Command | Purpose |
|---------|---------|
| `supabase start` | Start local Supabase stack |
| `supabase stop` | Stop local Supabase |
| `supabase db reset` | Reset database + apply all migrations + seed |
| `supabase migration new <name>` | Create a new migration file |
| `supabase db push` | Push migrations to linked remote |
| `supabase db diff` | Diff local vs remote schema |
| `supabase gen types typescript` | Generate TypeScript types from schema |
| `supabase functions deploy <name>` | Deploy an Edge Function |
| `supabase secrets set <key>=<value>` | Set Edge Function secrets |

## Rollback Strategy

Each migration is reversible:

```sql
-- Forward migration
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- DOWN migration (create a compensating migration)
ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
```

Create a new migration for rollback — never delete or edit an old one.

## Three Synchronized Representations

| Layer | Format | Purpose |
|-------|--------|---------|
| `docs/database/` | Markdown | Human-readable documentation |
| `supabase/migrations/` | SQL | Executable database versioning |
| `src/types/supabase.ts` | TypeScript | Strongly typed frontend/backend code |
