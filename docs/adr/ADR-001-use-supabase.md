# ADR-001: Use Supabase as Backend Platform

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Services needs a backend platform providing: PostgreSQL database, authentication, file storage, serverless functions, and real-time capabilities. Options evaluated: Supabase, Firebase, custom Node.js + Postgres, AWS Amplify.

## Decision

Use Supabase as the primary backend platform.

## Rationale

- PostgreSQL (rather than Firebase's NoSQL) — relational data model fits orders/payments/wallets perfectly
- Built-in Auth (GoTrue) with email/password, OAuth, and future MFA
- Row Level Security — critical for multi-tenant data isolation
- Edge Functions (Deno) — secure server-side payment verification
- Storage with RLS-compatible policies
- Realtime subscriptions — order status and notification updates
- Generous free tier for development
- Growing ecosystem and community

## Consequences

- Vendor lock-in (mitigated by using standard PostgreSQL)
- Edge Functions use Deno (not Node.js) — team must learn Deno
- Supabase-specific features (RLS, Realtime) are not portable
