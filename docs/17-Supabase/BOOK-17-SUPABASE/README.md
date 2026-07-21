# Book 17 — Supabase Architecture

> **TWallet Services · TWallet Card**
> The complete backend architecture using Supabase — PostgreSQL, Auth, RLS, Storage, Realtime, Edge Functions, triggers, database functions, and security.

---

## Document Control

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Book         | 17 — Supabase Architecture           |
| Version      | 1.0.0                                |
| Status       | Approved                             |
| Priority     | Critical                             |
| Type         | Modular folder (15 files)            |
| Created      | 2026-07-21                           |

---

## Architecture

```
Internet → Vercel → Next.js 15 → Supabase
                                    ├── PostgreSQL
                                    ├── Authentication
                                    ├── Storage
                                    ├── Realtime
                                    ├── Edge Functions
                                    ├── Database Functions
                                    └── Row Level Security (RLS)
```

---

## File Index

| File | Section | Description |
|------|---------|-------------|
| `README.md` | This file | Architecture overview, file index, principles |
| `01-Authentication.md` | Auth | Supabase Auth config, email/password, JWT, sessions, OAuth future |
| `02-Database.md` | Database | Core tables reference, schemas, relationships |
| `03-RLS.md` | Row Level Security | RLS policies for every table, role-based access |
| `04-Storage.md` | Storage | Buckets, policies, file upload flows, signed URLs |
| `05-Realtime.md` | Realtime | Subscriptions, channels, presence, broadcast |
| `06-Edge-Functions.md` | Edge Functions | verify-payment, send-email, health-check, webhooks |
| `07-Triggers.md` | Triggers | User created, payment confirmed, order shipped |
| `08-Database-Functions.md` | Functions | calculate_order_total, create_activity_log, verify_payment |
| `09-Indexes.md` | Indexes | All performance indexes with rationale |
| `10-Backups.md` | Backups | Daily/weekly/monthly backup strategy, restore testing |
| `11-Security.md` | Security | RLS, parameterized queries, CSP, CSRF, cookies, encryption |
| `12-Performance.md` | Performance | Indexes, pagination, RSC, caching, connection pooling |
| `13-Migrations.md` | Migrations | CLI workflow, naming, version control, rollback |
| `14-Environment.md` | Environment | All env vars with descriptions and sources |
| `15-OpenCode.md` | Build Prompt | Complete Supabase backend build directive |

---

## Design Principles

1. **RLS on every table** — no exceptions. Every query goes through RLS.
2. **Service role is server-only** — never in client code.
3. **Migrations before DDL** — never ad-hoc SQL on production.
4. **Typed queries** — TypeScript types generated from schema.
5. **Edge Functions for sensitive ops** — payment verification, webhooks.
6. **Audit logging** — every admin action logged, append-only.
7. **Soft deletes** — no data is ever truly deleted.
8. **No private keys** — platform never stores recovery phrases or private keys.

---

## Supabase Project Config

| Setting | Value |
|---------|-------|
| Project | TWallet Services (production) |
| Region | US East (or closest to user base) |
| Plan | Pro (scale as needed) |
| PG Version | 15+ |
| Extensions | pgcrypto, pg_graphql (dev), pg_cron (future) |

---

## References

- Book 08 — Database Schema (DDL for all 19 tables)
- Book 09 — Authentication System (login, register, sessions)
- Book 11 — Crypto Payments (Edge Function verification)
- Book 16 — API Specification (all endpoints consuming Supabase)
