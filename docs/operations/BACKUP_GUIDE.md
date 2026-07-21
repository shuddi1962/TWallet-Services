# Operations — Backup Guide

## Backup Schedule

| Layer | Method | Frequency | Retention |
|-------|--------|-----------|-----------|
| PostgreSQL | Supabase PITR | Continuous | 7 days |
| PostgreSQL | pg_dump (full) | Daily | 30 days |
| Storage | Cross-region replication | Real-time | Indefinite |
| Code | Git (version controlled) | Per commit | Permanent |
| Configuration | Git (infra-as-code) | Per change | Permanent |

## Backup Commands

### Database Dump

```bash
pg_dump \
  --dbname="$SUPABASE_DB_URL" \
  --format=custom \
  --file="backups/daily/$(date +%Y%m%d).dump" \
  --no-owner \
  --compress=9

aws s3 cp "backups/daily/$(date +%Y%m%d).dump" s3://twallet-backups/database/
```

### Storage Backup

```bash
aws s3 sync s3://twallet-storage-avatars s3://twallet-backups/storage/avatars/
```

## Backup Verification

| Check | Frequency | Action |
|-------|-----------|--------|
| Completion alert | Daily | Verify backup script ran |
| File size check | Daily | Alert if size drop > 20% |
| Restore test | Quarterly | Full restore to staging |
| Encryption check | Monthly | Verify encryption |

## Retention Policy

| Age | Retention |
|-----|-----------|
| 0–7 days | PITR available |
| 8–30 days | Daily dump |
| 31–365 days | Weekly dump |
| > 1 year | Monthly archive (cold storage) |
