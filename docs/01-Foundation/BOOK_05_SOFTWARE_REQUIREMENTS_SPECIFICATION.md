# Book 05 — Software Requirements Specification (SRS)

> **TWallet Services · TWallet Card**
> The technical system-level requirements specification. Complements Book 02 (Business Requirements) by defining *how the system must behave technically*: system interfaces, data flows, state machines, component behavior, integration specifications, security mechanisms, performance budgets, error handling, logging, and acceptance criteria. This is the document OpenCode relies on for implementation correctness.

---

## Document Control

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| Book           | 05 — Software Requirements Specification  |
| Project        | TWallet Services                           |
| Product        | TWallet Card                               |
| Version        | 1.0.0                                      |
| Document Type  | Software Requirements Specification (SRS)  |
| Status         | Draft                                      |
| Architecture   | Enterprise                                 |
| Domain         | twalletservices.com                        |
| Owner          | TWallet Services Team                      |
| Created        | 2026-07-21                                 |
| Last Updated   | 2026-07-21                                 |
| Complements    | Book 02 — Business Requirements            |

### Revision History

| Version | Date       | Author                  | Notes                                                                  |
| ------- | ---------- | ----------------------- | ---------------------------------------------------------------------- |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (system overview, FR/NFR summary, security, performance) |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Technical expansion: state machines, data flows, interface specs, acceptance criteria, performance budgets, implementation-ready template for feature books |

### Relationship to Other Books

| Book | Title                  | Relationship to this SRS                          |
| ---- | ---------------------- | ------------------------------------------------- |
| 01   | Project Foundation     | Provides vision, scope, architecture context.     |
| 02   | Business Requirements  | **Complementary.** Book 02 = what the business needs (FR/NFR at business level). This SRS = what the software must do technically (system behavior, interfaces, state machines, data, security mechanisms). |
| 03   | Information Architecture | Provides route map and page structure this SRS references. |
| 04   | Design System          | Provides visual tokens and component APIs this SRS references. |
| 06+  | Feature books          | Each feature book implements a slice of this SRS using the **implementation-ready template** (see §22). |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Technology Stack](#3-technology-stack)
4. [Supported Platforms & Browsers](#4-supported-platforms--browsers)
5. [System Interfaces](#5-system-interfaces)
6. [System Behavior & State Machines](#6-system-behavior--state-machines)
7. [Data Requirements](#7-data-requirements)
8. [Functional Requirements (System-Level)](#8-functional-requirements-system-level)
9. [Non-Functional Requirements (System-Level)](#9-non-functional-requirements-system-level)
10. [Security Requirements](#10-security-requirements)
11. [Privacy Requirements](#11-privacy-requirements)
12. [Performance Requirements & Budgets](#12-performance-requirements--budgets)
13. [Reliability & Availability](#13-reliability--availability)
14. [Error Handling & Exception Management](#14-error-handling--exception-management)
15. [Logging & Audit Trail](#15-logging--audit-trail)
16. [Monitoring & Alerting](#16-monitoring--alerting)
17. [Backup & Recovery](#17-backup--recovery)
18. [Deployment & CI/CD](#18-deployment--cicd)
19. [Testing Requirements](#19-testing-requirements)
20. [Constraints & Assumptions](#20-constraints--assumptions)
21. [Future Enhancements](#21-future-enhancements)
22. [Implementation-Ready Template for Feature Books](#22-implementation-ready-template-for-feature-books)
23. [Acceptance Criteria (Per Feature Area)](#23-acceptance-criteria-per-feature-area)
24. [Glossary](#24-glossary)
25. [References](#25-references)

---

## 1. Introduction

### 1.1 Purpose

This document defines all **system-level** technical requirements for the TWallet Services platform. It serves as the primary reference for developers, QA engineers, DevOps engineers, and AI coding tools (including OpenCode) for understanding exactly what the system must do and how it must behave.

### 1.2 Scope

This SRS covers the full MVP scope defined in Book 01 §7 and Book 02 §9–11:
- Public website, authentication, wallet connection, card ordering, crypto payments, customer dashboard, admin portal, support center, notifications.

It defines system interfaces, state machines, data flows, security mechanisms, performance budgets, error handling, logging, monitoring, and acceptance criteria.

It does **not** re-enumerate business-level requirements (those live in Book 02); instead it references them by ID (e.g., `FR-02-001`) and adds technical depth.

### 1.3 Intended Audience

| Audience           | Use                                                    |
| ------------------ | ------------------------------------------------------ |
| Frontend developers| Component behavior, page specs, state, validation.     |
| Backend developers | Edge Functions, RLS, verification logic, data flows.   |
| QA engineers       | Acceptance criteria, test boundaries, error handling.  |
| DevOps engineers   | Deployment, monitoring, backup, CI/CD.                 |
| AI coding tools    | Implementation-ready specs with zero ambiguity.        |

### 1.4 Definitions, Acronyms, and Abbreviations

See §24 Glossary.

### 1.5 References

- Book 01 — Project Foundation
- Book 02 — Business Requirements
- Book 03 — Information Architecture
- Book 04 — Design System
- `00-Project/TECH_STACK.md`
- IEEE 830-1998 (SRS structure inspiration, adapted for modern Web3 stack)

### 1.6 Overview

§2–4 establish system context. §5–7 define interfaces, behavior, and data. §8–9 enumerate system-level functional and non-functional requirements. §10–17 cover cross-cutting concerns (security, performance, reliability, errors, logging, monitoring, backup, deployment). §18–19 cover testing. §20–21 cover constraints and future. §22 defines the template every feature book (Book 06+) must follow. §23 provides acceptance criteria per feature area.

---

## 2. System Overview

TWallet Services is a Web3 platform that enables users to:

- Create an account
- Securely connect supported wallets
- Order premium crypto cards (physical and virtual)
- Pay using cryptocurrency
- Monitor transactions
- Track orders
- Manage profiles
- Receive notifications

The system is **cloud-native**, built on Next.js 15 (Vercel) + Supabase (PostgreSQL, Auth, Edge Functions, Storage, Realtime), with TypeScript throughout. It is **non-custodial** with respect to user keys and **verifies** payments on-chain before confirming orders.

### 2.1 System Architecture (Reference)

See Book 01 §10 for the full architecture diagram and trust boundaries. Summary:

```
User (Browser) ←→ Next.js 15 (Vercel) ←→ Supabase (Postgres/Auth/Edge Functions)
                                              ↕
                                        EVM Chain(s) via public RPC
                                              ↕
                                        Receiving Wallet (platform-owned)
```

### 2.2 System Components

| Component             | Technology                  | Responsibility                                      |
| --------------------- | --------------------------- | --------------------------------------------------- |
| Public Website        | Next.js RSC                 | Server-rendered, SEO-indexable marketing surfaces.  |
| Auth Layer            | Supabase Auth + middleware  | Registration, login, email verification, sessions.  |
| Customer App          | Next.js Hybrid (RSC + islands) | Dashboard, orders, wallet, transactions, settings. |
| Admin Portal          | Next.js Hybrid (RSC + islands) | Operations: users, orders, cards, payments, support. |
| Wallet Layer          | viem + wagmi + WalletConnect v2 | Read-only wallet connection; user signs in own wallet. |
| Payment Verification  | Supabase Edge Function (Deno) | On-chain tx verification (address, amount, chain, confirmations, replay). |
| Order State Machine   | Supabase Edge Function + RLS | State transitions with integrity guarantees.       |
| Database              | PostgreSQL 15 (Supabase)    | All persistent data with RLS on every table.        |
| File Storage          | Supabase Storage            | User documents, card images, assets.                |
| Realtime              | Supabase Realtime           | Order status updates, notifications.                |
| Email                 | Transactional provider      | Auth + order + verification emails.                 |
| CDN / Edge            | Vercel Edge                 | Static assets, middleware, edge functions.          |

---

## 3. Technology Stack

### 3.1 Frontend

| Technology       | Version | Purpose                                  |
| ---------------- | ------- | ---------------------------------------- |
| Next.js          | 15      | App Router, RSC, middleware, edge runtime. |
| React            | 19      | UI library.                              |
| TypeScript       | 5.x     | Type safety (strict mode).               |
| Tailwind CSS     | 4       | Utility-first styling (CSS-first `@theme`). |
| Radix UI         | latest  | Accessible primitives (dialogs, selects, etc.). |
| shadcn/ui        | latest  | Component patterns built on Radix UI; customized per Book 04 tokens. |
| Framer Motion    | latest  | Motion (per Book 04 §20 motion tokens).  |
| Lucide React     | latest  | Icon system (per Book 04 §19).           |
| viem             | latest  | EVM interaction (read-only verification). |
| wagmi            | latest  | React hooks for wallet connections.      |
| WalletConnect v2 | latest  | Wallet connection protocol.              |
| Recharts         | latest  | Dashboard charts (themed per Book 04).   |
| react-hook-form  | latest  | Form state management.                   |
| zod              | latest  | Schema validation (client + server).     |

### 3.2 Backend

| Technology       | Version | Purpose                                  |
| ---------------- | ------- | ---------------------------------------- |
| Supabase         | latest  | Backend platform (Postgres, Auth, Edge Functions, Storage, Realtime). |
| PostgreSQL       | 15      | Relational database with RLS.            |
| Deno             | 1.x     | Edge Function runtime.                   |
| Supabase Auth    | latest  | Email/password auth, JWT sessions, OAuth hooks. |

### 3.3 Infrastructure

| Technology       | Version | Purpose                                  |
| ---------------- | ------- | ---------------------------------------- |
| Vercel           | latest  | Frontend + edge hosting, previews, CI/CD. |
| GitHub           | latest  | Version control, PR flow.                |
| Vercel Analytics | latest  | Web Vitals + traffic.                    |
| Sentry           | latest  | Error tracking.                          |

### 3.4 Stack Note

shadcn/ui is used as a **component pattern** (copy-into-codebase, fully owned and customized), not as an npm dependency. Components are customized to use Book 04 design tokens via Tailwind v4 `@theme`. This gives full control over styling while leveraging Radix UI for accessibility.

---

## 4. Supported Platforms & Browsers

### 4.1 Devices

| Device  | Support Level |
| ------- | ------------- |
| Desktop | Full support. |
| Tablet  | Full support. |
| Mobile  | Full support (primary). |

### 4.2 Browsers

| Browser           | Minimum Version | Support Level |
| ----------------- | --------------- | ------------- |
| Chrome            | Latest 2       | Full.         |
| Firefox           | Latest 2       | Full.         |
| Safari            | Latest 2       | Full.         |
| Microsoft Edge    | Latest 2       | Full.         |
| Safari iOS        | Latest 2       | Full.         |
| Chrome Android    | Latest 2       | Full.         |

### 4.3 Wallet Support

| Wallet            | Protocol           | Platform                    |
| ----------------- | ------------------ | --------------------------- |
| MetaMask          | Injected provider  | Desktop + mobile.           |
| Coinbase Wallet   | Injected / SDK     | Desktop + mobile.           |
| Trust Wallet      | WalletConnect v2   | Mobile (via WC).            |
| Any WC v2 wallet  | WalletConnect v2   | Desktop + mobile.           |

---

## 5. System Interfaces

### 5.1 External Interfaces

| Interface             | Direction | Protocol | Purpose                                      |
| --------------------- | --------- | -------- | -------------------------------------------- |
| EVM Blockchain RPC    | Read      | JSON-RPC (HTTPS) | Transaction verification, block data. |
| Wallet Providers      | Bidirectional | WalletConnect v2 / injected | Wallet connection (read-only address). |
| Transactional Email   | Outbound  | SMTP / API | Auth, order, verification emails.           |
| Vercel Edge           | Bidirectional | HTTPS | Request routing, middleware, edge functions. |
| Supabase              | Bidirectional | HTTPS / WebSocket | DB, Auth, Storage, Realtime.           |
| Sentry                | Outbound  | HTTPS    | Error reporting.                             |

### 5.2 Internal Interfaces

| Interface             | Components                    | Protocol | Purpose                              |
| --------------------- | ----------------------------- | -------- | ------------------------------------ |
| Next.js ↔ Supabase    | Frontend ↔ Backend            | HTTPS    | Data queries, auth, storage.         |
| Client ↔ Edge Function| Client ↔ Server               | HTTPS    | Sensitive operations (verification, state transitions). |
| Middleware ↔ Auth     | Edge ↔ Supabase Auth          | JWT      | Route guarding, session validation.  |
| RLS ↔ Postgres        | Data layer                    | SQL      | Row-level access control.            |
| Realtime ↔ Client     | Supabase ↔ Client             | WebSocket | Order status, notifications.        |

### 5.3 UI Interfaces

All UI surfaces are defined in Book 03 (route inventory) and Book 04 (component specs). This SRS references them by route and component.

### 5.4 Communication Interfaces

| Channel       | Protocol | Security        | Purpose                          |
| ------------- | -------- | --------------- | -------------------------------- |
| Public web    | HTTPS    | TLS 1.3         | All user traffic.                |
| API           | HTTPS    | TLS 1.3 + JWT   | Data + edge functions.           |
| Realtime      | WSS      | TLS 1.3 + JWT   | Live updates.                    |
| Blockchain    | HTTPS    | TLS 1.3         | RPC reads.                       |
| Email         | SMTP/API | TLS             | Transactional email.             |

---

## 6. System Behavior & State Machines

### 6.1 Authentication State Machine

```text
[unauthenticated]
      |
      | register
      v
[unverified] ──email link──> [verified] ──login──> [authenticated]
      |                         |
      | resend email            | password reset
      v                         v
[unverified]               [reset flow] ──> [authenticated]
```

| Transition              | Trigger                    | Guard                        |
| ----------------------- | -------------------------- | ---------------------------- |
| unauthenticated → unverified | Register form submit  | Email not already in use.    |
| unverified → verified   | Email link click           | Valid token, not expired.    |
| verified → authenticated| Login form submit          | Correct credentials.         |
| authenticated → unauthenticated | Logout / session expiry | —                    |
| authenticated → unauthenticated | Password reset forced | Security event.              |

### 6.2 Order State Machine

```text
[pending] ──payment verified──> [paid] ──shipped──> [shipped] ──delivered──> [delivered]
    |                              |
    | cancelled by user/admin      | verification failed
    v                              v
[cancelled]                   [pending] (stays, error shown)
```

| Transition              | Trigger                    | Guard                                                      | Actor   |
| ----------------------- | -------------------------- | ---------------------------------------------------------- | ------- |
| (created) → pending     | Order form submit          | User authenticated + email verified + wallet connected.    | Customer|
| pending → paid          | On-chain verification OK   | Correct address, amount, chain, N confirmations, not replayed. | System |
| pending → cancelled     | User cancels / admin cancels | Order not yet paid.                                      | Customer/Admin |
| paid → shipped          | Admin marks shipped        | Order is `paid`; tracking number optional.                 | Admin   |
| shipped → delivered     | Admin marks delivered      | Order is `shipped`.                                        | Admin   |
| paid → cancelled (refund)| Admin initiates refund    | Requires separate refund process (post-MVP full; MVP: manual). | Admin (SA) |

**State machine invariants:**
- No backward transitions except `paid → cancelled` (refund, SA only).
- No skip transitions (e.g., `pending → delivered` is illegal).
- All transitions are logged (§15).
- The client never drives state transitions; only Edge Functions do.

### 6.3 Payment Verification Flow

```text
1. Customer submits tx_hash via /app/order/payment
2. Edge Function receives (order_id, tx_hash, chain_id)
3. Edge Function reads tx from blockchain via public RPC:
   a. Verify tx exists and is confirmed (≥ N confirmations)
   b. Verify recipient == configured receiving address for this order
   c. Verify amount >= order amount
   d. Verify chain_id == expected chain for this order
   e. Verify tx_hash not already linked to another order (replay protection)
4. If all checks pass:
   a. Insert payment record (tx_hash, order_id, chain, amount, verified_at)
   b. Transition order: pending → paid
   c. Send confirmation email + in-app notification
5. If any check fails:
   a. Return error with reason code (not confirmed / wrong address / wrong amount / wrong chain / already used)
   b. Order remains pending
   c. Show user-friendly error with retry guidance
```

### 6.4 Wallet Connection Flow

```text
1. User clicks "Connect Wallet" on /app/wallet
2. Wallet picker opens (MetaMask / Coinbase / Trust / WalletConnect)
3. User selects wallet; wagmi triggers connection
4. Wallet prompts user to approve connection (in their wallet app)
5. On approval:
   a. Read wallet address (read-only; no private keys requested)
   b. Upsert (user_id, wallet_address, chain_id, connected_at) in wallet_links table
   c. Update UI to show connected wallet
6. On rejection / error:
   a. Show error with retry guidance
   b. No data written
```

### 6.5 Support Ticket State Machine

```text
[open] ──agent responds──> [pending_customer] ──customer responds──> [pending_agent]
                                                                       |
                                                                       | agent resolves
                                                                       v
                                                                  [resolved]
```

| Transition                       | Trigger               | Actor   |
| -------------------------------- | --------------------- | ------- |
| (created) → open                 | Customer submits ticket | Customer |
| open → pending_customer          | Agent responds        | Agent   |
| pending_customer → pending_agent | Customer responds     | Customer|
| pending_agent → resolved         | Agent resolves        | Agent   |
| resolved → open                  | Reopened (within 7d)  | Customer/Agent |

---

## 7. Data Requirements

### 7.1 High-Level Data Model

Detailed schema lives in Book 19 (Database Design) and Book 20 (Supabase Schema). This section defines the data model at the SRS level.

| Entity             | Purpose                              | Key Relationships                  |
| ------------------ | ------------------------------------ | ---------------------------------- |
| users              | Auth + profile data.                 | → orders, wallets, tickets, tx     |
| wallet_links       | Connected wallets per user (read-only address). | → users                   |
| orders             | Card orders with state machine.      | → users, order_items, payments     |
| order_items        | Line items per order (card type, qty). | → orders                         |
| cards              | Cards (physical/virtual) issued.     | → users, orders                   |
| payments           | Verified on-chain payments.          | → orders, users                   |
| transactions       | Transaction history (view of on-chain activity). | → users, payments       |
| support_tickets    | Customer support tickets.            | → users, messages                 |
| ticket_messages    | Messages within tickets.             | → support_tickets                 |
| notifications      | In-app + email notifications.        | → users                           |
| admin_users        | Admin role assignments.              | → users                           |
| audit_logs         | Audit trail for sensitive actions.   | → users (admin)                   |
| platform_settings  | Platform configuration (SA only).    | —                                  |

### 7.2 Data Integrity Rules

| Rule ID    | Rule                                                              | Enforcement          |
| ---------- | ----------------------------------------------------------------- | -------------------- |
| DI-01      | Every user has exactly one auth identity (Supabase Auth).         | Supabase Auth.       |
| DI-02      | An order must have at least one order_item.                       | DB constraint.       |
| DI-03      | A payment must reference exactly one order.                       | FK + unique constraint on tx_hash. |
| DI-04      | A tx_hash may only be linked to one order (replay protection).    | UNIQUE(tx_hash).     |
| DI-05      | Order state transitions must follow the state machine.            | Edge Function logic. |
| DI-06      | Wallet addresses are stored read-only; no private keys anywhere.  | Schema + lint guard. |
| DI-07      | Every table has RLS policies.                                     | Migration + advisors.|
| DI-08      | Audit logs are append-only.                                       | DB policy (no UPDATE/DELETE). |

### 7.3 Data Flows

See Book 01 §10.4 for the conceptual card order + payment data flow. Additional flows:

**Registration → Wallet → Order → Payment → Card:**
```
users (created) → wallet_links (address stored) → orders (pending) → payments (verified) → cards (issued)
```

**Admin Operations:**
```
admin_users (role check) → orders (state transition) → audit_logs (recorded) → notifications (sent)
```

---

## 8. Functional Requirements (System-Level)

These are system-level functional requirements, cross-referenced to Book 02's business-level FRs. Format: `SFR-XX-NNN` (System Functional Requirement).

### 8.1 Authentication (Module 02)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-02-001   | System shall create a Supabase Auth user on registration.  | FR-02-001     |
| SFR-02-002   | System shall send a verification email via Supabase Auth.   | FR-02-002     |
| SFR-02-003   | System shall enforce email verification before `/app` access (middleware). | FR-02-005 |
| SFR-02-004   | System shall implement password reset via Supabase Auth OTP flow. | FR-02-004 |
| SFR-02-005   | System shall validate passwords with zod (min 8 chars, 1 upper, 1 number). | FR-02-001 |
| SFR-02-006   | System shall rate-limit auth endpoints (5 attempts / 15 min / IP). | NFR-SEC-005 |
| SFR-02-007   | System shall establish JWT sessions via Supabase Auth cookies. | FR-02-003   |
| SFR-02-008   | System shall never request recovery phrases or private keys in any auth field. | BR-03/BR-04 |

### 8.2 Wallet Connection (Module 03)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-03-001   | System shall connect wallets via wagmi + WalletConnect v2.  | FR-03-001..004|
| SFR-03-002   | System shall store only the wallet address (read-only); never private keys. | FR-03-005 |
| SFR-03-003   | System shall upsert wallet_links on connection.             | FR-03-006     |
| SFR-03-004   | System shall allow wallet disconnection (delete wallet_links row). | FR-03-007 |
| SFR-03-005   | System shall display wallet connection errors with retry guidance. | FR-03-008 |

### 8.3 Card Ordering (Module 04)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-04-001   | System shall create an order in `pending` state on order submit. | FR-04-005 |
| SFR-04-002   | System shall enforce order state machine via Edge Function.  | FR-04-009     |
| SFR-04-003   | System shall require wallet connection before order creation. | BR-02         |
| SFR-04-004   | System shall generate a unique receiving address + amount per order. | FR-05-001 |
| SFR-04-005   | System shall present order review before confirmation.       | FR-04-004     |
| SFR-04-006   | System shall display order confirmation with order ID.       | FR-04-006     |
| SFR-04-007   | System shall provide order tracking with status + tracking number. | FR-04-007 |

### 8.4 Payments (Module 05)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-05-001   | System shall accept tx_hash submission from customer.        | FR-05-002     |
| SFR-05-002   | System shall verify tx on-chain via Edge Function (address, amount, chain, confirmations). | FR-05-003 |
| SFR-05-003   | System shall reject already-used tx hashes (UNIQUE constraint + check). | FR-05-004 |
| SFR-05-004   | System shall transition order to `paid` only after successful verification. | FR-05-005 |
| SFR-05-005   | System shall record payment with tx_hash, amount, chain, verified_at. | FR-05-006 |
| SFR-05-006   | System shall require N confirmations (configurable per chain). | FR-05-009     |
| SFR-05-007   | System shall never sign or broadcast transactions on behalf of the user. | BR-09     |
| SFR-05-008   | System shall handle RPC failures with retry + queue (graceful degradation). | NFR-REL-004 |

### 8.5 Customer Dashboard (Module 06)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-06-001   | System shall render `/app` overview with stats, recent orders, wallet status. | FR-06-001 |
| SFR-06-002   | System shall fetch user-scoped data via RLS-protected queries. | All FR-06-*   |
| SFR-06-003   | System shall display loading skeletons during data fetch (no CLS). | NFR-PERF-003 |
| SFR-06-004   | System shall display empty/error states per Book 04 §23.     | All FR-06-*   |

### 8.6 Admin Portal (Module 07)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-07-001   | System shall gate `/admin/*` via middleware RBAC check (admin or super_admin role). | FR-07-008 |
| SFR-07-002   | System shall enforce RBAC at RLS + Edge Function level (defense in depth). | NFR-SEC-004 |
| SFR-07-003   | System shall log all admin actions to audit_logs (append-only). | §15          |
| SFR-07-004   | System shall allow order state transitions by admin (paid → shipped → delivered). | FR-07-002 |
| SFR-07-005   | System shall restrict platform settings to super_admin role. | FR-07-006/FR-10-004 |

### 8.7 Support (Module 08)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-08-001   | System shall create support tickets linked to user_id + optional order_id. | FR-08-001/004 |
| SFR-08-002   | System shall enforce ticket state machine (§6.5).           | FR-08-002     |
| SFR-08-003   | System shall allow support agents to view and respond to assigned tickets. | FR-08-003 |

### 8.8 Notifications (Module 09)

| ID           | System Requirement                                          | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- |
| SFR-09-001   | System shall send transactional emails for auth, order, and payment events. | FR-09-001..003 |
| SFR-09-002   | System shall provide in-app notifications via Supabase Realtime. | FR-09-004     |
| SFR-09-003   | System shall render notifications with loading/empty/error states. | §23           |

---

## 9. Non-Functional Requirements (System-Level)

Cross-referenced to Book 02 NFRs. Format: `SNFR-XX-NNN`.

### 9.1 Performance

| ID           | System Requirement                                          | Target        | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- | ------------- |
| SNFR-PERF-001| Homepage LCP (4G).                                          | < 2.0s        | NFR-PERF-001  |
| SNFR-PERF-002| Dashboard API p95 response.                                 | < 500ms       | NFR-PERF-002  |
| SNFR-PERF-003| Core Web Vitals.                                            | Good (LCP<2.5s, INP<200ms, CLS<0.1) | NFR-PERF-003 |
| SNFR-PERF-004| First Contentful Paint (mobile 4G).                         | < 1.8s        | NFR-PERF-004  |
| SNFR-PERF-005| Edge Function cold start.                                   | < 400ms       | —             |
| SNFR-PERF-006| On-chain verification (including RPC round-trip).           | < 10s         | —             |

### 9.2 Reliability

| ID           | System Requirement                                          | Target        | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- | ------------- |
| SNFR-REL-001 | System availability.                                        | 99.9%         | NFR-REL-001   |
| SNFR-REL-002 | Payment verification accuracy (no false "paid").            | 100%          | NFR-REL-002   |
| SNFR-REL-003 | Order state machine integrity (no illegal transitions).     | 100%          | NFR-REL-003   |
| SNFR-REL-004 | RPC degradation recovery.                                   | Queue + retry | NFR-REL-004   |

### 9.3 Security

| ID           | System Requirement                                          | Target        | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- | ------------- |
| SNFR-SEC-001 | RLS on every table.                                         | 100%          | NFR-SEC-001   |
| SNFR-SEC-002 | No seed phrase / private key collection.                    | Enforced      | NFR-SEC-002   |
| SNFR-SEC-003 | Service-role key server-only.                               | Enforced      | NFR-SEC-003   |
| SNFR-SEC-004 | RBAC on admin actions.                                      | Enforced      | NFR-SEC-004   |
| SNFR-SEC-005 | Rate limiting on auth + verification.                       | Enforced      | NFR-SEC-005   |
| SNFR-SEC-006 | OWASP-aligned posture.                                      | Pass review   | NFR-SEC-006   |

### 9.4 Accessibility

| ID           | System Requirement                                          | Target        | Ref Book 02   |
| ------------ | ----------------------------------------------------------- | ------------- | ------------- |
| SNFR-A11Y-001| WCAG conformance.                                           | 2.1 AA        | NFR-A11Y-001  |
| SNFR-A11Y-002| Keyboard navigation.                                        | Full          | NFR-A11Y-002  |
| SNFR-A11Y-003| Screen reader semantics.                                    | Verified      | NFR-A11Y-003  |

---

## 10. Security Requirements

### 10.1 Transport Security

- HTTPS only (TLS 1.3); HTTP redirected to HTTPS.
- HSTS header enabled.
- All API and RPC calls over HTTPS.

### 10.2 Authentication & Authorization

- Supabase Auth with JWT sessions stored in HTTP-only cookies.
- Password hashing handled by Supabase Auth (bcrypt-based).
- RBAC enforced at three layers: middleware (route), Edge Function (action), RLS (data).
- Session validation on every request via middleware.

### 10.3 Data Protection

- RLS on every table (no exceptions).
- Service-role key used server-side only (Edge Functions, Server Components); never in client bundles.
- Anon/publishable key used client-side with RLS as the authority.
- No plaintext storage of sensitive data; PII minimized.

### 10.4 Input Validation

- All inputs validated with zod schemas (client + server).
- Server-side validation is the authority; client-side is for UX.
- SQL injection prevented via Supabase typed query helpers (parameterized).
- XSS prevented via React's default escaping + no `dangerouslySetInnerHTML`.

### 10.5 Rate Limiting

| Endpoint Type         | Limit                     | Enforcement        |
| --------------------- | ------------------------- | ------------------ |
| Auth (login/register) | 5 attempts / 15 min / IP  | Supabase Auth + middleware |
| Password reset        | 3 requests / hour / email | Supabase Auth      |
| Payment verification  | 10 requests / min / user  | Edge Function      |
| Support ticket create | 5 / hour / user           | Edge Function      |
| General API           | 100 / min / user          | Middleware         |

### 10.6 CSRF Protection

- SameSite=Lax cookies (default in Supabase SSR).
- Origin header validation on state-changing requests.
- No cookie-based auth for third-party domains.

### 10.7 Audit Logging

See §15.

### 10.8 Security Testing

- `supabase_get_advisors` (security) after every DDL migration.
- Axe DevTools in CI for accessibility.
- Manual security review pre-launch (Book 23 — Security).
- No secrets in client bundles (CI check).

---

## 11. Privacy Requirements

| ID    | Requirement                                                        | Enforcement             |
| ----- | ----------------------------------------------------------------- | ----------------------- |
| PR-01 | No recovery phrase collection.                                    | UX policy + lint guard. |
| PR-02 | No private key collection.                                        | UX policy + lint guard. |
| PR-03 | Minimal personal information (email + name + shipping address for physical). | Schema + RLS. |
| PR-04 | Encrypted storage (Supabase at-rest encryption).                  | Supabase default.       |
| PR-05 | Secure authentication (Supabase Auth).                            | Supabase default.       |
| PR-06 | Data export / erasure hook (GDCR-ready).                          | Post-MVP full; hook reserved. |
| PR-07 | No third-party tracking without consent.                          | Consent banner (post-MVP). |

---

## 12. Performance Requirements & Budgets

### 12.1 Route-Level Performance Budgets

| Route Type           | LCP Target | TTFB Target | JS Budget |
| ---------------------| ---------- | ----------- | --------- |
| Public (RSC)         | < 2.0s     | < 200ms     | < 80KB    |
| Auth (Client)        | < 1.5s     | < 200ms     | < 60KB    |
| App (Hybrid)         | < 2.0s     | < 300ms     | < 150KB   |
| Admin (Hybrid)       | < 2.0s     | < 300ms     | < 200KB   |

### 12.2 API Performance

| Endpoint Type              | Target (p95) |
| -------------------------- | ------------ |
| Public page data (RSC)     | < 200ms      |
| Dashboard data             | < 500ms      |
| Order creation             | < 500ms      |
| Payment verification       | < 10s (incl. RPC) |
| Admin list views           | < 500ms      |

### 12.3 Database Performance

- All foreign keys indexed.
- All frequently filtered columns indexed (e.g., `user_id`, `status`, `created_at`).
- Pagination via keyset (cursor) on large tables, not offset.
- Query plans reviewed for N+1 patterns.

### 12.4 Asset Performance

- Images: `next/image` with WebP/AVIF auto-negotiation.
- Lazy-load below-the-fold images.
- Fonts: `next/font` self-hosted (no external request).
- No image > 200KB on initial load.
- JS bundles: route-level code splitting (App Router default).

---

## 13. Reliability & Availability

| Requirement             | Target     | Strategy                                |
| ----------------------- | ---------- | --------------------------------------- |
| Uptime                  | 99.9%      | Vercel + Supabase SLAs; multi-AZ.       |
| Payment verification accuracy | 100% | On-chain independent verification.      |
| Order state integrity   | 100%       | Edge Function state machine + DB constraints. |
| RPC degradation recovery| Graceful   | Retry queue; fallback RPCs; user-visible "pending verification" state. |
| Data durability         | 99.999999% | Supabase Postgres (managed backups + replication). |

---

## 14. Error Handling & Exception Management

### 14.1 HTTP Status Codes

| Code | Meaning                  | Handling                                  |
| ---- | ------------------------ | ----------------------------------------- |
| 400  | Bad Request              | Validation error; user-friendly message.  |
| 401  | Unauthorized             | Redirect to `/auth/login`.                |
| 403  | Forbidden                | Branded 403 page; no sensitive info.      |
| 404  | Not Found                | Branded 404 per area (Book 03 §15).       |
| 429  | Too Many Requests        | Rate limit message + retry-after.         |
| 500  | Internal Server Error    | Generic message; log detail server-side.  |
| 502/503 | Upstream unavailable   | Retry guidance; status link.              |

### 14.2 Error Handling Principles

- **Never expose stack traces or technical details to users.**
- Log full error detail server-side (Sentry + Supabase logs).
- Show user-friendly message + retry button + support link (Book 04 §23).
- Errors are categorized: validation (user action), auth (redirect), system (log + generic message).
- Edge Functions return structured error codes for the client to map to UI.

### 14.3 Edge Function Error Contract

```ts
type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'VERIFICATION_FAILED'      // specific to payment verification
  | 'ALREADY_USED_TX'          // replay protection
  | 'INSUFFICIENT_CONFIRMATIONS'
  | 'RPC_ERROR'
  | 'INTERNAL_ERROR';

interface ErrorResponse {
  error: { code: ErrorCode; message: string; retryable: boolean };
}
```

---

## 15. Logging & Audit Trail

### 15.1 Log Categories

| Category                | Events                                              | Storage        |
| ----------------------- | --------------------------------------------------- | -------------- |
| Authentication logs     | Login, logout, register, password reset, email verify. | Supabase Auth logs |
| Order logs              | Order created, state transitions, cancellation.     | audit_logs + Supabase logs |
| Wallet connection logs  | Wallet connected, disconnected.                     | audit_logs     |
| Payment verification logs | Verification attempt, success, failure (with reason). | audit_logs + Supabase logs |
| Admin action logs       | User suspend/delete, order transition, settings change. | audit_logs (append-only) |
| System events           | Deployment, migration, cron, health.                | Vercel + Supabase logs |
| Error logs              | All unhandled errors.                               | Sentry + Supabase logs |

### 15.2 Audit Log Schema (Conceptual)

```text
audit_logs (
  id          uuid PK,
  actor_id    uuid (user_id or null for system),
  action      text,           -- e.g., 'order.transition', 'user.suspend'
  entity_type text,           -- 'order', 'user', 'payment'
  entity_id   uuid,
  metadata    jsonb,          -- before/after states, reason
  created_at  timestamptz
)
-- RLS: admin/super_admin read-only; no INSERT/UPDATE/DELETE from client.
-- INSERT only from Edge Functions (service-role).
```

### 15.3 Log Retention

- Audit logs: 2 years (regulatory readiness).
- Auth logs: 90 days (Supabase default).
- Error logs: 90 days (Sentry default).
- System logs: 30 days.

---

## 16. Monitoring & Alerting

### 16.1 Monitoring Targets

| Target             | Tool                  | Metrics                              |
| ------------------ | --------------------- | ------------------------------------ |
| Application health | Vercel Analytics      | Uptime, Web Vitals, traffic.         |
| API health         | Supabase logs + Sentry| Response times, error rates.         |
| Database health    | Supabase dashboard    | Connection count, slow queries, disk.|
| Error tracking     | Sentry                | Error rate, affected users, stack.   |
| Edge Functions     | Supabase logs         | Invocations, errors, duration.       |
| Blockchain RPC     | Custom (Edge Function)| RPC latency, failure rate.           |

### 16.2 Alerting

| Alert                    | Condition                          | Channel        |
| ------------------------ | ---------------------------------- | -------------- |
| Payment verification failure spike | Failure rate > 10% in 1h   | Email + Sentry |
| RPC endpoint degraded    | Latency p95 > 5s for 10 min        | Sentry         |
| Auth error spike         | Failed logins > 50 in 15 min       | Email          |
| Edge Function error rate | Error rate > 5% in 1h              | Sentry         |
| Deployment failure       | Vercel build/deploy fails          | Email + GitHub |

---

## 17. Backup & Recovery

| Item                | Strategy                                | Frequency  | Retention |
| ------------------- | --------------------------------------- | ---------- | --------- |
| Database            | Supabase managed backups.               | Daily      | 7 days    |
| Storage             | Supabase Storage replication.           | Continuous | —         |
| Code / migrations   | Git (GitHub) + Vercel + Supabase.       | Per commit | Forever   |
| Environment vars    | Vercel + Supabase (never in Git).       | On change  | —         |
| Point-in-time recovery | Supabase PITR (production).          | Continuous | 7 days    |

### 17.1 Recovery Objectives

| Objective   | Target     |
| ----------- | ---------- |
| RPO (data loss) | < 24h (daily backup) or < 1h (PITR) |
| RTO (recovery time) | < 4h |

---

## 18. Deployment & CI/CD

### 18.1 Environments

| Environment | Purpose                              | Hosting              |
| ----------- | ------------------------------------ | -------------------- |
| Development | Local dev (`supabase start`).        | Local                |
| Staging     | Pre-prod testing; Supabase branch DB.| Vercel preview + Supabase branch |
| Production  | Live at `twalletservices.com`.       | Vercel + Supabase prod |

### 18.2 CI/CD Pipeline

```text
GitHub push → Vercel preview deploy → Lint + Typecheck + Tests →
  → Supabase branch DB (if schema change) →
  → PR review → Merge to main → Vercel production deploy →
  → Supabase migration apply (if schema change) →
  → Security advisors check
```

### 18.3 Rollback

- Vercel: instant rollback to previous deployment via dashboard.
- Supabase: migrations are forward-only; rollback via new migration (never `down` on prod).
- Database: PITR for data recovery.

---

## 19. Testing Requirements

Detailed in Book 29 — Testing. Summary:

| Level       | Tool         | Coverage Target                      |
| ----------- | ------------ | ------------------------------------ |
| Unit        | Vitest       | Core logic (verification, state machine, validation). |
| Integration | Vitest + Supabase local | Edge Functions, RLS policies. |
| E2E         | Playwright   | Auth flow, order flow, payment flow, admin flow. |
| Accessibility| Axe CI      | Key user flows.                      |
| Security    | Advisors + manual | RLS, RBAC, no-seed policy.      |
| Performance | Lighthouse CI | Core Web Vitals on public pages.     |

---

## 20. Constraints & Assumptions

### 20.1 Constraints

See Book 01 §13. Additional system constraints:

- TypeScript strict mode; no `any`-first codepaths.
- No `down` migrations on production.
- No service-role key in client bundles.
- No raw SQL in client code; use typed query helpers.
- No client-driven state transitions (only Edge Functions).

### 20.2 Assumptions

See Book 02 §18. Additional system assumptions:

- Supabase Auth supports the required email/password + verification flow.
- WalletConnect v2 projectId is obtained and configured.
- Public RPC endpoints are available with sufficient rate limits.
- Vercel Edge runtime supports the middleware logic required.

---

## 21. Future Enhancements

See Book 02 §15. System-level hooks reserved:

| Feature          | System Hook Reserved                        |
| ---------------- | ------------------------------------------- |
| KYC              | User profile extension field + verification status. |
| Referral System  | referral_codes table + referral_links table.|
| Merchant Portal  | `/merchant` route group + merchant_users table. |
| Business Accounts| org_accounts table + org_members table.     |
| Mobile Apps      | API platform (Book 22) enables mobile clients. |
| API Marketplace  | API key management + rate limiting per key. |
| Advanced Analytics| Materialized views + analytics tables.     |

---

## 22. Implementation-Ready Template for Feature Books

Every feature book (Book 06+) must follow this template so OpenCode can implement with minimal ambiguity:

```markdown
# Book XX — [Feature Name]

## 1. Business Purpose
- What this feature does and why it exists (1–2 paragraphs).
- Trace to Book 02 FR IDs.

## 2. UI Specification
- Pages/routes (from Book 03).
- Component tree (from Book 04 / Book 10).
- Layout and responsive behavior.
- States (loading / empty / error / success).

## 3. Component Tree
```
Page (RSC or Client)
├── Layout
│   ├── Sidebar / Header
│   └── ...
├── Component A
│   ├── Sub-component
│   └── Sub-component
└── Component B
```

## 4. Database Tables Used
- Table name, columns, purpose.
- Reference to Book 19 (full schema) and Book 20 (RLS).

## 5. Supabase Queries
- Exact queries (typed) for each data operation.
- Client vs server (Edge Function) distinction.

## 6. RLS Policies
- Per-table policies for this feature.
- Which roles can SELECT / INSERT / UPDATE / DELETE.

## 7. API Endpoints / Server Actions
- Route handlers or Edge Functions.
- Request/response schemas (zod).
- Error codes (from SRS §14.3).

## 8. Validation Rules
- Zod schemas for inputs.
- Server-side validation authority.

## 9. Error Handling
- Error codes mapped to user messages.
- Retry behavior.

## 10. Loading States
- Skeletons per component.

## 11. Empty States
- Illustration + message + CTA.

## 12. Acceptance Criteria
- Numbered list of testable criteria.
- Gherkin (Given/When/Then) where useful.
```

---

## 23. Acceptance Criteria (Per Feature Area)

### 23.1 Authentication

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-AU-01 | Given a new email, when user registers, then a verification email is sent. |
| AC-AU-02 | Given an unverified user, when they access `/app`, then they are redirected to `/auth/verify-email`. |
| AC-AU-03 | Given a verified user, when they log in with correct credentials, then they reach `/app`. |
| AC-AU-04 | Given a forgotten password, when user requests reset, then a reset email is sent. |
| AC-AU-05 | Given a valid reset token, when user sets a new password, then they can log in with it. |
| AC-AU-06 | Given any auth form, then no field requests a recovery phrase or private key. |
| AC-AU-07 | Given 5 failed login attempts, then the IP is rate-limited for 15 minutes. |

### 23.2 Wallet Connection

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-WL-01 | Given an authenticated user, when they connect MetaMask, then their address is stored read-only. |
| AC-WL-02 | Given a connected wallet, when user disconnects, then the wallet_links row is deleted. |
| AC-WL-03 | Given any wallet flow, then no private key or seed phrase is ever requested. |
| AC-WL-04 | Given a wallet rejection, then a user-friendly error with retry is shown. |

### 23.3 Card Ordering

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-OR-01 | Given an authenticated + wallet-connected user, when they submit an order, then an order in `pending` state is created. |
| AC-OR-02 | Given a physical card order, when shipping step is reached, then a shipping address form is presented. |
| AC-OR-03 | Given a virtual card order, then the shipping step is skipped. |
| AC-OR-04 | Given an order, when review step is reached, then order details are shown for confirmation. |
| AC-OR-05 | Given an unverified user, when they try to order, then they are redirected to verify email. |
| AC-OR-06 | Given an order without a connected wallet, when user tries to order, then they are prompted to connect a wallet first. |

### 23.4 Payment Verification

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-PA-01 | Given a valid tx (correct address, amount, chain, confirmations), when verification runs, then order transitions to `paid`. |
| AC-PA-02 | Given a tx with wrong address, when verification runs, then order stays `pending` and error `VERIFICATION_FAILED` is returned. |
| AC-PA-03 | Given a tx with insufficient confirmations, when verification runs, then error `INSUFFICIENT_CONFIRMATIONS` is returned and verification can be retried. |
| AC-PA-04 | Given a tx already linked to another order, when verification runs, then error `ALREADY_USED_TX` is returned. |
| AC-PA-05 | Given a verified payment, then a payment record is created with tx_hash, amount, chain, verified_at. |
| AC-PA-06 | Given any payment flow, then the platform never signs or broadcasts a transaction. |
| AC-PA-07 | Given RPC degradation, then verification queues and retries; user sees "pending verification". |

### 23.5 Customer Dashboard

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-CD-01 | Given an authenticated user, when they view `/app`, then overview shows their stats, recent orders, and wallet status. |
| AC-CD-02 | Given a user with no orders, when they view `/app/orders`, then an empty state with CTA is shown. |
| AC-CD-03 | Given a user with orders, when they view `/app/orders/:id`, then order details + tracking are shown. |
| AC-CD-04 | Given a data fetch in progress, then skeleton loaders are shown (no CLS). |
| AC-CD-05 | Given a user, when they view `/app/transactions`, then only their own transactions are visible (RLS enforced). |

### 23.6 Admin Portal

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-AD-01 | Given a non-admin user, when they access `/admin`, then they receive 403 or redirect. |
| AC-AD-02 | Given an admin, when they transition an order from `paid` to `shipped`, then the state changes and an audit log is written. |
| AC-AD-03 | Given a super admin, when they access `/admin/settings`, then platform settings are editable. |
| AC-AD-04 | Given a regular admin, when they access `/admin/settings`, then they receive 403. |
| AC-AD-05 | Given an admin action, then it is logged to audit_logs (append-only). |

### 23.7 Support

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-SU-01 | Given an authenticated user, when they submit a ticket, then a ticket in `open` state is created. |
| AC-SU-02 | Given a ticket, when an agent responds, then state transitions to `pending_customer`. |
| AC-SU-03 | Given a ticket, when it is resolved, then state transitions to `resolved`. |
| AC-SU-04 | Given a ticket, then it is linked to the user and optionally to an order. |

### 23.8 Notifications

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-NO-01 | Given a registration, then a verification email is sent.       |
| AC-NO-02 | Given a successful payment verification, then a confirmation email + in-app notification are sent. |
| AC-NO-03 | Given an order state transition, then a notification is sent.  |

### 23.9 Cross-Cutting

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-CC-01 | Given any table, then RLS policies are present (verified by advisors). |
| AC-CC-02 | Given any client bundle, then `SUPABASE_SERVICE_ROLE_KEY` is not present. |
| AC-CC-03 | Given any page, then Core Web Vitals are "Good".              |
| AC-CC-04 | Given any interactive element, then it is keyboard-accessible. |
| AC-CC-05 | Given any error, then no stack trace is shown to the user.    |

---

## 24. Glossary

| Term            | Definition                                                        |
| --------------- | ----------------------------------------------------------------- |
| SRS             | Software Requirements Specification.                              |
| SFR             | System Functional Requirement (this book).                        |
| SNFR            | System Non-Functional Requirement (this book).                    |
| FR              | Functional Requirement (Book 02).                                 |
| NFR             | Non-Functional Requirement (Book 02).                             |
| AC              | Acceptance Criterion.                                             |
| State machine   | A model of allowed states and transitions for an entity.          |
| RLS             | Row Level Security (Postgres).                                    |
| RBAC            | Role-Based Access Control.                                        |
| RPC             | Remote Procedure Call (blockchain node endpoint).                 |
| Edge Function   | Supabase serverless function (Deno) for server-side logic.        |
| RSC             | React Server Component.                                           |
| PITR            | Point-in-Time Recovery.                                           |
| RPO/RTO         | Recovery Point/Time Objective.                                    |
| LCP/INP/CLS     | Core Web Vitals metrics.                                          |

---

## 25. References

- Book 01 — Project Foundation (`01-Foundation/BOOK_01_PROJECT_FOUNDATION.md`)
- Book 02 — Business Requirements (`01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md`)
- Book 03 — Information Architecture (`03-Architecture/BOOK_03_INFORMATION_ARCHITECTURE.md`)
- Book 04 — Design System (`02-UI-UX/BOOK_04_DESIGN_SYSTEM.md`)
- `00-Project/TECH_STACK.md`
- `00-Project/ROADMAP.md`
- `00-Project/CHANGELOG.md`
- `README.md`

### Downstream Books

| Book | Title              | Consumes Book 05 as...                |
| ---- | ------------------ | ------------------------------------- |
| 06+  | Feature books      | Follow the implementation-ready template (§22); satisfy the SFRs/SNFRs and acceptance criteria. |
| 19   | Database Design    | Implements data requirements (§7).    |
| 20   | Supabase Schema    | Implements RLS (§10.3) and data integrity (§7.2). |
| 22   | API Specifications | Implements Edge Function contracts (§14.3). |
| 23   | Security           | Implements security requirements (§10). |
| 28   | Deployment         | Implements CI/CD (§18).               |
| 29   | Testing            | Implements testing requirements (§19) and acceptance criteria (§23). |

---

## Next Book

**Book 06 — User Experience & User Flows** (`02-UI-UX/BOOK_06_USER_EXPERIENCE_AND_USER_FLOWS.md`): defines user experience goals, UX principles, all end-to-end user flows, page-by-page UX specifications, micro-interactions, state behaviors, timing budgets, and accessibility requirements per flow. The UX blueprint that guides every UI page OpenCode generates.

---

> End of Book 05 — Software Requirements Specification. This document is the technical system-level requirements contract. Any change to system behavior, state machines, security mechanisms, performance budgets, or acceptance criteria requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
