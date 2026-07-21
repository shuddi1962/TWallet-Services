# Backups

> Backup and recovery strategy for TWallet Services PostgreSQL database and Storage files.

---

## Backup Schedule

| Frequency | Type | Retention | Storage | Method |
|-----------|------|-----------|---------|--------|
| Daily | Database (full) | 30 days | Supabase managed | Automatic (Pro plan) |
| Weekly | Database (full) | 3 months | S3-compatible (external) | `pg_dump` via cron |
| Monthly | Database (archive) | 1 year | S3-compatible (cold) | `pg_dump` + compress |
| Quarterly | Restore test | — | Test environment | Full restore + smoke tests |

---

## Supabase Managed Backups

Supabase Pro plan includes:

| Feature | Details |
|---------|---------|
| Automatic daily backups | Point-in-time recovery within 24h |
| Retention | Up to 30 days |
| PITR (Point-in-Time Recovery) | Available on Pro plan |
| Self-service restore | Supabase dashboard → Database → Backups |

---

## External Backup (pg_dump)

### Weekly Full Backup

```bash
#!/bin/bash
# backup-database.sh — run weekly via cron
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

pg_dump "$DB_URL" \
  --format=custom \
  --verbose \
  --file="$BACKUP_DIR/twallet_$TIMESTAMP.dump" \
  --no-owner \
  --compress=9

# Encrypt
gpg --encrypt --recipient admin@twalletservices.com \
  "$BACKUP_DIR/twallet_$TIMESTAMP.dump"

# Upload to S3-compatible storage
aws s3 cp "$BACKUP_DIR/twallet_$TIMESTAMP.dump.gpg" \
  "s3://twallet-backups/database/weekly/twallet_$TIMESTAMP.dump.gpg"

# Clean old local files (keep 7 days)
find "$BACKUP_DIR" -name "*.dump*" -mtime +7 -delete
```

### Monthly Archive

```bash
pg_dump "$DB_URL" --format=plain --no-owner | gzip -9 > \
  "/backups/archive/twallet_$(date +%Y%m).sql.gz"
```

---

## Storage Backups

Supabase Storage files are backed up as part of database backups (file metadata). The actual files can be backed up via:

```bash
# Backup all storage buckets via Supabase CLI
supabase storage list
supabase storage download --bucket avatars --path /backups/storage/avatars/
supabase storage download --bucket documents --path /backups/storage/documents/
```

Or via S3-compatible sync (if using S3 for storage instead of Supabase):

```bash
aws s3 sync s3://twallet-storage/ s3://twallet-backups/storage/daily/
```

---

## Restore Procedure

### From Supabase Managed Backup

```
1. Go to Supabase Dashboard → Database → Backups
2. Click "Restore" on the desired backup
3. Select target project (staging or new project)
4. Confirm restore
```

### From pg_dump Custom Format

```bash
pg_restore --dbname=$DATABASE_URL \
  --clean \
  --if-exists \
  --no-owner \
  --jobs=4 \
  twallet_20260721_120000.dump
```

---

## Restore Test (Quarterly)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Create new Supabase project | Project starts |
| 2 | Restore latest backup | No errors |
| 3 | Run `supabase_get_advisors` | Security/pass |
| 4 | Run smoke tests | All critical queries succeed |
| 5 | Verify RLS works | Policies enforced |
| 6 | Verify Edge Functions deploy | Functions operational |
| 7 | Document results | Restore time, issues found |
| 8 | Clean up test project | Resources released |

---

## Disaster Recovery Plan

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| Database corruption | 4h | 24h | Restore from daily backup |
| Accidental data loss | 2h | 24h | PITR to before loss |
| Region failure | 8h | 24h | Restore to new Supabase region |
| Storage data loss | 4h | 24h | Restore from S3 backup |
| Full platform failure | 12h | 24h | Full restore to new Vercel + Supabase |
