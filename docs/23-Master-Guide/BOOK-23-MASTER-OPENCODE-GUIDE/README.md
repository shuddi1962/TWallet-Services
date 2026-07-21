# Book 23 — Master OpenCode Implementation Guide

> **TWallet Services · TWallet Card**
> The final, comprehensive build directive that integrates all 22 previous books into a single implementation sequence. An OpenCode agent or developer can follow this guide to build the entire platform.

---

## Document Control

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Book         | 23 — Master OpenCode Guide           |
| Version      | 1.0.0                                |
| Status       | Approved                             |
| Priority     | Critical                             |
| Type         | Implementation sequence               |
| References   | Books 01–22                          |

---

## Prerequisites

Before starting, read the following foundation books:

| Book | Title | Why |
|------|-------|-----|
| 01 | Project Foundation | Vision, scope, constraints |
| 02 | Business Requirements | Functional requirements, rules |
| 03 | Information Architecture | Route structure, navigation |
| 04 | Design System | Visual tokens, component APIs |
| 12 | System Architecture | Folder structure, RSC vs Client, patterns |

---

## Implementation Sequence

### Phase 1: Foundation (Day 1–2)

**Step 1 — Scaffold Next.js project**
```bash
npx create-next-app@latest twallet-services --typescript --tailwind --app --src-dir
cd twallet-services
npm install @supabase/supabase-js @supabase/ssr @radix-ui/* lucide-react framer-motion recharts
npm install class-variance-authority clsx tailwind-merge zod react-hook-form @hookform/resolvers
npm install viem wagmi @wagmi/core @web3modal/wagmi @web3modal/react
npm install @sentry/nextjs resend
npm install -D vitest @playwright/test
```

**Step 2 — Configure Tailwind, fonts, globals.css** (Book 04, Book 20)
- Set up `tailwind.config.ts` with custom colors, radii, shadows, fonts
- Create `globals.css` with CSS variables
- Add Inter + JetBrains Mono fonts in `layout.tsx`

**Step 3 — Set up Supabase project** (Book 17)
- Create Supabase project
- Link local `supabase` directory
- Configure Auth settings (email confirmations, password rules)
- Set environment variables

**Step 4 — Apply database schema** (Book 08 + Book 18)
```bash
supabase migration new initial_schema
# Copy schema.sql content
supabase migration up
supabase gen types typescript --local > src/types/supabase.ts
```

**Step 5 — Create Supabase client files** (Book 17)
- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/admin.ts`

**Step 6 — Create utility files**
- `src/lib/utils.ts` (cn helper)
- `src/lib/api/response.ts`, `require-auth.ts`, `rate-limit.ts`, `pagination.ts`, `audit.ts`
- `src/lib/zod/schemas.ts`

### Phase 2: Auth (Day 3–4)

**Step 7 — Build auth UI** (Book 09)
- `/auth/login` page
- `/auth/register` page
- `/auth/verify` page
- `/auth/forgot-password` page
- `/auth/reset-password` page

**Step 8 — Build auth API routes** (Book 16 — 01-Authentication.md)
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/forgot-password`
- POST `/api/v1/auth/verify-email`
- GET `/api/v1/auth/session`

**Step 9 — Create middleware** (Book 17)
- Route protection for `/app/*` and `/admin/*`

### Phase 3: Public Pages (Day 5–6)

**Step 10 — Landing page** (Book 13)
- All 22 section components: Hero, CardShowcase, Features, Pricing, FAQ, etc.

**Step 11 — Public API routes**
- GET `/api/v1/cards` (Book 16 — 04-Cards.md)
- GET `/api/v1/cards/{slug}`
- GET `/api/v1/wallets/networks`
- GET `/api/v1/system/health`, `/api/v1/system/version`, `/api/v1/system/status`

### Phase 4: Customer Dashboard (Day 7–10)

**Step 12 — Build shared UI components** (Book 19)
- Button, Input, Card, Badge, Modal, DataTable, Tabs, Toast, Skeleton, EmptyState, Form

**Step 13 — Build customer dashboard** (Book 14)
- `/app` layout with sidebar + top nav
- `/app` overview page with stats + widgets
- `/app/wallet` wallet connection page
- `/app/cards` card browsing + ordering
- `/app/orders` order history + detail
- `/app/transactions` transaction history
- `/app/notifications` notification center
- `/app/support` ticket management
- `/app/profile` profile + preferences
- `/app/settings` settings page
- `/app/security` security center

**Step 14 — Build customer API routes** (Book 16)
- All Users, Wallets, Cards, Orders, Payments, Transactions, Notifications, Support, Uploads endpoints

### Phase 5: Admin Dashboard (Day 11–14)

**Step 15 — Build admin dashboard** (Book 15)
- `/admin` layout with collapsible sidebar
- `/admin` overview with 8 stat cards + 6 widgets + 5 charts
- `/admin/users` user management
- `/admin/roles` role management
- `/admin/cards` card product CRUD
- `/admin/orders` order management with 20+ columns
- `/admin/payments` payment monitoring
- `/admin/wallets` wallet management
- `/admin/support` ticket queue
- `/admin/notifications` admin alerts
- `/admin/reports` report generation
- `/admin/settings` system settings
- `/admin/audit` audit logs
- `/admin/health` system health

**Step 16 — Build admin API routes** (Book 16 — 11-Admin.md)
- All admin endpoints with RBAC enforcement

### Phase 6: Backend (Day 15–17)

**Step 17 — Deploy Edge Functions** (Book 17)
- `verify-payment` — on-chain verification with viem + Alchemy
- `send-email` — transactional emails via Resend
- `health-check` — system monitoring
- Set Edge Function secrets

**Step 18 — Configure Storage** (Book 17)
- Create 5 buckets with RLS policies
- Build upload API routes (Book 16 — 10-Uploads.md)

**Step 19 — Configure Realtime** (Book 17)
- Enable replication on notification/order/ticket tables
- Build subscription hooks in client components

### Phase 7: Integration & Testing (Day 18–20)

**Step 20 — Webhooks** (Book 16 — 14-Webhooks.md)
- WalletConnect, Blockchain (Alchemy), Email (Resend), Storage, Shipping

**Step 21 — Write tests** (Book 21)
- Unit tests for all Zod schemas, utilities, state machines
- Integration tests for all API routes + RLS
- E2E tests for 7 critical flows
- A11y tests for all pages

**Step 22 — Generate API contracts**
```bash
npm run gen:api:all
# Generates: TypeScript types, Zod schemas, API client, Scalar docs
```

### Phase 8: Polish (Day 21–22)

**Step 23 — Animations** (Book 14 animation specs, Framer Motion)
**Step 24 — SEO** (meta tags, sitemap, robots.txt, JSON-LD)
**Step 25 — Performance optimization** (Lighthouse budgets, ISR, image optimization)
**Step 26 — Security audit** (RLS verification, CSP headers, rate limiting)

---

## File Structure (Final)

```
src/
├── app/
│   ├── (marketing)/     → Landing page
│   ├── auth/             → Login, register, verify, reset
│   ├── app/              → Customer dashboard
│   ├── admin/            → Admin dashboard
│   └── api/v1/           → 65+ REST endpoints
├── components/
│   ├── ui/               → 30+ reusable components
│   ├── landing/          → Landing page components
│   ├── dashboard/        → Customer dashboard components
│   └── admin/            → Admin dashboard components
├── lib/
│   ├── supabase/         → Client, server, admin
│   ├── api/              → Response, auth, rate-limit, pagination
│   └── zod/              → Validation schemas
├── types/                → Generated Supabase + API types
├── hooks/                → Custom React hooks
└── integrations/         → Alchemy, Resend, WalletConnect

supabase/
├── functions/            → Edge Functions
├── migrations/           → Versioned SQL migrations
└── seed.sql              → Development seed data

contracts/                → OpenAPI 3.1 YAML files
```

---

## Verification Checklist

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run typecheck` passes with strict mode
- [ ] `npm run test` — all unit + integration tests pass
- [ ] `npm run test:e2e` — all 7 critical flows pass
- [ ] Lighthouse scores ≥ 90 in all categories
- [ ] WCAG 2.1 AA automated checks pass
- [ ] RLS verified on every table (no leaks)
- [ ] All 65+ API endpoints respond correctly
- [ ] Rate limiting works (429 on abuse)
- [ ] CSP headers present on all responses
- [ ] Sentry error tracking active
- [ ] Backups configured + tested
- [ ] Edge Functions deployed + responding
- [ ] OpenAPI docs served at `/api/docs`
- [ ] All environment variables set in Vercel
- [ ] `AGENTS.md` commands all work

---

## Build Commands

```bash
# Development
npm run dev           # Start dev server (localhost:3000)
supabase start        # Start local Supabase

# Verify
npm run lint          # ESLint check
npm run typecheck     # TypeScript check (tsc --noEmit)
npm run test:run      # Vitest run

# Deploy
npm run build         # Production build
vercel deploy         # Deploy to Vercel
supabase db push      # Push migrations
supabase functions deploy  # Deploy Edge Functions
```
