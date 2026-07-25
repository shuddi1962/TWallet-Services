# TWallet Services — Implementation Tasks

100 tasks organized into 6 phases. Execute in order within each phase; phases may overlap.

## Phase 1 — Foundation (001–015)

Project scaffold, config, CI/CD, design tokens, component library, data layer.

| # | Task | Status |
|---|------|--------|
| 001 | Next.js 15 App Router scaffold + TypeScript strict config | ✅ |
| 002 | Tailwind CSS + design tokens integration | ✅ |
| 003 | Supabase client setup (server + browser + middleware) | ✅ |
| 004 | CI/CD pipeline (GitHub Actions — lint → typecheck → test → build) | ✅ |
| 005 | UI component library — Button, Input, Card, Badge, Avatar | ✅ |
| 006 | UI component library — Select, Checkbox, Switch, Tabs, Accordion | ✅ |
| 007 | UI component library — Dialog, Drawer, Dropdown, Tooltip | ✅ |
| 008 | UI component library — Table, DataGrid, Pagination | ✅ |
| 009 | UI component library — Skeleton, EmptyState, Toast, Alert, Spinner | ✅ |
| 010 | UI component library — Timeline, Chart, WalletCard, PaymentCard | ✅ |
| 011 | Database schema — 19 tables with enums, constraints, indexes | ✅ |
| 012 | Row Level Security policies on all tables | ✅ |
| 013 | Database functions + triggers (updated_at, handle_new_user, etc.) | ✅ |
| 014 | Storage buckets (id-verification, card-artwork, avatars, etc.) | ✅ |
| 015 | Seed data (networks, tokens, card products, system settings, admin) | ✅ |

## Phase 2 — Backend (016–030)

Auth, API, Edge Functions, email, admin actions.

| # | Task | Status |
|---|------|--------|
| 016 | Auth — signUp, signIn, signOut server actions | ✅ |
| 017 | Auth — email verification, password reset, forgot password | ✅ |
| 018 | Auth — middleware (protected routes, admin routes) | ✅ |
| 019 | Edge Function — verify-payment (on-chain verification) | ✅ |
| 020 | Edge Function — transition-order (state machine) | ✅ |
| 021 | Edge Function — send-email (Resend integration) | ✅ |
| 022 | Edge Function — send-notification (in-app) | ✅ |
| 023 | Edge Function — order-status, health-check, generate-report | ✅ |
| 024 | Rate limiting (Upstash Redis) on auth + order + payment actions | ✅ |
| 025 | Email templates (welcome, password-reset, order, payment) | ✅ |
| 026 | Admin — user management (list, suspend, reactivate) | ✅ |
| 027 | Admin — order management (state machine, status update) | ✅ |
| 028 | Admin — payment management (verify, refund) | ✅ |
| 029 | Admin — card management | ✅ |
| 030 | Admin — analytics, reports, audit log | ✅ |

## Phase 3 — Wallet & Payments (031–040)

WalletConnect, wagmi, on-chain payments.

| # | Task | Status |
|---|------|--------|
| 031 | Wallet provider setup (wagmi + Web3Modal) | ✅ |
| 032 | Wallet connection component (MetaMask, Coinbase, Trust, WalletConnect) | ✅ |
| 033 | Network switching + chain detection | ✅ |
| 034 | Payment checkout page — transaction submission | ✅ |
| 035 | Payment verification polling + confirmation UI | ✅ |
| 036 | Transaction history + status display | ✅ |
| 037 | Supported tokens + balances display | ✅ |
| 038 | Gas estimation + fee display | ✅ |
| 039 | Webhook-blockchain edge function | ✅ |
| 040 | Double-spend protection + failed payment recovery | ✅ |

## Phase 4 — UI & Pages (041–065)

Public pages, dashboard, admin dashboard.

| # | Task | Status |
|---|------|--------|
| 041 | Landing page — Hero + Features + Stats | ✅ |
| 042 | Landing page — How It Works + Card Showcase + Wallets | ✅ |
| 043 | Landing page — Pricing + Testimonials + FAQ + CTA + Footer | ✅ |
| 044 | Public pages — /cards, /pricing, /how-it-works, /about, /faq, /support, /contact | ✅ |
| 045 | Auth pages — Login, Register, Forgot/Reset Password, Verify Email | ✅ |
| 046 | Dashboard layout — sidebar navigation + header + responsive | ✅ |
| 047 | Dashboard overview — stats cards + recent activity + charts | ✅ |
| 048 | Dashboard — wallet page (connect, balance, tokens, transactions) | ✅ |
| 049 | Dashboard — cards page (list, details, status) | ✅ |
| 050 | Dashboard — order new page (card selection, customization) | ✅ |
| 051 | Dashboard — order detail page (status, timeline, actions) | ✅ |
| 052 | Dashboard — order payment page (crypto checkout, confirmation) | ✅ |
| 053 | Dashboard — order tracking page (delivery status) | ✅ |
| 054 | Dashboard — transactions page (filter, search, export) | ✅ |
| 055 | Dashboard — notifications page (list, mark read, preferences) | ✅ |
| 056 | Dashboard — settings page (profile, security, 2FA) | ✅ |
| 057 | Dashboard — support page (tickets, chat) | ✅ |
| 058 | Admin layout — collapsible sidebar + header + search | ✅ |
| 059 | Admin — overview (8 stat cards + tables) | ✅ |
| 060 | Admin — users (searchable table, inline suspend/reactivate) | ✅ |
| 061 | Admin — orders (state machine dropdown, filter) | ✅ |
| 062 | Admin — payments (block explorer links, verify) | ✅ |
| 063 | Admin — cards, settings, audit logs, analytics, reports | ✅ |
| 064 | Responsive design pass (all breakpoints) | ✅ |
| 065 | Accessibility pass (WCAG 2.1 AA, aria, landmarks, focus) | ✅ |

## Phase 5 — Integration (066–080)

Testing, edge function wiring, end-to-end flows.

| # | Task | Status |
|---|------|--------|
| 066 | Test infrastructure (MSW, Playwright, vitest setup) | ✅ |
| 067 | Unit tests — validations, errors, cards, auth actions, admin actions | ✅ |
| 068 | Integration tests — auth flow (signup → signin → password reset) | ✅ |
| 069 | Integration tests — error paths (invalid, expired, rate-limited) | ✅ |
| 070 | E2E — auth registration flow | ✅ |
| 071 | E2E — wallet connection flow | ✅ |
| 072 | E2E — card ordering flow | ✅ |
| 073 | E2E — admin CRUD flow | ✅ |
| 074 | Edge Function → Resend email integration (all templates) | ✅ |
| 075 | Edge Function → Supabase DB integration (order state transitions) | ✅ |
| 076 | Wallet → Payment page end-to-end flow | ✅ |
| 077 | Admin → Edge Function → Email notification chain | ✅ |
| 078 | Rate limiter end-to-end verification | ✅ |
| 079 | Error boundary, loading states, not-found pages | ✅ |
| 080 | Webhook → payment confirmation → order update flow | ✅ |

## Phase 6 — Deployment (081–100)

Vercel deploy, production DB, domain, monitoring, launch.

| # | Task | Status |
|---|------|--------|
| 081 | Vercel project setup + production deployment | ✅ |
| 082 | Custom domain + SSL (twalletservices.com) | ✅ |
| 083 | Supabase production project provisioned | ✅ |
| 084 | Production migrations applied + RLS verified | ✅ |
| 085 | Environment variables configured (all services) | ✅ |
| 086 | WalletConnect production project + Alchemy production keys | ✅ |
| 087 | Sentry error tracking (frontend + Edge Functions) | ✅ |
| 088 | Resend email production domain verified | ✅ |
| 089 | Upstash Redis production instance | ✅ |
| 090 | PostHog analytics configured | ✅ |
| 091 | Monitoring — uptime monitoring + alerting | ⏳ config ready, manual UI setup needed |
| 092 | Monitoring — database backups (PITR + daily pg_dump) | ⏳ CI backup created; Free plan, upgrade to Pro ($25/mo) for daily backups |
| 093 | Monitoring — dashboard creation (ops, business, payments) | ⏳ docs ready, manual Sentry + PostHog UI setup needed |
| 094 | Load testing + performance optimization | ✅ |
| 095 | Security — penetration test + dependency audit | ⏳ plan documented, schedule externally |
| 096 | Security — CSP, HSTS, security headers final review | ✅ |
| 097 | Documentation — runbooks, on-call guide, postmortem template | ✅ |
| 098 | Production readiness review + go/no-go checklist | ✅ |
| 099 | v1.0 release tag + changelog finalization | ✅ |
| 100 | Launch — monitor, support, post-launch review | ✅ |

**Legend:** ✅ Done · ⏳ Pending · ❌ Blocked

## Build Order

```text
Phase 1 (Foundation)    ───▶ Phase 2 (Backend)
                                │
                                ▼
                          Phase 3 (Wallet & Payments)
                                │
                                ▼
                          Phase 4 (UI & Pages)
                                │
                                ▼
                          Phase 5 (Integration)
                                │
                                ▼
                          Phase 6 (Deployment)
```

Each phase depends on the previous. Within a phase, tasks may be parallelized where no dependency exists.

## References

- `docs/MASTER_INDEX.md` — main entry point for all documentation
- `docs/ARCHITECTURE.md` — system architecture overview
- `docs/BOOK-01/BOOK_01_PROJECT_FOUNDATION.md` — project foundation book
- `AGENTS.md` — AI agent instructions and project conventions
