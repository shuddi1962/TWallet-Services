# Database Migrations

## Workflow

```
1. CREATE — supabase migration new <description>
2. WRITE — SQL in the new migration file
3. REVIEW — PR with migration reviewed by team
4. TEST — supabase db push → verify locally
5. DEPLOY — supabase db push (staging → production)
6. VERIFY — SELECT, EXPLAIN, smoke test
7. TAG — Git tag includes migration version
```

## Migration Rules

| Rule | Description |
|------|-------------|
| Never edit old migrations | Always create a new migration |
| Idempotent | Use `IF NOT EXISTS`, `CREATE OR REPLACE` |
| Rollback included | Include compensating SQL or separate rollback migration |
| Transactional | Wrap DDL in `BEGIN; ... COMMIT;` |
| Reviewed | Every migration reviewed by at least one other engineer |

## Creating a Migration

```bash
supabase migration new add_card_theme
```

Creates `supabase/migrations/YYYYMMDDHHMMSS_add_card_theme.sql`

## Deployment

### Local
```bash
supabase db reset
```

### Staging / Production
```bash
supabase db push
```

### CI
```yaml
- name: Deploy migrations
  run: |
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    supabase db push
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Migration Verification

After deploying, verify:

```sql
-- Check migration history
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;

-- Check new objects exist
\dt <new_table>
\df <new_function>
SELECT * FROM <new_table> LIMIT 1;
```

## Rollback

Create a compensating migration:

```bash
supabase migration new rollback_add_card_theme
```

```sql
-- Rollback migration
DROP TABLE IF EXISTS card_themes CASCADE;
```
