# Task Execution Order

## Phase 1: Foundation (Days 1–3)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 1.1 | Initialize Next.js 15 project with TypeScript strict | None | Book 12 |
| 1.2 | Install all dependencies | 1.1 | AGENTS.md |
| 1.3 | Configure Tailwind, ESLint, Prettier | 1.1 | Book 04 |
| 1.4 | Create folder structure (src/, features/, etc.) | 1.1 | Book 28 |
| 1.5 | Implement design tokens (colors, spacing, etc.) | 1.4 | Book 20 |
| 1.6 | Set up Supabase project (local or remote) | 1.2 | Book 17 |
| 1.7 | Implement auth UI (login, signup, callback) | 1.5, 1.6 | Book 09 |
| 1.8 | Implement auth middleware | 1.7 | Book 09 |
| **Milestone:** User can sign up, verify email, and log in |

## Phase 2: Database & Backend (Days 4–7)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 2.1 | Apply all 9 Supabase migrations | 1.6 | Book 18 |
| 2.2 | Generate TypeScript types | 2.1 | Book 18 |
| 2.3 | Configure 5 storage buckets with RLS | 2.1 | Book 17 |
| 2.4 | Implement verify-payment Edge Function | 2.1 | Book 11 |
| 2.5 | Implement admin Edge Functions | 2.1 | Book 15 |
| 2.6 | Configure Realtime channels | 2.1 | Book 17 |
| **Milestone:** Database, storage, and Edge Functions operational |

## Phase 3: Wallet & Payments (Days 8–10)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 3.1 | Configure WalletConnect AppKit | 1.5 | Book 10 |
| 3.2 | Implement wallet connect/disconnect | 3.1 | Book 10 |
| 3.3 | Implement network switching | 3.1 | Book 10 |
| 3.4 | Implement payment verification flow | 2.4, 3.2 | Book 11 |
| 3.5 | Implement payment state machine | 3.4 | Book 11 |
| **Milestone:** User can connect wallet, make payment, receive confirmation |

## Phase 4: UI & Pages (Days 11–20)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 4.1 | Build all 28 UI components | 1.5 | Book 19 |
| 4.2 | Build landing pages (home, pricing, about, etc.) | 4.1 | Book 13 |
| 4.3 | Blog with ISR | 4.1 | Book 26 |
| 4.4 | FAQ with schema | 4.1 | Book 26 |
| 4.5 | Customer dashboard (overview, wallet, cards) | 4.1, 3.2 | Book 14 |
| 4.6 | Orders + transaction history | 4.5, 3.4 | Book 14 |
| 4.7 | Profile + settings | 4.5 | Book 14 |
| 4.8 | Admin dashboard (users, orders, payments) | 4.1, 3.4 | Book 15 |
| 4.9 | Admin reports + settings | 4.8 | Book 15 |
| 4.10 | Support center | 4.5 | Book 15 |
| 4.11 | Notifications (in-app + email) | 2.6, 10 | — |
| **Milestone:** All pages functional, connected to backend |

## Phase 5: Quality & Testing (Days 21–25)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 5.1 | Write unit tests (utilities, schemas, actions) | All previous | Book 22 |
| 5.2 | Write integration tests (API, Server Actions) | All previous | Book 22 |
| 5.3 | Write E2E tests (13 critical journeys) | All previous | Book 22 |
| 5.4 | Performance optimization | All previous | Book 25 |
| 5.5 | Security audit (RLS, validation, headers) | All previous | Book 21 |
| 5.6 | Accessibility audit (WCAG 2.1 AA) | All previous | Book 22 |
| **Milestone:** All quality gates pass |

## Phase 6: Deployment (Days 26–30)

| Step | Task | Dependencies | Book Reference |
|------|------|--------------|----------------|
| 6.1 | Configure Vercel project + env vars | All previous | Book 23 |
| 6.2 | Configure custom domain + SSL | 6.1 | Book 23 |
| 6.3 | Deploy Supabase Edge Functions | 2.4, 2.5 | Book 23 |
| 6.4 | Configure Sentry error tracking | 6.1 | Book 24 |
| 6.5 | Configure Uptime Robot | 6.2 | Book 24 |
| 6.6 | Configure backups | 6.1 | Book 23 |
| 6.7 | Run pre-launch checklist | All previous | Book 30 |
| 6.8 | Production launch | 6.7 | Book 30 |
| **Milestone:** Platform live in production |

## Acceptance Criteria Per Milestone

### Milestone: Auth Works
- User can register with email
- User receives verification email
- User can log in
- Protected routes redirect unauthenticated users
- Middleware guards all /app and /admin routes

### Milestone: Backend Operational
- Database has all 19 tables with RLS
- Storage buckets configured with policies
- verify-payment Edge Function returns correct results
- Realtime channels deliver events

### Milestone: Wallet + Payments Work
- User can connect MetaMask, Coinbase Wallet, Trust Wallet
- Network switching works for all 7 supported networks
- Payment verification completes within 5 seconds
- Order state machine transitions correctly

### Milestone: All Pages Functional
- Landing pages render with correct content and metadata
- Dashboard shows user data from Supabase
- Orders can be created, viewed, cancelled
- Admin can manage users, orders, payments
- Support tickets can be created and resolved

### Milestone: Quality Gates Pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run test` — 90%+ coverage
- `npm run test:e2e` — all 13 journeys pass
- `npm run build` — succeeds

### Milestone: Production Live
- Custom domain resolves
- HTTPS active
- Sentry capturing errors
- Uptime Robot monitoring
- Backups running
- Deployment rollback tested
