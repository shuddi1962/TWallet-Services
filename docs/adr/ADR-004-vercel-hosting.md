# ADR-004: Use Vercel for Hosting

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Services needs hosting for a Next.js application with: global CDN, serverless functions, edge middleware, preview deployments, and simple CI/CD. Options evaluated: Vercel, AWS (Amplify/ECS), Netlify, Cloudflare Pages.

## Decision

Host on Vercel (Pro plan).

## Rationale

- Created by Next.js team — best-in-class Next.js support
- Edge Functions — global, low-latency middleware and API routes
- Preview deployments — every PR gets a unique URL with Supabase branch
- Automatic SSL, CDN, and performance optimizations
- Environment variable management with encryption
- Analytics + Web Vitals monitoring built in
- Team collaboration features

## Consequences

- Vendor lock-in to Vercel platform
- Pro plan cost ($20/mo per member)
- Serverless function cold starts (mitigated by Edge Functions + warming)
