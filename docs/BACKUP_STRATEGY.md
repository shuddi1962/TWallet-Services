# Backup & Recovery Strategy

> Current state: no automated backup procedures are configured.

## Database (Supabase Postgres)

### Recommended: Daily automated backups
Supabase Pro plan and above include **daily backups** with 7-day retention (Pro) or 14-day (Team).

**Check current status:**
```bash
supabase projects list
supabase backups list --project-ref <ref>
```

If Supabase backups are not enabled:
1. Upgrade to at least Pro plan ($25/mo)
2. Verify in Dashboard → Database → Backups
3. Enable Point-in-Time Recovery (PITR) for <1h granularity (Team plan)

### Self-managed (belt-and-suspenders)
Run a `pg_dump` daily via GitHub Actions or cron:

```bash
PGPASSWORD=$SUPABASE_DB_PASSWORD pg_dump \
  --host=$SUPABASE_DB_HOST \
  --port=5432 \
  --username=$SUPABASE_DB_USER \
  --dbname=postgres \
  --format=custom \
  --file=backup-$(date +%Y-%m-%d).dump
```

Upload to S3-compatible storage:
```bash
aws s3 cp backup-*.dump s3://twallet-backups/database/
```

### Restore
```bash
pg_restore --host=new-host --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --clean --if-exists \
  backup-2026-07-24.dump
```

## Storage (Supabase / S3)

### Card art, profile pictures, and file uploads
Supabase Storage does not auto-backup buckets.
**Recommended:** Sync all buckets to S3 weekly:

```bash
# Install supabase CLI or use python script
supabase storage list-buckets
# For each bucket:
aws s3 sync s3://supabase-storage-bucket/ s3://twallet-backups/storage/ --delete
```

### Migration files
Migrations are source-controlled in `supabase/migrations/`. Committing to git is sufficient.

## Critical data (manual export)

| Data | Export Method | Frequency | Retention |
|---|---|---|---|
| Orders | `supabase db dump --table orders` | Daily | 30 days |
| Payment verifications | `supabase db dump --table payment_verifications` | Daily | 30 days |
| Auth users | Supabase Dashboard → Authentication → Export | Weekly | — |
| RLS policies | `supabase db dump --schema public --data-only` | After each change | — |

## Recovery runbook

### Scenario 1: Accidental table drop
```bash
# 1. Create new Supabase project (or restore from backup)
supabase restore --project-ref <ref> --backup-id <id>

# 2. Re-run edge function secrets
supabase secrets set ALCHEMY_API_KEY=<value>

# 3. Verify data integrity
curl https://twalletservices.com/api/ready

# 4. Update Vercel env vars to point to new project
```

### Scenario 2: Data corruption (bad migration)
```bash
# 1. Identify the bad migration (check supabase/migrations/)
# 2. Roll back:
supabase migration repair --status reverted <migration-timestamp>

# 3. Apply corrected migration:
supabase migration up

# 4. Re-run security advisor:
supabase_get_advisors type=security
```

### Scenario 3: Full disaster recovery
```bash
# 1. Spin up new Supabase project
# 2. Restore latest database dump
# 3. Run all migrations to ensure schema matches
# 4. Restore storage buckets
# 5. Update Vercel env vars
# 6. Re-deploy:
npx vercel --prod
```

## Backup checklist

- [ ] Supabase daily backups enabled (check plan)
- [ ] PITR enabled (Team plan or above)
- [ ] Storage bucket sync to S3 configured
- [ ] Weekly `pg_dump` CI job added
- [ ] Recovery runbook tested in staging
- [ ] Backup retention policy documented (30d min)
- [ ] Restore procedure verified (time-to-recover measured)