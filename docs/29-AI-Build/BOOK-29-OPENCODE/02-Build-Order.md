# Project Build Order

Build the project in this exact order. Each phase depends on the previous one.

## Phase 1: Foundation

```text
1. Project Setup
   - Initialize Next.js 15 with TypeScript strict
   - Install all dependencies
   - Configure Tailwind CSS, ESLint, Prettier
   - Set up project folder structure

2. Design Tokens
   - Implement color, typography, spacing, radius, shadow tokens
   - Create Tailwind config extension
   - See Book 20 — Design Tokens

3. Authentication
   - Set up Supabase Auth
   - Implement login, signup, email verification, password reset
   - Create middleware for route protection
   - See Book 09 — Authentication System
```

## Phase 2: Backend Infrastructure

```text
4. Database
   - Apply Supabase migrations (all 9 migrations)
   - Verify RLS on all tables
   - Generate TypeScript types
   - See Book 18 — Database SQL & Migrations

5. Storage
   - Configure 5 storage buckets with RLS policies
   - Implement signed URL pattern
   - See Book 17 — Supabase Architecture (Storage section)

6. Edge Functions
   - Implement verify-payment Edge Function
   - Implement admin Edge Functions
   - See Book 17 — Supabase Architecture (Edge Functions section)

7. Realtime
   - Configure Realtime channels for orders, notifications
   - Implement subscription cleanup patterns
   - See Book 17 — Supabase Architecture (Realtime section)
```

## Phase 3: Wallet & Payments

```text
8. Wallet Integration
   - Implement WalletConnect AppKit
   - Support MetaMask, Coinbase Wallet, Trust Wallet
   - 7 supported networks
   - See Book 10 — Wallet Integration

9. Crypto Payments
   - Implement payment verification in Edge Function
   - 10-step verification algorithm
   - Native + ERC-20 token handling
   - See Book 11 — Crypto Payments
```

## Phase 4: UI & Pages

```text
10. UI Component Library
    - Implement all 28 UI components
    - See Book 19 — Component Library

11. Landing Pages
    - Homepage, Pricing, Security, About, Contact
    - FAQ with schema, Blog with ISR
    - See Book 13 — Landing Page + Book 26 — SEO

12. Customer Dashboard
    - Overview, wallet, cards, orders, transactions
    - Profile, settings, support
    - See Book 14 — Customer Dashboard

13. Admin Dashboard
    - User management, orders, payments, cards
    - Reports, system settings, audit logs
    - See Book 15 — Admin Dashboard
```

## Phase 5: Integration & Polish

```text
14. API Integration
    - Connect all pages to Supabase queries
    - Implement Server Actions for mutations
    - Add rate limiting
    - See Book 16 — API Specification

15. Notifications
    - Email notifications via Resend
    - In-app notifications via Realtime
    - See Book 10A — Third-Party Integrations

16. Support Center
    - Ticket creation, management, resolution
    - See Admin + Customer dashboard books
```

## Phase 6: Quality

```text
17. Testing
    - Unit tests (Vitest, 90% coverage)
    - Integration tests (MSW, Server Actions)
    - E2E tests (Playwright, 13 journeys)
    - See Book 22 — Testing & QA

18. Performance Optimization
    - Core Web Vitals 95+
    - Bundle optimization
    - Database query tuning
    - See Book 25 — Performance Optimization

19. Security Audit
    - Verify RLS on every table
    - Verify input validation
    - Verify CSP headers
    - See Book 21 — Security & Compliance
```

## Phase 7: Deployment

```text
20. Deployment
    - Configure Vercel project and environment variables
    - Deploy Supabase Edge Functions
    - Configure custom domain
    - See Book 23 — DevOps & Deployment

21. Monitoring
    - Set up Sentry error tracking
    - Configure Uptime Robot
    - Set up dashboards
    - See Book 24 — Monitoring & Observability

22. Production Launch
    - Run pre-launch checklist
    - Smoke tests
    - Go live
    - See Book 30 — Production Launch Checklist
```
