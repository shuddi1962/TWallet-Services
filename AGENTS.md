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
