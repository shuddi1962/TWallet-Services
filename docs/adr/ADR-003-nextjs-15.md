# ADR-003: Use Next.js 15 with App Router

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Services needs a React framework supporting: server-side rendering, API routes, middleware, and optimal performance. Options evaluated: Next.js 15, Remix, Astro, plain React + Vite.

## Decision

Use Next.js 15 with App Router and React Server Components.

## Rationale

- App Router supports React Server Components — reduce client JS bundle
- Server Actions — form handling without API route boilerplate
- Middleware — route protection, session refresh, header injection
- Nested layouts — consistent UI across customer dashboard, admin panel
- Metadata API — SEO for marketing pages
- Vercel-native deployment — zero-config CI/CD
- Strong TypeScript support and large ecosystem

## Consequences

- RSC/Client boundary discipline required — not all code runs in browser
- Server Actions require careful security review (exposed as POST endpoints)
- Learning curve for RSC pattern (use client, use server directives)
