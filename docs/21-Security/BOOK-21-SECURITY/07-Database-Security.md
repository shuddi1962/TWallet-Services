# Database Security

## Requirements

| Requirement | Implementation |
|-------------|----------------|
| Row Level Security | Enabled on all 19 tables |
| Parameterized queries | Supabase SDK always uses parameterized queries |
| Database functions | Sensitive operations via `SECURITY DEFINER` functions |
| Minimal service role | Only used in Edge Functions and migrations |
| Encrypted connections | Supabase enforces TLS on all connections |
| Daily backups | Automated by Supabase (point-in-time recovery) |
| Migration reviews | Every migration reviewed before merge |

## RLS Strategy

Every table has RLS enabled. Policies follow these patterns:

| Pattern | Policy |
|---------|--------|
| User owns resource | `user_id = auth.uid()` |
| Admin can access all | `current_user_is_admin()` |
| Public read-only | `true` (for active products, networks, tokens) |
| System insert only | `true` with `service_role` key |
| Append-only | No UPDATE/DELETE policies (audit_logs) |

## Service Role Key

| Rule | Description |
|------|-------------|
| Server-side only | Never in client bundle or browser |
| Edge Functions only | Used in `verify-payment` and admin functions |
| Rotated quarterly | Key rotation scheduled in operations |
| Access logged | All service_role queries logged |

## SQL Injection Prevention

- Supabase JS SDK parameterizes all queries
- Raw SQL only in migrations (reviewed)
- Edge Functions use parameterized queries
- Never concatenate user input into SQL strings

## Connection Pooling

Supabase manages connection pooling via PgBouncer in transaction mode. Long-running queries use `statement_timeout`.
