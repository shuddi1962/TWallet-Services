# ADR-006: Role-Based Access Control (RBAC) Model

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Services requires different access levels for: customers (self-service), support agents (ticket management), operations (order/shipping management), finance (payment/refund management), administrators (user/system management), and super administrators (full access). Options evaluated: RBAC, ABAC (Attribute-Based), ReBAC (Relationship-Based).

## Decision

Use Role-Based Access Control (RBAC) with three enforcement layers: Next.js middleware (route), Server Actions (permission), Supabase RLS (row).

## Rationale

- RBAC is simplest to implement and audit
- Six roles cover all personas without complexity
- Three enforcement layers provide defense in depth
- RLS policies match RBAC roles via `current_user_role()` helper function
- Least privilege is natural — each role has minimum permissions
- Deny-by-default — no role means no access

## Consequences

- Role changes require updating three layers (middleware, permissions, RLS)
- Adding new roles requires DB migration + policy updates
- ABAC would be more flexible but adds complexity not yet needed
