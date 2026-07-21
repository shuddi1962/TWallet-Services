# Disaster Recovery

## Failure Scenarios

| Scenario | Impact | RTO | RPO | Recovery Method |
|----------|--------|-----|-----|-----------------|
| Database corruption | Full platform down | < 1 hour | < 2 min | PITR to pre-corruption state |
| Accidental table drop | Partial data loss | < 2 hours | 24 hours | pg_dump restore |
| Storage data loss | File access failure | < 15 min | < 1 min | Cross-region replication |
| Deployment failure | Broken UI/API | < 10 min | — | Vercel rollback |
| DNS failure | Site unreachable | < 5 min | — | Cloudflare failover |
| Supabase outage | Backend unavailable | < 4 hours | — | Wait + status page |
| Vercel outage | Frontend unavailable | < 4 hours | — | Wait + status page |
| Region failure | Full platform down | < 4 hours | 24 hours | Rebuild from backup + Git |
| Security breach | Data compromise | < 1 hour | — | Isolate, rotate keys, restore |

## Recovery Procedures

### Database Failure

```bash
# 1. Identify restore point
# 2. Restore via Supabase Dashboard (Point-in-Time Recovery)
# 3. Verify data integrity
# 4. Verify application functionality
```

### Deployment Failure

```bash
# 1. Vercel rollback
vercel rollback

# 2. If migration-related:
supabase migration new rollback_<name>
supabase db push

# 3. Verify
```

### Full Platform Failure

```
1. Assess scope and impact
2. Notify team via Slack #incidents
3. Restore database from latest backup
4. Redeploy application from Git
5. Restore storage from backup
6. Verify data integrity
7. Update DNS if needed
8. Monitor for 2 hours
9. Incident review
```

## Disaster Recovery Test

| Test | Frequency | Scope |
|------|-----------|-------|
| Database restore | Quarterly | Full restore to staging environment |
| Vercel rollback | Quarterly | Rollback production deployment |
| Backup integrity | Quarterly | Verify backup files are readable |
| Secrets rotation | Quarterly | Rotate all service keys |
| DNS failover | Annually | Test Cloudflare failover |

## Communication

During a disaster, communicate through:

| Channel | Audience | Update Frequency |
|---------|----------|-----------------|
| Slack #incidents | Internal team | Every 30 min |
| Status page | Customers | Every hour (SEV-1 only) |
| Email | Affected users | After resolution |
