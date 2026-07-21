# Supabase Production Setup

## Production Checklist

### Database

- [ ] All migrations applied
- [ ] RLS policies enabled and tested
- [ ] Indexes created (verify with `pg_stat_user_indexes`)
- [ ] Connection pool configured (Pro plan: 60 connections)
- [ ] Point-in-time recovery enabled
- [ ] Daily backups configured
- [ ] Database size within plan limits

### Authentication

- [ ] Auth providers configured (email, magic link)
- [ ] Redirect URLs configured for production domain
- [ ] JWT expiry configured (session: 7 days, refresh: 30 days)
- [ ] Rate limiting on auth endpoints
- [ ] Email templates customized for production

### Storage

- [ ] All 5 buckets created with RLS policies
- [ ] Signed URLs tested for private buckets
- [ ] Public cache headers configured for public bucket
- [ ] File size limits enforced (max 5 MB)
- [ ] MIME type restrictions configured

### Realtime

- [ ] Realtime enabled on required tables
- [ ] Max connections within plan limits
- [ ] Channel filters narrowed (user-specific, role-specific)

### Edge Functions

- [ ] `verify-payment` function deployed
- [ ] JWT verification enabled on non-public functions
- [ ] Environment variables set in Supabase
- [ ] Function timeout configured (60 seconds max)
- [ ] Function logs reviewed and clean

## Supabase CLI Commands

```bash
# Link production project
supabase link --project-ref <project-ref>

# Deploy migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy verify-payment --project-ref <project-ref>

# Generate types
supabase gen types typescript --linked > src/types/supabase.ts

# Verify
supabase db status
```

## Production Plan

| Plan | Recommended | Justification |
|------|-------------|---------------|
| Launch | Pro | 8 GB database, 60 connections, 500K Edge Function invocations |
| Growth | Team | 16 GB database, 150 connections, 2M Edge Function invocations |
| Scale | Enterprise | Custom limits, SLA, multi-region |
