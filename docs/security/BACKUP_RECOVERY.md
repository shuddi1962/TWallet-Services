# Backup & Recovery — TWallet Services

> Full deployment operations in `22-Deployment/BOOK-22-DEPLOYMENT-OPERATIONS/`

## Backup Strategy

| Layer | Method | Frequency | Retention | RPO | RTO |
|-------|--------|-----------|-----------|-----|-----|
| PostgreSQL | Supabase point-in-time recovery | Continuous | 7 days | < 2 min | < 1 hour |
| PostgreSQL | pg_dump (full) | Daily | 30 days | 24 hours | < 2 hours |
| Storage | Cross-region replication | Real-time | — | < 1 min | < 15 min |
| Edge Functions | Git (version control) | Per deploy | Permanent | — | < 30 min |
| Configuration | Git (infra-as-code) | Per change | Permanent | — | < 30 min |

## Recovery Procedures

### Database Recovery
```bash
# Restore from Supabase dashboard
# Or via CLI:
supabase db pull
supabase db push
```

### Full Recovery Test
- Quarterly: restore from backup to staging environment
- Verify data integrity (row counts, recent records)
- Test application functionality against restored data
- Document results

## Backup Verification

| Check | Frequency |
|-------|-----------|
| Backup completion alert | Daily |
| Backup size monitoring | Daily |
| Restoration test | Quarterly |
| Encryption verification | Monthly |

## Disaster Recovery

| Scenario | Recovery Method | Target RTO |
|----------|----------------|------------|
| Database corruption | PITR to pre-corruption state | < 1 hour |
| Accidental table drop | PITR or pg_dump restore | < 2 hours |
| Region failure | Supabase multi-region (future) | < 4 hours |
| Storage data loss | Cross-region replication | < 15 min |
| Full platform failure | Rebuild from Git + backup | < 4 hours |
