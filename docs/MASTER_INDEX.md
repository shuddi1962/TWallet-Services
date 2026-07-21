# TWallet Services — Documentation Homepage

## Executive Summary

**TWallet Card** is a non-custodial, crypto-funded card platform built on Next.js 15 + Supabase + Vercel. Users connect an existing self-custody wallet (MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet), order a physical or virtual card, and pay in crypto directly to a platform-configured receiving wallet address. The platform verifies every transaction on-chain before marking an order paid.

**The platform never collects users' recovery phrases or private keys.**

---

## Business Goals

| Goal | Metric | Timeline |
|------|--------|----------|
| MVP launch | Card ordering + crypto payment | Q3 2026 |
| 10,000 active cards | Orders fulfilled | Q1 2027 |
| Multi-network support | 7 EVM networks | v1.0 |
| Enterprise compliance | SOC 2 Type II | v2.0 |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Animations | Framer Motion |
| Icons | Lucide |
| Backend | Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) |
| Wallet | WalletConnect AppKit + wagmi + viem |
| RPC | Alchemy |
| Validation | Zod |
| Hosting | Vercel |
| Testing | Vitest + Playwright |
| Monitoring | Sentry + Vercel Analytics + Uptime Robot |
| Email | Resend |
| CI/CD | GitHub Actions |

---

## Architecture Diagram (High-Level)

```text
┌─────────────────────────────────────────────────────────────┐
│                     Users (Browser/Mobile)                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────────────┐
│                    Vercel (Next.js 15)                       │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Public    │  │  RSC/SSR   │  │  Client Components   │  │
│  │  Marketing │  │  Pages     │  │      (Islands)       │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│                        │                                     │
│              ┌─────────▼──────────┐                         │
│              │  Server Actions    │                         │
│              │  Route Handlers    │                         │
│              └─────────┬──────────┘                         │
└────────────────────────┼────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───▼──────────┐  ┌─────▼──────┐  ┌─────────▼──────────┐
│  Supabase    │  │ Alchemy    │  │ WalletConnect      │
│  PostgreSQL  │  │ RPC Nodes  │  │ Cloud / SDK        │
│  Auth        │  │ (7 chains) │  │ (5 wallets)        │
│  Storage     │  └────────────┘  └────────────────────┘
│  Edge Fns    │
│  Realtime    │
└──────────────┘
```

---

## Folder Structure

```
TWallet Services/
├── .tasks/               Implementation task files (001–100)
├── docs/                 All documentation
│   ├── MASTER_INDEX.md   ← YOU ARE HERE
│   ├── ARCHITECTURE.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── DECISIONS.md
│   ├── FAQ.md
│   ├── GLOSSARY.md
│   ├── KNOWN_LIMITATIONS.md
│   ├── LICENSE.md
│   ├── PROJECT_ROADMAP.md
│   ├── RELEASE_NOTES.md
│   ├── RISK_REGISTER.md
│   ├── SECURITY_CONTACT.md
│   ├── 01-Foundation/ … 30-Launch/  30 documentation books
│   ├── design/                   Human-readable tokens
│   ├── design-tokens/            Machine-readable JSON
│   ├── .ai/                      AI context for OpenCode
│   ├── observability/            Observability guides
│   ├── operations/               Operations runbooks
│   ├── ops/                      DevOps runbooks
│   ├── qa/                       QA assets
│   ├── security/                 Security docs
│   ├── packages/                 Monorepo packages
│   ├── adr/                      ADR records
│   ├── analytics/                Event/KPI catalog
│   ├── components/               Component docs
│   └── database/                 Database reference
├── supabase/              Supabase CLI config + migrations
├── src/                   Application source code
│   ├── components/ui/     UI component source
│   └── theme/             Token TypeScript source
├── AGENTS.md
├── README.md
└── package.json
```

---

## 30 Documentation Books

| # | Title | Location |
|---|-------|----------|
| 01 | Project Foundation | `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` |
| 02 | Business Requirements | `01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md` |
| 03 | Information Architecture | `03-Architecture/BOOK_03_INFORMATION_ARCHITECTURE.md` |
| 04 | Design System | `02-UI-UX/BOOK_04_DESIGN_SYSTEM.md` |
| 05 | SRS | `01-Foundation/BOOK_05_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` |
| 06 | UX & User Flows | `02-UI-UX/BOOK_06_USER_EXPERIENCE_AND_USER_FLOWS.md` |
| 07 | Database Architecture | `04-Database/BOOK_07_DATABASE_ARCHITECTURE.md` |
| 08 | Database Schema | `04-Database/BOOK_08_DATABASE_SCHEMA.md` |
| 09 | Authentication | `05-Authentication/BOOK_09_AUTHENTICATION_SYSTEM.md` |
| 10 | Wallet Integration | `06-Wallet/BOOK_10_WALLET_INTEGRATION.md` |
| 10A | Third-Party Integrations | `01-Foundation/BOOK_10A_THIRD_PARTY_INTEGRATIONS.md` |
| 11 | Crypto Payments | `08-Payments/BOOK_11_CRYPTO_PAYMENTS.md` |
| 12 | System Architecture | `01-Foundation/BOOK_12_SYSTEM_ARCHITECTURE.md` |
| 13 | Landing Page | `02-UI-UX/BOOK_13_LANDING_PAGE/` |
| 14 | Customer Dashboard | `09-Customer/BOOK_14_CUSTOMER_DASHBOARD/` |
| 15 | Admin Dashboard | `10-Admin/BOOK_15_ADMIN_DASHBOARD/` |
| 16 | API Specification | `15-API/BOOK-16-API/` |
| 17 | Supabase Architecture | `17-Supabase/BOOK-17-SUPABASE/` |
| 18 | Database SQL & Migrations | `18-Database-SQL/BOOK-18-DATABASE-SQL/` |
| 19 | Component Library | `19-Components/BOOK-19-COMPONENT-LIBRARY/` |
| 20 | Design Tokens | `20-Design-Tokens/BOOK-20-DESIGN-TOKENS/` |
| 21 | Security & Compliance | `21-Security/BOOK-21-SECURITY/` |
| 22 | Testing & QA | `22-Testing/BOOK-22-TESTING/` |
| 23 | DevOps & Deployment | `23-DevOps/BOOK-23-DEVOPS/` |
| 24 | Monitoring & Observability | `24-Monitoring/BOOK-24-MONITORING/` |
| 25 | Performance Optimization | `25-Performance/BOOK-25-PERFORMANCE/` |
| 26 | SEO & Marketing | `26-SEO/BOOK-26-SEO/` |
| 27 | Analytics & BI | `27-Analytics/BOOK-27-ANALYTICS/` |
| 28 | Developer Handbook | `28-Handbook/BOOK-28-DEVELOPER/` |
| 29 | OpenCode AI Instructions | `29-AI-Build/BOOK-29-OPENCODE/` |
| 30 | Production Launch & Ops | `30-Launch/BOOK-30-PRODUCTION/` |

---

## Implementation Order

| Phase | Tasks | Focus | Duration |
|-------|-------|-------|----------|
| 1 | 001–015 | Foundation (project setup, tokens, auth) | Days 1–3 |
| 2 | 016–030 | Backend (migrations, Supabase, Edge Functions) | Days 4–7 |
| 3 | 031–040 | Wallet & Payments (connect, verify) | Days 8–10 |
| 4 | 041–065 | UI & Pages (components, landing, dashboards, API) | Days 11–20 |
| 5 | 066–080 | Integration (testing, performance, security) | Days 21–25 |
| 6 | 081–100 | Deployment (DevOps, monitoring, launch) | Days 26–30 |

Execute `.tasks/001` through `.tasks/100` in order. Each task references the relevant Books.

---

## Milestones

| Milestone | Acceptance Criteria |
|-----------|---------------------|
| Auth Works | Register, verify email, log in |
| Backend Ready | DB migrated, RLS active, Edge Functions deployed |
| Wallet + Payments | Wallet connects, payment verifies on-chain |
| UI Complete | All pages render, responsive, accessible |
| Quality Gate | Tests pass, Lighthouse ≥ 95, security audited |
| Production Live | Domain active, monitoring on, backups running |

---

## Production Checklist

- [ ] Domain DNS configured (Cloudflare + Vercel)
- [ ] SSL certificates active
- [ ] Supabase production DB provisioned
- [ ] WalletConnect project live (production keys)
- [ ] Alchemy RPC keys active (7 networks)
- [ ] Sentry project configured
- [ ] Environment variables deployed (Vercel encrypted)
- [ ] Monitoring alerts configured
- [ ] Backup strategy active (PITR + daily dumps)
- [ ] Rollback procedure tested

---

## Future Roadmap

| Version | Focus | Timeline |
|---------|-------|----------|
| v1.0 | Core MVP | Q3 2026 |
| v1.1 | Referral system | Q4 2026 |
| v1.2 | Affiliate program | Q1 2027 |
| v2.0 | Enterprise features, SOC 2 | Q2 2027 |
| v3.0 | Global expansion, multi-currency | 2028 |

---

## Quick Start

```bash
git clone <repo>
npm install
supabase start
supabase db push
supabase gen types typescript --local > src/types/supabase.ts
cp .env.example .env.local
# Fill in values from Supabase Dashboard + WalletConnect Cloud
npm run dev
npm run typecheck
npm run lint
npm run test
```
