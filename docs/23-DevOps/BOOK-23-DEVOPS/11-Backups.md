# Backups

## Backup Schedule

| Layer | Method | Frequency | Retention | RPO | RTO |
|-------|--------|-----------|-----------|-----|-----|
| PostgreSQL | Supabase point-in-time recovery | Continuous | 7 days | < 2 min | < 1 hour |
| PostgreSQL | pg_dump (full) | Daily | 30 days | 24 hours | < 2 hours |
| Storage | Cross-region replication | Real-time | — | < 1 min | < 15 min |
| Edge Functions | Git (version controlled) | Per deploy | Permanent | — | < 30 min |
| Configuration | Git (infra-as-code) | Per change | Permanent | — | < 30 min |
| Audit logs | Monthly archive | Monthly | 1 year | 1 month | < 1 day |

## Backup Commands

### Database Dump

```bash
# Daily full backup script
pg_dump \
  --dbname="$SUPABASE_DB_URL" \
  --format=custom \
  --file="backups/daily/$(date +%Y%m%d).dump" \
  --no-owner \
  --compress=9

# Upload to cold storage
aws s3 cp "backups/daily/$(date +%Y%m%d).dump" s3://twallet-backups/database/
```

### Storage Backup

```bash
# Sync storage bucket to cold storage
aws s3 sync s3://twallet-storage-avatars s3://twallet-backups/storage/avatars/
aws s3 sync s3://twallet-storage-documents s3://twallet-backups/storage/documents/
```

## Backup Verification

| Check | Frequency | Action |
|-------|-----------|--------|
| Backup completion alert | Daily | Verify backup script ran |
| Backup file size | Daily | Alert if size drop > 20% |
| Restore test | Quarterly | Restore to staging, verify data integrity |
| Encryption verification | Monthly | Verify backups are encrypted |

## Retention Policy

| Backup Age | Retention |
|------------|-----------|
| 0–7 days | Point-in-time recovery available |
| 8–30 days | Daily dump retained |
| 31–365 days | Weekly dump retained |
| > 1 year | Monthly archive retained (cold storage) |
