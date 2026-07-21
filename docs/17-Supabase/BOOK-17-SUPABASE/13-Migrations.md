# Migrations

> Database migration workflow using Supabase CLI. Version-controlled, peer-reviewed, and idempotent.

---

## Migration Philosophy

1. **Every DDL change is a migration** — no ad-hoc SQL on production
2. **Version-controlled** — migrations committed to git with the codebase
3. **Idempotent** — safe to run multiple times (use `IF NOT EXISTS`, `CREATE OR REPLACE`)
4. **Peer-reviewed** — all migrations reviewed before applying to production
5. **Generated TypeScript types after every migration**

---

## CLI Setup

```bash
# Install Supabase CLI
npm install -g supabase
# or: brew install supabase/tap/supabase

# Link to project
supabase link --project-ref <project-id>

# Login
supabase login
```

---

## Migration Workflow

### 1. Create a new migration

```bash
supabase migration new add_card_annual_fee
```

Creates: `supabase/migrations/20260721120000_add_card_annual_fee.sql`

### 2. Write the SQL

```sql
-- supabase/migrations/20260721120000_add_card_annual_fee.sql
ALTER TABLE card_products
ADD COLUMN IF NOT EXISTS annual_fee_usdc NUMERIC(20, 2) DEFAULT 0 NOT NULL;
```

### 3. Test locally

```bash
supabase start        # Start local Supabase
supabase migration up # Apply migrations
supabase db diff      # Check diff
```

### 4. Generate TypeScript types

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

### 5. Commit

```bash
git add supabase/migrations/20260721120000_add_card_annual_fee.sql
git add src/types/supabase.ts
git commit -m "feat(cards): add annual_fee_usdc column"
```

### 6. Deploy to production

```bash
supabase migration up --linked
```

---

## Naming Convention

```
{YYYY}{MM}{DD}{HH}{MM}{SS}_{description}.sql

Examples:
20260721100000_create_profiles.sql
20260721110000_create_wallets.sql
20260721120000_create_card_orders.sql
20260721130000_add_rls_policies.sql
20260721140000_add_triggers.sql
```

---

## Migration File Organization

```
supabase/
├── migrations/
│   ├── 20260721100000_create_profiles.sql
│   ├── 20260721110000_create_wallets.sql
│   ├── 20260721120000_create_card_orders.sql
│   ├── 20260721130000_add_rls_policies.sql
│   ├── 20260721140000_add_triggers.sql
│   ├── 20260721150000_add_functions.sql
│   ├── 20260721160000_add_indexes.sql
│   ├── 20260721170000_add_storage_buckets.sql
│   ├── 20260721180000_seed_data.sql
│   └── 20260721190000_create_admin_user.sql
├── seed.sql               (development seed data only)
└── config.toml            (Supabase project config)
```

---

## Migration Writing Rules

### DO
```sql
-- Use IF NOT EXISTS for DDL
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Use CREATE OR REPLACE for functions
CREATE OR REPLACE FUNCTION fn_set_updated_at() ...

-- Wrap in transactions
BEGIN;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
COMMIT;
```

### DON'T
```sql
-- DON'T: Hardcode IDs
INSERT INTO system_settings (id, category, settings) VALUES ('fixed-uuid', ...);

-- DON'T: Drop and recreate
DROP TABLE profiles;  -- Data loss!

-- DON'T: Skip IF NOT EXISTS
ALTER TABLE profiles ADD COLUMN bio TEXT;  -- Fails if bio exists
```

---

## Branch Workflow

```bash
# Create a branch for risky migrations
supabase branches create feat-new-payment-method

# Apply migrations to branch
supabase migration up --linked --branch feat-new-payment-method

# Test in branch environment
# ... run tests ...

# Merge back to production
supabase branches merge feat-new-payment-method

# Delete branch
supabase branches delete feat-new-payment-method
```

---

## Rollback Strategy

Supabase doesn't natively support rollback. Instead:

1. **Create a compensating migration** — reverse the change
2. **Test the compensating migration** in a branch
3. **Apply the compensating migration** to production

```sql
-- Rollback migration: 20260721120000_remove_card_annual_fee.sql
ALTER TABLE card_products DROP COLUMN IF EXISTS annual_fee_usdc;
```

---

## After Every Migration

```bash
# 1. Generate types
supabase gen types typescript --local > src/types/supabase.ts

# 2. Run security advisors
supabase db diff --linked
supabase_get_advisors --type security

# 3. Fix any findings
# 4. Commit types + migration
```
