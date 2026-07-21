# Rollbacks

## When to Rollback

Rollback immediately if:

- Error rate > 5% above baseline (Sentry alert)
- Payment verification failures increase > 1%
- Critical security vulnerability discovered
- Performance regression > 20%
- Database migration error
- Auth success rate drops below 98%
- Any SEV-1 incident

## Rollback Process

### Code Rollback

```bash
# 1. Revert to previous deployment
vercel rollback
# or
# 2. Revert Git commit and redeploy
git revert HEAD
git push
# CI will auto-deploy
```

### Database Rollback

```bash
# If migration just ran, roll forward with compensation
supabase migration new rollback_<name>
# Write compensating SQL
supabase db push
```

### Combined Rollback

```
1. STOP: Disable the feature (flag or Vercel environment variable)
2. CODE: Revert to previous stable deployment
3. DB: Apply rollback migration if needed
4. VERIFY: Run smoke tests
5. MONITOR: Watch Sentry + Vercel Analytics
6. NOTIFY: Team Slack #incidents
```

## Rollback Types

| Type | Action | Time | Complexity |
|------|--------|------|------------|
| Vercel promote | Revert to previous deployment | 1 min | Low |
| Git revert + deploy | Revert commit, push | 5 min | Low |
| DB rollback migration | Apply compensating SQL | 5 min | Medium |
| Full rollback | Code + DB + config | 15 min | High |

## Post-Rollback

1. Verify all systems healthy
2. Log incident in ops/INCIDENT_LOG.md
3. Schedule post-mortem within 48 hours
4. Add regression test to prevent recurrence
5. Update runbook with lessons learned
