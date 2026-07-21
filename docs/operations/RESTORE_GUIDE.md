# Operations — Restore Guide

## Database Restore

### Point-in-Time Recovery (PITR)

```text
1. Supabase Dashboard → Database → Backups
2. Select restore point (within 7 days)
3. Confirm restoration
4. Verify data integrity
5. Verify application connectivity
```

### Full Backup Restore (pg_dump)

```bash
# Download backup
aws s3 cp s3://twallet-backups/database/20260720.dump ./restore.dump

# Restore
pg_restore \
  --dbname="$STAGING_DB_URL" \
  --clean \
  --if-exists \
  --no-owner \
  restore.dump
```

## Storage Restore

```bash
aws s3 sync s3://twallet-backups/storage/ s3://twallet-storage-restored/
```

## Code Restore

```bash
git revert <commit-hash>
git push
```

## Full System Restore (Disaster Recovery)

```text
1. Restore database from latest backup
2. Redeploy application from Git
3. Restore storage from backup
4. Verify data integrity
5. Verify application functionality
6. Update DNS if needed
7. Monitor for 2 hours
```

## Restore Verification

After any restore:

- [ ] Database query returns expected results
- [ ] Application connects to database
- [ ] Auth flow works
- [ ] Payment flow works
- [ ] Storage files accessible
- [ ] No errors in Sentry
