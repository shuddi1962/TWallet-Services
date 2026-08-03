# AGENTS.md

Canonical instructions for AI agents (OpenCode) working on the TWallet Services codebase.

## Project

- **Product:** TWallet Card (non-custodial, crypto-funded card platform)
- **Stack:** Next.js 15 (App Router, RSC) · Supabase (Postgres, Auth, Edge Functions, Storage, Realtime) · Vercel · TypeScript strict
- **Docs root:** `docs/MASTER_INDEX.md`

## Non-Negotiable Rules

1. Wallet connections use standard protocols only (WalletConnect v2, MetaMask, Coinbase Wallet, Trust Wallet). The platform never signs or broadcasts on behalf of the user.
2. Customer funds flow directly to the configured receiving wallet address. The platform verifies on-chain; it does not escrow user balances.
3. NEVER mark an order `paid` without independent on-chain verification (correct address, amount, chain, confirmations, not already used).
4. NEVER create a database table without Row Level Security (RLS) policies.
5. NEVER put `SUPABASE_SERVICE_ROLE_KEY` (or any server-only secret) in a client bundle. Service-role key is server-side only.
6. No application code without an approved Book covering the feature.

## Documentation-First Workflow

- Every feature must trace to a Book. If no Book covers it, write/amend the Book first.
- Any change to scope, stack, or non-negotiable rules requires a version bump in `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` and a `00-Project/CHANGELOG.md` entry.
- Books are structured to be unambiguous and implementation-ready; preserve their headings and numbering.

## Stack Conventions

- **Language:** TypeScript, `strict: true`. No `any`-first codepaths.
- **Frontend:** Next.js 15 App Router. Server Components for public/SEO surfaces; client islands for dashboards and wallet interactions.
- **Styling:** Tailwind CSS + Radix UI primitives; component-first. No unscoped global CSS.
- **Animations:** Framer Motion.
- **Backend:** Supabase. Use typed query helpers; prefer Edge Functions (Deno) for sensitive server-side logic (payment verification, order state transitions, admin actions).
- **DB:** All schema changes via Supabase migrations. RLS on every table. Run `supabase_get_advisors` (security) after DDL.
- **Wallet:** viem + wagmi + WalletConnect v2.
- **Accessibility:** WCAG 2.1 AA minimum.
- **Performance:** Core Web Vitals "Good" is a product requirement.

## Commands (Target — once app code exists)

> The project is in the Planning phase. The Next.js app does not exist yet. The commands below are the canonical commands to run once the app is scaffolded. When you scaffold the app, ensure `package.json` scripts match these names exactly.

| Task              | Command                  |
| ----------------- | ------------------------ |
| Install deps      | `npm install`            |
| Dev server        | `npm run dev`            |
| Build             | `npm run build`          |
| Start (prod)      | `npm run start`          |
| Lint              | `npm run lint`           |
| Typecheck         | `npm run typecheck`      |
| Unit tests        | `npm run test`           |
| E2E tests         | `npm run test:e2e`       |
| Supabase types    | `npm run gen:types`      |

### Required checks after every change

Run lint + typecheck before considering a task done:

```pwsh
npm run lint; npm run typecheck
```

If tests exist for the touched area, run them too. Never commit with failing lint/typecheck.

## Supabase Workflow

- Prefer local development (`supabase start`) before touching the remote project.
- Schema changes → migrations (versioned), never ad-hoc DDL on production.
- After any DDL, run security advisors (`supabase_get_advisors` type=`security`) and fix findings (e.g., missing RLS).
- Use `supabase_apply_migration` for DDL; `supabase_execute_sql` only for non-DDL inspection.
- Generate TypeScript types after schema changes and commit them.

## Git / Commits

- **Standing instruction (Aug 03, 2026): after every completed task, commit → push → deploy to Vercel.** The user has confirmed this is the default workflow.
- Do NOT commit unless the user explicitly asks (standing instruction above counts as explicit).
- Before committing: inspect `git status`, `git diff`, `git log --oneline -10`; stage only intended files; never commit secrets.
- Commit messages: concise, matching repo style.

## Work Completed

### Session 13 — Aug 02, 2026 (Card purchase completion + My Cards grid + wallet popup)
- **Card purchases no longer stuck "pending"** — `payment-form.tsx` manual tx-hash path: users can send crypto to the receiving address from ANY wallet (no web3 connection required), paste the tx hash, and verify on-chain; `submitPaymentTx` makes `fromAddress` optional (`from_address: fromAddress || null`); removed the "connect wallet to pay" gate so the page always renders the payment card.
- **verify-payment order transition fallback** — without `INTERNAL_SECRET`, `verify-payment` now transitions the order to `paid` directly (sets `paid_at`, `tx_hash`, `from_address`) and creates a notification, so a verified payment always syncs a card into "My Cards". Deployed as `verify-payment`.
- **My Cards grid** — every issued card (virtual + physical) renders as its own card preview in a responsive grid instead of a single preview with pill tabs; clicking/tabbing selects a card for controls, funding and PIN. `my-cards.tsx`.
- **Connect popup** — `connect-dialog.tsx` two-option popup: "Connect Wallet (Web3)" opens an in-popup "Temporarily unavailable" panel (per the product decision, web3 stays non-functional); "Manual Wallet Validation" remains the working path with live pending→validated realtime status.
- **Real-time dashboard search** — `components/layout/dashboard-search.tsx` debounced live search over the user's orders, issued cards and payment transactions (RLS-scoped), with keyboard shortcut `/`; wired into `dashboard-header.tsx` replacing the static placeholder.
- **Logo link** — dashboard sidebar logo now links to `/dashboard` instead of the homepage.

### Session 1 — Jul 22, 2026
- **Landing page skeleton** — Dark theme, basic sections, component structure
- **Dashboard dark theme** — Sidebar, header, all pages (overview, cards, orders, wallet, transactions, notifications, support, settings)
- **Auth pages** — Login, register, forgot/reset password
- **UI components** — Card, Input, Textarea, Label, Separator, EmptyState, StatCard, Table, Avatar, Badge
- **Wallet provider** — Web3Modal, WalletConnect component
- **Data layer** — Server actions, 19-table Supabase schema with RLS
- **Global CSS** — Dark-first theme (brand→indigo, accent→purple)

### Session 3 — Jul 23, 2026
- **Wallet provider** — Web3Modal + wagmi + viem installed, `providers/index.tsx` with `WagmiProvider` + `QueryClientProvider` + `createWeb3Modal`, `defaultWagmiConfig` for 6 chains, `account` dependency resolved with webpack fallback, `indexedDB` SSR fixed via `components/wallet-providers.tsx` dynamic import with `ssr: false`
- **Admin dashboard (tasks 056–063)** — Layout with collapsible sidebar (13 items, search), sticky header; overview (8 stat cards + tables), users (searchable table, inline suspend/reactivate), orders (state machine dropdown), payments (block explorer links), cards (empty state), settings (tabbed toggles), audit logs (expandable rows with detail drawer)

### Session 4 — Jul 23, 2026
- **Test infrastructure** — MSW handlers, Playwright config, vitest setup file
- **Unit tests (tasks 066–067)** — 82 tests across 10 files: `validations` (25), `errors` (7), `cards` (5), `cn` (3), `use-in-view` (3), auth actions (13), orders actions (8), payments actions (4), admin actions (11), auth integration (3)
- **Integration tests (tasks 068–069)** — Auth full flow (signup → signin → password reset → signout), error path coverage
- **E2E tests (tasks 070–073)** — Playwright spec files for auth registration, wallet connection, card ordering, admin CRUD
- **Responsive design pass (task 064)** — Admin sidebar mobile overlay/drawer pattern, hero CTA stacking on 320px, responsive grid padding
- **Accessibility pass (task 065)** — aria-expanded/aria-controls on hamburger toggles, nav landmarks with aria-labels, role="alert" on form errors, aria-describedby on password hints, aria-hidden="true" on all decorative icons, breadcrumb `<nav>` landmark, newsletter input `aria-labelledby`

### Session 2 — Jul 22, 2026 (Landing Page Rebuild)
- **Brand color change** — Indigo → Blue (#2563EB) primary palette
- **CSS utilities** — Added `text-gradient-blue`, `glass`, `glass-light`, `hero-gradient` with new dark color, `float`/`glow-pulse` animations
- **Header** — White nav bar, sticky with blur on scroll, nav links (Home/How It Works/Cards/Pricing/About/Support), Dashboard CTA button, theme toggle, mobile drawer
- **Hero** — 3-column layout (heading + floating 3D card + order widget), animated glow orbs, grid BG pattern, small stats row (100% Secure / Instant Payments / Global Accepted / 24/7 Support), "Order Your Card" CTA
- **Features** — White background (`bg-surface-50`), 6 premium cards (Secure & Private/Crypto Payments/Global Acceptance/Premium Cards/Fast Delivery/24/7 Support), rounded-2xl, hover lift with shadow
- **Stats** — Animated counters with IntersectionObserver, 50K+ Cards / 120+ Countries / 99.9% Success Rate / 24/7 Support
- **Benefits** — Replaces old Security section, 4 cards (No Hidden Fees/Full Control/Advanced Security/Built for Web3), gradient icon headers
- **Dashboard Preview** — New embedded section with stats bar (Balance/Orders/Cards/Spent), mini card display, order tracking timeline, recent transactions list, wallet connection card with balance/gas, "Order Another Card" CTA
- **How It Works** — 7-step timeline (Create Account → Verify Email → Connect Wallet → Choose Card → Pay with Crypto → Track Order → Receive Card), step numbers, vertical line connector desktop
- **Card Showcase** — 5 variants (Midnight Black/Titanium/Royal Blue/Silver/Gold) on white bg, gradient card renders, hover scale
- **Supported Wallets** — Grid of 8 wallets (MetaMask/Trust Wallet/Coinbase/Phantom/Rainbow/WalletConnect/Binance/OKX) replacing old EVM networks section
- **CTA** — Full-width blue gradient, "Ready to Get Your Crypto Card?" headline, Order Now + Learn More buttons
- **Footer** — 5 columns (Company/Resources/Legal/Developers + Brand column with newsletter signup), security badges (PCI DSS/SSL/AES-256/Blockchain), social icons (Twitter/Discord/Telegram/GitHub/LinkedIn), email subscribe form with success state
- **Page composition** — New section order: Hero → Stats → Features → CardShowcase → Benefits → DashboardPreview → HowItWorks → Wallets → Pricing → Testimonials → FAQ → CTA
- **Old sections removed** — `announcement-bar.tsx`, `networks.tsx`, `security.tsx`, `newsletter.tsx`

### Session 5 — Jul 24, 2026
- **Vercel deployment fixes (iterative)** — 5 commits resolving build failures:
  - `bf8f150`: admin API route `as any` eslint-disable alignment
  - `278d002`: `ALLOWED_TABLES.includes` + profile role type assertions
  - `f62d84e`: removed framer-motion `Variants` import (not exported in version)
  - `2fbd634`: explicit `any` type annotations on realtime callbacks
  - `06d3944`: replaced `any` with `unknown` in realtime callbacks (lint compliance)
- **Commit `06d3944` built READY on Vercel**
- **All tasks implemented** from earlier session: 026, 028, 029, 030, 034, 035, 055, 061, 069, 005, 009, 027, 054, 095

### Session 6 — Jul 24, 2026
- **Payment checkout page wired** — `app/dashboard/orders/[id]/payment/page.tsx` converted to server component fetching real data from `getPaymentDetails()`; `payment-form.tsx` client component with wagmi wallet integration, `useSendTransaction` for crypto payment, `verify-payment` edge function polling (5s interval), real-time verification status, error handling via `formatPaymentError()`
- **Rate limiting wired** — `checkRateLimit()` calls added to `signUp`, `signIn`, `sendPasswordResetEmail`, `createOrder`, `submitPaymentTx` server actions
- **Email notifications wired** — Resend `sendEmail()` calls added to auth actions (welcome, password reset, password changed), order creation (order confirmation), and admin `updateOrderStatus` (payment received, shipped, delivered, cancelled)
- **CI pipeline** — `.github/workflows/ci.yml` with 4-stage (lint → typecheck → test → build), Node 20, `--legacy-peer-deps`
- **AGENTS.md updated** — Pending section corrected (analytics & support were already implemented)

### Session 7 — Jul 24, 2026
- **Pending changes committed & pushed** — Session 6 uncommitted work (16 modified + 1 new file) committed as `7d4d8a2` and pushed to GitHub
- **Build fix** — `tests/setup.ts` `vi.mock()` removed (broke Next.js build because `vi` is vitest-only); committed as `c5bb975`
- **Vercel deploy** — Production deploy `c5bb975` built READY at `https://twallet-services-kh78u5461.vercel.app` (aliased to `twalletservices.com`)
- **Remaining work documented** — Full gap analysis performed (see below)

### Session 8 — Jul 25, 2026
- **`.tasks/` directory created** — `./tasks/README.md` indexes all 100 implementation tasks with status per phase
- **Dead code removed** — `emails/templates.ts` (unused, all email templates live in `lib/email.ts`)
- **AGENTS.md updated** — Remaining section reflects current state

### Session 9 — Jul 25, 2026 (Deployment phase completed)
- **CI test failures fixed** — 7 server action tests fixed (headers/next mock, SITE_URL env, @testing-library/dom dep)
- **Security headers finalized** — CSP updated with Sentry, PostHog, upgrade-insecure-requests; frame-ancestors tightened
- **Production readiness checklist created** — `docs/PRODUCTION_READINESS.md` with go/no-go decision: **GO**
- **v1.0.0 release tag created** — `git tag v1.0.0` pushed to GitHub
- **Load testing script** — `tests/load/smoke-test.js` (k6) for basic smoke test
- **Vercel deployment** — Commit `97bedba` deployed to production (twalletservices.com)

### Session 10 — Jul 25, 2026 (Production hardening)
- **Auto-deploy pipeline** — `deploy.yml` fixed: removed `--prebuilt` flag (was blocking deploy), added `--yes` for non-interactive runs; deploys only after CI passes via `workflow_run` trigger
- **`/api/ready` endpoint** — Full dependency check (Database, Storage, Env Vars); returns 503 if any dependency degraded
- **Backup verification** — `.github/workflows/backup-check.yml` scheduled daily run listing Supabase backup age
- **Uptime monitoring config** — `tests/monitoring/uptime-checks.ts` generates Better Uptime / UptimeRobot monitor configuration (5 monitors: health, readiness, version, homepage, login)
- **Production dashboard docs** — `docs/production/dashboards-setup.md` with step-by-step Sentry + PostHog + Vercel Analytics widget config
- **Penetration testing plan** — `docs/production/penetration-testing-plan.md` with 29 test cases, tooling, schedule, budget, legal scope
- **CI build fix** — dummy Supabase env vars added to CI workflow (build was failing with `supabaseUrl is required`)
- **CI green** — All 83 tests pass, lint/typecheck/build clean

### Session 11 — Jul 29, 2026 (Premium UI + wiring)
- **Wallet connect fixed** — wagmi `injected` + `walletConnect` connectors; removed broken dual SignClient path; select modal; auto-save wallet to DB with correct schema (`network`, `network_id`, signature placeholders)
- **Real card catalog** — `/dashboard/cards` loads `card_products` from Supabase; order flow uses real UUIDs → payment
- **Premium user dashboard** — glass panels, gradient card preview, live stats, mobile drawer sidebar, bottom tabs, realtime order/payment/notification toasts
- **Premium admin** — dark shell (sidebar/header/overview), admin realtime for orders/payments/tickets
- **Homepage** — hero rewrite, pricing aligned to seed catalog ($9.99–$49.99), features polish
- **Security** — 30m idle session timeout + 5m warning; rate limits for saveWallet; migration `202607290001_hardening.sql` (archived column, analytics RLS, security settings, realtime publication)
- **Apply migration on Supabase** before relying on archive/realtime publication changes

### Session 12 — Aug 02, 2026 (My Cards: details, controls, PIN, real-time crypto funding)
- **Full card details reveal** — "Show full number & CVV" panel with copy buttons (card number, CVV, expiry, cardholder); dark amber panel, works on any network; backfill migration `202608020001_card_details.sql` (pan_full/pan_formatted + holder_name from profiles + updated issue trigger)
- **Card settings functional** — Freeze / International / Contactless / Online toggles wired to `updateCardControls`; daily spending limit toggle + `updateCardLimit`; optimistic UI with rollback on error
- **PIN update functional** — `updateCardPin` (4-digit validation, `pin_set`/`pin_hint`); prominent gradient Update PIN button always visible, validates on click
- **Fund with crypto (real-time)** — QR + copyable receiving address from `supported_wallet_addresses` (already configured: `0x50c4...281B` on 5 EVM networks), network selector, $5/$25/$50/$100/$250 chips, **$5 minimum enforced client + server + edge fn**, manual tx-hash path for non-connected wallets
- **`verify-card-funding` edge function (deployed)** — DB-record ground truth (amount/address/chain/token from `card_funding` + config tables, never client values), exactly-once credit via `credited` flag + unique tx_hash index, ledger entry, `card_funding` table + RLS + realtime publication (migration `202608020003_card_funding.sql`)
- **Amount precision fix** — verification now converts human amounts to raw token units using token decimals (previously compared "50" vs "50000000" → always WRONG_AMOUNT); same fix applied to `verify-payment` (order payments) with decimals resolved from `supported_tokens`
- **Migrations pushed to remote** — `202608020001`, `202608020003`, `202608020004` (spend_limit_enabled) applied to `smkckhsvzyjttzqhpzhv` via `supabase db push`; `ALCHEMY_API_KEY` secret set; functions deployed via CLI (no Docker needed for deploy/secrets)
- **Funding UI** — networks filtered to those with a configured wallet + token (Solana excluded — EVM-only verification); manual hash input always visible; auto-selects wallet's network

### Remaining (v1.1 — manual/UI tasks)
- **Uptime monitoring + alerting** — Config generated; manual setup in Better Uptime / UptimeRobot needed (no API keys available)
- **Database PITR + daily backup** — CI backup dump configured; Supabase project on **Free plan** (no automated backups). Upgrade to **Pro ($25/mo)** for daily backups or **Team ($599/mo)** for PITR
- **Production dashboards** — Setup guide created; manual creation in Sentry + PostHog UI needed (no API keys available)
- **Penetration test** — Plan documented; schedule externally
- **npm install** may fail on paths with spaces (esbuild spawn) — install from a path without spaces or fix esbuild binary if local build fails
- **Edge functions** need Docker running only for local dev (`supabase start`); `functions deploy` + `secrets set` work without Docker

### Session 14 — Aug 03, 2026 (General search + working X-cancel + header connect + DB-backed RBAC)
- **Header ConnectButton** — `components/wallet/connect-button.tsx` rewritten with new `lib/hooks/use-assigned-wallet.ts` hook: when the admin assigned wallet is present it shows a green connected pill (short address + emerald dot) with a dropdown (details → `/dashboard/wallet`, copy address, disconnect via `disconnectMyWallet`); web3-connected branch keeps the brand pill.
- **General search** — `components/layout/dashboard-search.tsx` now searches orders, issued cards, payment transactions AND wallets (`wallet_validations.assigned_address/wallet_name`), each query isolated (a failing table can't blank all results), and the search bar is visible on mobile (was `hidden md:block`).
- **X-cancel everywhere** — working clear-X added to every admin search box that lacked one: sidebar nav search, `filter-bar.tsx` (wallets/support/receiving-wallets tables), orders, cards, payments, users, tickets, notifications, audit tables.
- **Roles & Permissions rebuild (DB-backed RBAC)** — migration `202608030001_role_permissions.sql` (applied to `smkckhsvzyjttzqhpzhv`): new `role_permissions` table seeded with the default matrix + RLS (admins read, super admins manage) + realtime publication; `admins.permissions TEXT[]` per-admin override column; audit enum values `role_permissions_updated` / `admin_permissions_updated`. Types regenerated.
- **Tickable permissions** — role cards show every permission as a checkbox (grouped: Dashboard/Users/Orders/Payments/Cards/Support/Settings/Audit/Analytics); toggling auto-saves via `updateRolePermissions` (replace rows + audit), spinner while saving, rollback on error; Super Admin card locked (full access).
- **Per-admin overrides** — Admin Users table has a "N of 15" button per admin opening a popover checklist; "Use role defaults" resets to inherit role; saved via `updateAdminPermissions` into `admins.permissions`.
- **Realtime roles** — `role_permissions` + `admins` channels keep every open dashboard in sync (permission toggles, promotions, role changes).
- **Promotion fixed** — roles page is now `force-dynamic` (was statically cached, so new admins never appeared without a hard reload); panel refreshes on success + realtime.
- **Authorization hardening** — `addAdminUser`, `updateAdminRole`, `updateRolePermissions`, `updateAdminPermissions` all require the caller to be a super admin (`requireSuperAdminAction`); super admin roles/permissions cannot be modified.
- **Sweep to Treasury live** — migration `202608030002_sweep_live.sql` (applied): `sweep_transactions` added to realtime publication; audit enum values `sweep_initiated` / `sweep_status_updated`. `createSweepRequest` server action (super-admin guarded, records pending sweep with current admin, audit log) replaces the raw fetch in `sweep-panel.tsx`; `updateSweepStatus` lets admins move a sweep pending → signed → broadcast → confirmed/failed and attach a tx hash (etherscan link appears). Panel subscribes to `sweep_transactions` realtime (new sweeps + status changes appear instantly), toasts success/errors, clears the form, page is `force-dynamic`.
- **Analytics live** — new `components/admin/analytics-panel.tsx` client component: recomputes all 4 stat cards + charts via server actions (`getAdminStats`/`getAnalyticsChartData`) on every realtime event from `card_orders` / `payment_transactions` / `profiles` (debounced 800ms), 60s interval fallback, manual Refresh button, "Live · synced HH:MM:SS" indicator, and an amber alert row showing pending orders / open tickets / active wallets. Page is `force-dynamic`.
- **Standing instruction** — user confirmed: commit → push → deploy to Vercel after every completed task (see Git / Commits).

### Known Issues
- `@wagmi/connectors` has warnings about missing optional deps (safe-sdk, porto, metamask-connect, coinbase-sdk, base-org/account) — non-blocking, webpack resolves to false
- `indexedDB is not defined` during SSR — fixed via `ssr: false` on WalletProviders dynamic import
- Supabase types (`types/supabase.ts`) have `Row: any` — casts needed in admin actions; regen types after schema changes

## File / Search Tool Rules

- Use Glob (not `Get-ChildItem`) for file search.
- Use Grep (not `Select-String`) for content search.
- Use Read (not `Get-Content`) to read files.
- Use Edit/Write (not `Set-Content`) to modify files.

## Where to Look

- `docs/MASTER_INDEX.md` — main entry point (executive summary, books index, implementation order)
- `docs/ARCHITECTURE.md` — one-page system overview
- `docs/DECISIONS.md` — architectural decision log (why every choice was made)
- `docs/CONTRIBUTING.md` — developer setup and coding standards
- `docs/FAQ.md` — quick answers to common questions
- `docs/GLOSSARY.md` — term definitions
- `docs/BOOK-01/BOOK_01_PROJECT_FOUNDATION.md` — vision, scope, architecture, risks (read this first if you need depth)
- `.tasks/README.md` — 100 implementation tasks to build the entire application
