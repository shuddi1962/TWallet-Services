# TWallet Services

> **TWallet Card** — a non-custodial, crypto-funded card platform.
> Domain: `twalletservices.com` · Version: 1.0.0 · Status: Documentation Complete

TWallet Services is a fintech/Web3 platform built around the **TWallet Card**. Users connect an existing self-custody wallet (MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet), order a physical or virtual card, and pay in crypto directly to a platform-configured receiving wallet address. The platform verifies every transaction on-chain before marking an order paid.

**The platform never collects users' recovery phrases or private keys.**

---

## Project Snapshot

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Documentation Complete             |
| Architecture | Enterprise                         |
| Frontend     | Next.js 15 (App Router, RSC)       |
| Backend      | Supabase (Postgres, Auth, Edge Functions, Storage, Realtime) |
| Hosting      | Vercel                             |
| Database     | PostgreSQL 15                      |
| Language     | TypeScript (strict)                |

---

## Hard Rules (Non-Negotiable)

1. Never collect users' recovery phrases or private keys.
2. All wallet connections use standard wallet connection protocols only.
3. Customer funds go directly to the configured receiving wallet address.
4. Blockchain transactions are verified before any order is marked paid.
5. Row Level Security on every database table — no exceptions.

---

## Repository Structure

```
TWallet Services/
├── .tasks/              100 implementation task files (001–100)
├── docs/                All documentation
│   ├── MASTER_INDEX.md  ← Start here
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
│   ├── BOOK-01/ … BOOK-30/   30 documentation books
│   ├── design/               Human-readable tokens
│   ├── design-tokens/        Machine-readable JSON
│   ├── .ai/                  AI context for OpenCode
│   ├── observability/        Observability guides
│   ├── operations/           Operations runbooks
│   ├── ops/                  DevOps runbooks
│   ├── qa/                   QA assets
│   ├── security/             Security docs
│   ├── packages/             Monorepo packages
│   ├── adr/                  ADR records
│   ├── analytics/            Event/KPI catalog
│   ├── components/           Component docs
│   └── database/             Database reference
├── supabase/            Supabase CLI config + migrations
├── src/                 Application source code
│   ├── components/ui/   UI component source
│   └── theme/           Token TypeScript source
├── AGENTS.md
├── README.md
└── package.json
```

---

## Quick Start

```bash
# Start here
docs/MASTER_INDEX.md

# Execute implementation tasks in order
.tasks/README.md

# Read architecture overview
docs/ARCHITECTURE.md
```

---

## Phase 2 — Implementation

Documentation is 100% complete. 30/30 books at Done. Implementation is organized into 100 granular tasks under `.tasks/`.

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | 001–015 | Foundation |
| 2 | 016–030 | Backend |
| 3 | 031–040 | Wallet & Payments |
| 4 | 041–065 | UI & Pages |
| 5 | 066–080 | Integration |
| 6 | 081–100 | Deployment |

---

## Development Philosophy

Security First · Mobile First · Component First · API First · Performance First · Accessibility First · SEO Ready · Enterprise Architecture · AI-Friendly Documentation

---

## Build & Verify

See `AGENTS.md` for the canonical build, lint, typecheck, and test commands.

---

## License

Proprietary — TWallet Services. All rights reserved.
