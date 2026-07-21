# Supabase

## Production Project

| Service | Supabase |
|---------|----------|
| Database | PostgreSQL 16 with point-in-time recovery |
| Auth | GoTrue with email/password + future OAuth |
| Storage | S3-compatible with RLS-integrated policies |
| Realtime | WebSocket-based, broadcast + presence |
| Edge Functions | Deno runtime, connected to project DB |

## Deployment Commands

```bash
# Push migrations
supabase db push

# Deploy edge functions
supabase functions deploy verify-payment
supabase functions deploy admin-notify

# Set secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<key>
supabase secrets set ALCHEMY_API_KEY=<key>
supabase secrets set RESEND_API_KEY=<key>
supabase secrets set WEBHOOK_SECRET=<secret>

# Generate types
supabase gen types typescript --linked > src/types/supabase.ts
```

## Supabase CLI in CI

```yaml
- name: Supabase migration
  run: |
    supabase link --project-ref $PROJECT_REF
    supabase db push
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
```

## Backup Strategy

| Type | Frequency | Retention | Managed By |
|------|-----------|-----------|------------|
| Point-in-time recovery | Continuous | 7 days | Supabase |
| Daily dump | Daily | 30 days | Script |
| Storage replication | Real-time | — | Supabase |

## Monitoring

- Supabase Dashboard: database performance, auth usage, storage
- Supabase Logs: API, Auth, Storage, Edge Functions
- Custom: Sentry for Edge Function errors
