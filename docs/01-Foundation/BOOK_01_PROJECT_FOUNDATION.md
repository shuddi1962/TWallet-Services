# Book 01 — Project Foundation

> **TWallet Services · TWallet Card**
> The foundational document that defines the product vision, business goals, user personas, project scope, success criteria, technology stack, risks, assumptions, and overall architecture. Every subsequent book and all implementation work derive from this document.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 01 — Project Foundation            |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Planning                           |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |

### Revision History

| Version | Date       | Author                  | Notes                         |
| ------- | ---------- | ----------------------- | ----------------------------- |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (planning phase)|
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Approved foundation for Books 02–20 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Business Goals & Objectives](#3-business-goals--objectives)
4. [Value Proposition](#4-value-proposition)
5. [Target Market](#5-target-market)
6. [User Personas](#6-user-personas)
7. [Project Scope](#7-project-scope)
8. [Success Criteria & KPIs](#8-success-criteria--kpis)
9. [Technology Stack](#9-technology-stack)
10. [High-Level Architecture](#10-high-level-architecture)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Assumptions](#12-assumptions)
13. [Constraints](#13-constraints)
14. [Dependencies](#14-dependencies)
15. [Glossary](#15-glossary)
16. [References](#16-references)

---

## 1. Executive Summary

TWallet Services is a fintech/Web3 platform built around a single flagship product: the **TWallet Card**. The card — available in physical and virtual form factors — lets users spend from their own self-custody crypto wallets without ever handing their private keys or recovery phrases to the platform.

The platform's job is narrow and deliberate: it connects a user's Web3 wallet using standard connection protocols (WalletConnect v2, MetaMask, Coinbase Wallet, Trust Wallet), lets them order a card, and accepts crypto payments that settle directly to a platform-configured receiving wallet address. Before any order is marked paid, the platform independently verifies the transaction on-chain. The platform is **non-custodial with respect to user keys** and **custodial only over its own receiving address** for card payments.

The MVP is deliberately scoped: crypto payments only (no fiat rails), a public marketing website, a customer dashboard, a card ordering flow with shipping and tracking, wallet integration, an admin dashboard, and a support center. The architecture is enterprise-grade from day one — Next.js 15 on Vercel, Supabase (PostgreSQL + Auth + Edge Functions + Storage + Realtime), TypeScript throughout, Row Level Security on every table, and a component-first design system.

This document exists so that every later book (requirements, database, auth, wallet, cards, payments, dashboards, security, APIs, deployment, testing) has a single source of truth to derive from, and so that OpenCode can implement the project feature by feature with production-ready specifications.

---

## 2. Product Vision & Mission

### 2.1 Vision

> **A world where anyone can spend their crypto without surrendering control of it.**

### 2.2 Mission

> **Build a premium, secure, and transparent card platform that connects self-custody Web3 wallets to everyday payments — never asking users for the one thing they must never share: their private keys.**

### 2.3 Guiding Principles

1. **Security First** — every decision is filtered through "is this safe for the user's funds and data?"
2. **Non-Custodial by Design** — the platform never holds user keys or seeds; it only verifies on-chain activity.
3. **Mobile First** — the primary experience is a phone in hand, not a desktop.
4. **Component First** — the UI is a library of composable, documented components.
5. **API First** — every feature is expressible through a documented, typed API.
6. **Performance First** — Core Web Vitals are treated as product requirements, not optimizations.
7. **Accessibility First** — WCAG 2.1 AA is the floor, not the ceiling.
8. **SEO Ready** — public surfaces are server-rendered and indexable.
9. **Enterprise Architecture** — patterns, types, and boundaries are chosen for a team, not a single author.
10. **AI-Friendly Documentation** — every book is structured so that humans and AI agents can implement against it unambiguously.

### 2.4 What We Will Never Do

- Ask a user for their recovery phrase / seed.
- Ask a user for their private key.
- Hold user funds in a platform-controlled wallet on the user's behalf (users pay directly to our receiving address; we verify, we do not escrow user balances).
- Mark an order as paid without on-chain verification.
- Ship a database table without Row Level Security.

---

## 3. Business Goals & Objectives

### 3.1 Business Goals (Strategic)

| ID    | Goal                                                              | Horizon     |
| ----- | ---------------------------------------------------------------- | ----------- |
| BG-01 | Launch the TWallet Card MVP (physical + virtual) to the public.  | Phase 1–12  |
| BG-02 | Establish TWallet Services as a trusted non-custodial card brand.| Year 1      |
| BG-03 | Achieve a predictable card-order funnel with verified payments.  | MVP         |
| BG-04 | Build an admin operations layer that scales without rework.      | MVP         |
| BG-05 | Prepare the platform for fiat rails and card program expansion.  | Post-MVP    |

### 3.2 Objectives (Measurable, MVP window)

| ID    | Objective                                                        | Target              |
| ----- | ---------------------------------------------------------------- | ------------------- |
| OBJ-01| Public website live and indexable.                               | Core Web Vitals "Good" |
| OBJ-02| Functional registration + email verification.                    | ≥ 98% success rate  |
| OBJ-03| Wallet connection success across 4 target wallets.               | ≥ 95% success rate  |
| OBJ-04| Card order → verified payment conversion.                        | Baseline measured at launch |
| OBJ-05| On-chain payment verification accuracy.                          | 100% (no false "paid") |
| OBJ-06| Admin dashboard covering users, orders, cards, tx, tickets.      | 100% coverage       |
| OBJ-07| Support ticket first response.                                   | ≤ 24h (business)    |
| OBJ-08| Uptime.                                                          | ≥ 99.9%             |

---

## 4. Value Proposition

### 4.1 For the User

- **Your keys, your crypto.** Connect an existing wallet; never type a seed phrase into our product.
- **A real card.** Order a physical or virtual card funded by crypto you actually own.
- **Verified, transparent payments.** Every payment is confirmed on-chain before an order is marked paid — no black boxes.
- **Premium experience.** A fintech-grade, mobile-first dashboard with enterprise polish.

### 4.2 For the Operator (Admin)

- **Operational control.** A purpose-built admin dashboard for users, orders, cards, transactions, and tickets.
- **Auditability.** Every order and payment is traceable to an on-chain transaction.
- **Scalable foundation.** Architecture built for additional card programs, fiat rails, and regions.

### 4.3 Differentiators

| Differentiator       | TWallet Services                       | Typical Custodial Card Product     |
| -------------------- | -------------------------------------- | ---------------------------------- |
| Key custody          | Never — non-custodial                  | Often custodial                    |
| Recovery phrase      | Never requested                        | Sometimes requested                |
| Payment verification | On-chain, before "paid"                | Internal ledger only               |
| Wallet support       | WalletConnect + MetaMask + Coinbase + Trust | Often limited                 |
| Architecture         | Enterprise (RLS, typed, API-first)     | Varies                             |

---

## 5. Target Market

### 5.1 Primary Audience

- **Existing crypto holders** who already use self-custody wallets (MetaMask, Trust Wallet, Coinbase Wallet) and want to spend crypto without giving up self-custody.
- **Web3-native users** aged 20–45, mobile-first, comfortable with wallet signing.

### 5.2 Secondary Audience

- **Crypto-curious migrants** moving off exchanges toward self-custody who want a card that respects that move.
- **Operators/admins** internal to TWallet Services running the card program.

### 5.3 Geographic Scope (MVP)

- Defined in Book 02 (Business Requirements). The architecture is region-agnostic; shipping and supported chains are policy decisions documented per book.

---

## 6. User Personas

### 6.1 Persona A — "Maya", the Web3 Native (Customer)

| Attribute       | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Age             | 28                                                          |
| Role            | Customer                                                    |
| Devices         | iPhone (primary), MacBook (secondary)                       |
| Wallets used    | MetaMask, Trust Wallet (via WalletConnect)                  |
| Goals           | Order a TWallet Card; pay with crypto she already holds.    |
| Frustrations    | Platforms that ask for her seed phrase; opaque payment status. |
| Success signal  | Card arrives; dashboard shows verified payment history.     |
| Non-negotiable  | Never enters her recovery phrase anywhere on the platform.  |

### 6.2 Persona B — "Daniel", the Cautious Migrant (Customer)

| Attribute       | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Age             | 35                                                          |
| Role            | Customer                                                    |
| Devices         | Android phone, Windows laptop                               |
| Wallets used    | Coinbase Wallet                                            |
| Goals           | Move off-exchange; get a card that respects self-custody.   |
| Frustrations    | Confusing onboarding; fear of losing funds to scams.        |
| Success signal  | Completes registration + wallet connect + order without help. |
| Needs           | Clear "How it works" content, transparent pricing, FAQ.     |

### 6.3 Persona C — "Aisha", the Operations Lead (Admin)

| Attribute       | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Age             | 32                                                          |
| Role            | Admin                                                       |
| Devices         | Desktop (primary)                                           |
| Goals           | Monitor orders, verify payments, manage users & tickets.    |
| Frustrations    | No visibility into order/payment state; manual reconciliation. |
| Success signal  | One dashboard shows the full order → payment → card lifecycle. |
| Needs           | Audit trail, search/filter, role-based access.              |

### 6.4 Persona D — "Sam", the Support Agent (Support)

| Attribute       | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Age             | 26                                                          |
| Role            | Support                                                     |
| Devices         | Desktop                                                     |
| Goals           | Resolve tickets quickly with full user/order context.       |
| Frustrations    | Context-switching between systems.                          |
| Success signal  | Ticket resolved within SLA with linked order/tx context.    |
| Needs           | Linked user/order/transaction view; internal notes.         |

---

## 7. Project Scope

### 7.1 In Scope — MVP

#### Public Website
- Home
- How It Works
- Cards
- Pricing
- About
- FAQ
- Support
- Contact
- Footer

#### Authentication
- Register
- Login
- Forgot Password
- Email Verification

#### Customer Dashboard
- Overview
- Wallet
- Cards
- Orders
- Transactions
- Profile
- Security
- Settings

#### Card Ordering
- Physical Card
- Virtual Card
- Shipping Address
- Review Order
- Confirmation
- Order Tracking

#### Wallet Integration
- WalletConnect
- MetaMask
- Coinbase Wallet
- Trust Wallet (via WalletConnect)

#### Payments
- Crypto payments only (MVP)
- Blockchain transaction verification
- Payment history

#### Admin Dashboard
- Users
- Orders
- Cards
- Transactions
- Support Tickets
- Settings
- Analytics

### 7.2 Out of Scope — MVP (Deferred)

- Fiat payment rails (card, bank, ACH, SEPA).
- Custodial user balances / in-app balances held by the platform.
- Staking, savings, yield, lending, swaps.
- Card usage at point-of-sale funding logic (card program issuer integration beyond ordering).
- KYC/AML full flow (an integration hook is reserved; full flow is Phase 2).
- Multi-language localization beyond the structure for it.
- Native mobile apps (PWA-ready web is the MVP surface).
- Secondary markets / NFT features.

### 7.3 Scope Boundaries (Important Clarifications)

- The platform **does not** issue card-program BINs itself in the MVP; the MVP covers ordering, payment verification, and operations. Issuer/partner integration depth is specified in Book 09.
- The platform **verifies** on-chain transactions; it does **not** execute them on behalf of the user. The user signs and broadcasts from their own wallet.
- The "Wallet" section of the customer dashboard is a **view of connected wallets and verified on-chain activity**, not a custodial balance manager.

---

## 8. Success Criteria & KPIs

### 8.1 Launch Success Criteria (Definition of Done for MVP)

1. All Books 01–18 approved and implemented where applicable.
2. Public website live on `twalletservices.com` with Core Web Vitals "Good".
3. Auth flow (register, login, forgot password, email verification) functional.
4. Wallet connection works for all 4 target wallets.
5. Card order flow (physical + virtual) end-to-end with shipping address and tracking.
6. Crypto payment + on-chain verification pipeline functional with 100% accuracy (no false "paid").
7. Customer dashboard covers all sections listed in scope.
8. Admin dashboard covers all sections listed in scope.
9. Support center + ticketing functional.
10. RLS on every table; security review passed.
11. Lint + typecheck clean; tests passing; deployed to Vercel + Supabase production.

### 8.2 KPIs

| KPI                         | Target (MVP)        | Owner Book |
| --------------------------- | ------------------- | ---------- |
| Core Web Vitals (LCP/INP/CLS)| Good                | 04, 17     |
| Registration success rate   | ≥ 98%               | 07         |
| Wallet connect success rate | ≥ 95%               | 08         |
| Payment verification accuracy| 100%               | 10         |
| Order → paid conversion     | Baseline at launch  | 09, 10     |
| Support first response      | ≤ 24h business      | 13         |
| Uptime                      | ≥ 99.9%             | 17         |
| Accessibility               | WCAG 2.1 AA         | 04         |
| Typecheck/lint              | Clean               | 14, 16     |

---

## 9. Technology Stack

Full detail lives in `00-Project/TECH_STACK.md`. Summary:

| Layer       | Choice                                                      |
| ----------- | ---------------------------------------------------------- |
| Language    | TypeScript (strict)                                        |
| Frontend    | Next.js 15 (App Router, RSC) on Vercel                     |
| UI          | React 19, Tailwind CSS, Radix UI, Framer Motion            |
| Backend     | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) |
| Database    | PostgreSQL 15                                              |
| Auth        | Supabase Auth + Row Level Security                         |
| Wallet      | WalletConnect v2, viem/wagmi, MetaMask, Coinbase, Trust    |
| Payments    | Crypto-only (MVP); on-chain verification                   |
| Hosting     | Vercel (frontend/edge) + Supabase (backend)                |
| Testing     | Vitest (unit), Playwright (e2e), Supabase local stack      |
| CI/CD       | GitHub + Vercel previews + Supabase branch databases       |

### 9.1 Stack Selection Rationale

- **Next.js 15 / App Router** — server components for SEO/perf on public surfaces, client islands for dashboards.
- **Supabase** — Postgres + Auth + RLS + Edge Functions in one typed system; reduces glue code and matches an API-first, security-first posture.
- **Vercel** — native Next.js hosting with previews and edge runtime.
- **TypeScript strict** — enterprise correctness; enables AI-friendly, unambiguous specs.
- **WalletConnect v2 + viem/wagmi** — standard, audited wallet protocols; no custom key handling.

---

## 10. High-Level Architecture

### 10.1 System Context

```
            ┌────────────────────────────────────────────────────────────┐
            │                       User (Browser)                       │
            │   Next.js 15 app (public + customer dashboard + admin)    │
            └───────────────┬───────────────────────────┬────────────────┘
                            │                           │
                  HTTPS / RSC + API                Wallet connection
                            │                      (WalletConnect v2,
                            │                       MetaMask, Coinbase,
                            ▼                       Trust Wallet)
            ┌──────────────────────────────┐        │
            │           Vercel             │        │ user signs tx
            │  (Next.js + Edge runtime)    │        │ in own wallet
            └───────────────┬──────────────┘        │
                            │                       ▼
                            │              ┌─────────────────┐
                            │              │   EVM Chain(s)  │
                            │              │  (public RPC)   │
                            │              └────────┬────────┘
                            ▼                       │
            ┌──────────────────────────────┐        │ read/verify
            │          Supabase            │◄───────┘
            │  Postgres · Auth · Storage   │
            │  Realtime · Edge Functions   │
            │  Row Level Security (all)    │
            └──────────────────────────────┘
                            │
                            ▼
            ┌──────────────────────────────┐
            │  Configured Receiving Wallet │
            │   (platform's own address)   │
            └──────────────────────────────┘
```

### 10.2 Logical Layers

1. **Presentation Layer** — Next.js App Router: public (server-rendered, SEO), customer dashboard (client islands), admin dashboard (client, RBAC).
2. **API Layer** — typed routes + Supabase Edge Functions for sensitive operations (payment verification, order state transitions). All routes documented in Book 16.
3. **Domain Layer** — orders, cards, payments, wallets, users, tickets. Pure typed logic, framework-agnostic where possible.
4. **Data Layer** — PostgreSQL via Supabase with RLS on every table; typed query helpers; migrations versioned.
5. **Integration Layer** — blockchain verification (read-only public RPC), wallet connection protocols, email provider, monitoring.

### 10.3 Trust Boundaries

| Boundary                  | Trust Rule                                                   |
| ------------------------- | ------------------------------------------------------------ |
| Browser ↔ Next.js         | Untrusted input; validate server-side.                       |
| Next.js ↔ Supabase        | Use service-role key only server-side; anon key client-side with RLS. |
| Client ↔ Blockchain       | Read connection only; signing happens in user's wallet.      |
| Server ↔ Blockchain       | Read-only verification against public RPC; never broadcasts user tx. |
| User funds flow           | Directly from user wallet → configured receiving address; platform verifies, does not escrow. |

### 10.4 Data Flow — Card Order + Payment (Conceptual)

1. Customer connects wallet (standard protocol; no keys shared).
2. Customer places an order (physical/virtual card, shipping address).
3. System creates an order record (`status: pending`) and presents the receiving address + amount + chain.
4. Customer signs and broadcasts a payment from their own wallet to the receiving address.
5. Customer (or platform) submits the transaction hash.
6. Platform Edge Function verifies the tx on-chain: correct address, amount, chain, confirmations, not already used.
7. On success, order transitions to `paid`; payment history is recorded.
8. Admin can see the full lifecycle; customer sees order tracking.

> Detailed state machines live in Book 09 (Cards) and Book 10 (Payments).

---

## 11. Risks & Mitigations

| ID    | Risk                                              | Severity | Likelihood | Mitigation                                                                     |
| ----- | ------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------ |
| R-01  | User social-engineered into sharing seed phrase   | High     | Medium     | UI never asks for it; explicit warnings; education in "How it works" + FAQ.    |
| R-02  | False "paid" due to unverified/spoofed tx         | High     | Medium     | Independent on-chain verification (address, amount, chain, confirmations, replay protection). |
| R-03  | Double-spend / reorg marks a tx paid then invalid | High     | Low        | Require N confirmations before `paid`; monitor for reorgs; flag for review.   |
| R-04  | Wallet connection fails on certain devices        | Medium   | Medium     | Support 4 wallets + WalletConnect fallback; clear error states; retry UX.     |
| R-05  | Private/seed phrase accidentally logged           | Critical | Low        | Never collected; input fields for sensitive data are explicitly disallowed; lint guards. |
| R-06  | RLS gap leaks another user's data                 | High     | Medium     | RLS on every table; security advisors run after each migration; pen-test pre-launch. |
| R-07  | Service-role key exposed client-side              | Critical | Low        | Server-only usage; env var separation; CI check that `SUPABASE_SERVICE_ROLE_KEY` is not in client bundles. |
| R-08  | Payment to wrong network (e.g., wrong chain)      | Medium   | Medium     | Chain validation in verification; UI clearly states accepted chain(s) per order. |
| R-09  | Order/tx replay — one tx used for two orders      | High     | Low        | Store tx hash unique constraint; verify tx not already linked to an order.    |
| R-10  | Admin privilege escalation                        | High     | Low        | RBAC table; RLS policies for admin; server-side enforcement on Edge Functions. |
| R-11  | Vendor outage (Supabase/Vercel)                   | Medium   | Low        | Status pages; graceful degradation; retries for verification job.             |
| R-12  | Regulatory exposure (crypto card programs)        | High     | Medium     | Defer issuer depth to Book 09; KYC/AML hook reserved for Phase 2; legal review. |
| R-13  | Scope creep (fiat, yield, swaps)                  | Medium   | High       | Out-of-scope list enforced; changes require a new book / version bump.        |

---

## 12. Assumptions

1. Users already have a self-custody wallet and basic familiarity with signing transactions.
2. The platform operates one (or a small set of) configured receiving wallet address(es) owned by TWallet Services — this is not user custody.
3. Accepted chain(s) and tokens for payment are defined in Book 10; the MVP supports EVM-compatible chains.
4. Email deliverability is available via a transactional provider.
5. Supabase and Vercel meet the uptime/performance needs for MVP scale.
6. The operator has legal/compliance guidance for the regions served; the platform provides technical hooks (e.g., KYC stub) but not legal advice.
7. Card issuance partner integration specifics are scoped in Book 09; the MVP may operate in an "order + verify payment + fulfill" model pending partner readiness.
8. All development is done by OpenCode against these Books; Books must remain unambiguous and implementation-ready.

---

## 13. Constraints

- **Non-custodial of user keys** — architectural constraint, not a preference.
- **No false "paid"** — payments are only marked paid after on-chain verification.
- **RLS on every table** — no exceptions.
- **TypeScript strict mode** — no `any`-first codepaths.
- **Mobile-first responsive** — every screen works on phone first.
- **WCAG 2.1 AA** — accessibility floor.
- **No secrets in client bundles** — enforced by build.
- **No code without an approved Book** — planning phase precedes implementation.

---

## 14. Dependencies

| Dependency                       | Purpose                              | Owner Book |
| -------------------------------- | ------------------------------------ | ---------- |
| Supabase project (Postgres/Auth) | Backend, auth, RLS, edge functions   | 06, 07, 17 |
| Vercel project                   | Frontend + edge hosting              | 17         |
| WalletConnect projectId          | Wallet connections                   | 08         |
| EVM public RPC endpoints         | On-chain transaction verification    | 10         |
| Transactional email provider     | Auth + notification emails           | 07, 14     |
| Domain (twalletservices.com)     | Production hosting                   | 17         |
| Design system (Figma)            | UI components                         | 04         |
| Card fulfillment partner         | Physical card production/shipping    | 09         |

---

## 15. Glossary

| Term                | Definition                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| TWallet Card        | The flagship product; a crypto-funded card (physical or virtual).           |
| Non-custodial       | The platform never holds user private keys or recovery phrases.             |
| Receiving Address   | The platform-owned wallet address users pay to for card orders.             |
| On-chain verification | Reading a transaction from the blockchain to confirm it really happened and matches an order. |
| RLS                 | Row Level Security (Postgres) — per-row access control.                     |
| Edge Function       | Supabase serverless function (Deno) for sensitive server-side logic.        |
| WalletConnect v2    | Standard protocol connecting wallets to apps without exposing keys.         |
| RSC                 | React Server Components (Next.js App Router).                               |
| Order state machine | The set of allowed transitions for an order (pending → paid → …).           |
| Confirmation        | Number of blocks confirming a transaction on-chain before trusting it.      |

---

## 16. References

- `00-Project/PROJECT_OVERVIEW.md`
- `00-Project/TECH_STACK.md`
- `00-Project/ROADMAP.md`
- `00-Project/REQUIREMENTS.md`
- `00-Project/CHANGELOG.md`
- Root `README.md` (project index + books status)
- `AGENTS.md` (build/lint/typecheck commands)

---

## Next Book

**Book 02 — Business Requirements** (`01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md`): enumerates the complete functional and non-functional requirements, user roles matrix, business rules, success metrics, scope boundaries, and release roadmap that the rest of the books implement against.

---

> End of Book 01 — Project Foundation. This document is the single source of truth for vision, scope, and architecture. Any change to scope, stack, or non-negotiable rules requires a version bump in this book and a `CHANGELOG.md` entry.
