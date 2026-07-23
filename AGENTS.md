# AGENTS.md

Canonical instructions for AI agents (OpenCode) working on the TWallet Services codebase.

## Project

- **Product:** TWallet Card (non-custodial, crypto-funded card platform)
- **Stack:** Next.js 15 (App Router, RSC) · Supabase (Postgres, Auth, Edge Functions, Storage, Realtime) · Vercel · TypeScript strict
- **Docs root:** `docs/MASTER_INDEX.md`

## Non-Negotiable Rules

1. NEVER collect, log, or accept users' recovery phrases or private keys. No input field, anywhere, may request them.
2. Wallet connections use standard protocols only (WalletConnect v2, MetaMask, Coinbase Wallet, Trust Wallet). The platform never signs or broadcasts on behalf of the user.
3. Customer funds flow directly to the configured receiving wallet address. The platform verifies on-chain; it does not escrow user balances.
4. NEVER mark an order `paid` without independent on-chain verification (correct address, amount, chain, confirmations, not already used).
5. NEVER create a database table without Row Level Security (RLS) policies.
6. NEVER put `SUPABASE_SERVICE_ROLE_KEY` (or any server-only secret) in a client bundle. Service-role key is server-side only.
7. No application code without an approved Book covering the feature.

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

- Do NOT commit unless the user explicitly asks.
- Before committing: inspect `git status`, `git diff`, `git log --oneline -10`; stage only intended files; never commit secrets.
- Commit messages: concise, matching repo style.

## Work Completed

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
- **E2E stubs (tasks 070–073)** — Playwright spec files for auth, wallet, card ordering, admin operations

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

### Pending
- WalletConnect Project ID placeholder — replace with real key before production
- `/admin/analytics` — empty directory stub; needs charts (Recharts) page
- `/admin/support` — empty directory stub; needs ticket management page

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
