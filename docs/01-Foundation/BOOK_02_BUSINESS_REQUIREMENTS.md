# Book 02 — Business Requirements

> **TWallet Services · TWallet Card**
> The complete catalog of functional and non-functional requirements, user roles, business rules, success metrics, scope boundaries, and release sequencing for the MVP and beyond. This book is the requirements contract that Books 03–20 implement against.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 02 — Business Requirements         |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Draft                              |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |
| Supersedes   | `00-Project/REQUIREMENTS.md` (index only — that file now points here) |

### Revision History

| Version | Date       | Author                  | Notes                                                |
| ------- | ---------- | ----------------------- | ---------------------------------------------------- |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft from planning workshop                 |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Enterprise expansion: FR/NFR enumeration, roles matrix, risk register |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Goals](#2-business-goals)
3. [Vision](#3-vision)
4. [Mission](#4-mission)
5. [Core Objectives](#5-core-objectives)
6. [Target Audience](#6-target-audience)
7. [User Roles](#7-user-roles)
8. [Core Modules](#8-core-modules)
9. [Functional Requirements (MVP)](#9-functional-requirements-mvp)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [MVP Feature Catalog](#11-mvp-feature-catalog)
12. [Success Metrics & KPIs](#12-success-metrics--kpis)
13. [Business Rules](#13-business-rules)
14. [Out of Scope (Version 1)](#14-out-of-scope-version-1)
15. [Future Releases](#15-future-releases)
16. [Project Timeline](#16-project-timeline)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Assumptions](#18-assumptions)
19. [Glossary](#19-glossary)
20. [References](#20-references)

---

## 1. Executive Summary

TWallet Services is a modern Web3 financial platform that enables users to securely connect supported cryptocurrency wallets, order premium virtual or physical payment cards, pay using cryptocurrency, monitor transactions, and manage their accounts through a professional dashboard.

The platform is designed with enterprise architecture, scalability, high security, and an intuitive user experience.

The first release (MVP, Version 1.0.0) focuses on **crypto payments only**. No fiat payment gateways will be integrated in Version 1. This constraint is foundational and drives several scope decisions in this book.

The platform is **non-custodial with respect to user keys**: it never collects recovery phrases or private keys, never signs or broadcasts transactions on behalf of the user, and verifies payments on-chain before confirming any order. Customer funds flow directly to a platform-configured receiving wallet address; the platform verifies, it does not escrow user balances.

This document enumerates the functional and non-functional requirements that every subsequent book (Information Architecture, Database, Auth, Wallet, Cards, Payments, Dashboards, Support, Security, APIs, Deployment, Testing) must satisfy.

---

## 2. Business Goals

The platform aims to:

| ID    | Goal                                                              | Horizon    |
| ----- | ---------------------------------------------------------------- | ---------- |
| BG-01 | Provide a secure card ordering experience.                       | MVP        |
| BG-02 | Allow users to connect supported wallets without exposing private keys. | MVP   |
| BG-03 | Enable cryptocurrency payments with on-chain verification.       | MVP        |
| BG-04 | Offer an elegant customer dashboard.                             | MVP        |
| BG-05 | Offer an enterprise administration portal.                       | MVP        |
| BG-06 | Build a trusted crypto payment ecosystem.                        | Year 1     |
| BG-07 | Become one of the leading crypto card service providers.         | Year 2–3   |

---

## 3. Vision

> **Become one of the leading crypto card service providers by delivering secure, reliable and user-friendly financial solutions.**

---

## 4. Mission

> **Provide premium crypto financial services that combine security, simplicity and innovation.**

---

## 5. Core Objectives

| ID    | Objective                  | Description                                                        | Measured By                |
| ----- | -------------------------- | ------------------------------------------------------------------ | -------------------------- |
| CO-01 | Secure Wallet Connection   | Standard-protocol wallet connections; no key custody.              | Connect success rate       |
| CO-02 | Crypto Payments            | Direct on-chain payment to receiving address; verified.            | Verification accuracy      |
| CO-03 | Card Ordering              | Physical + virtual card ordering with shipping & tracking.         | Order completion rate      |
| CO-04 | Order Tracking             | Real-time order status visibility for customers and admins.        | Status freshness           |
| CO-05 | Customer Dashboard         | Overview, cards, wallet, orders, tx, profile, settings.            | Task success rate          |
| CO-06 | Admin Management           | Users, orders, cards, tx, tickets, settings, analytics.            | Coverage %                 |
| CO-07 | Security                   | RLS, RBAC, no-seed policy, verified payments.                      | Security review pass       |
| CO-08 | Scalability                | Architecture supports growth without rework.                       | Load tests                 |

---

## 6. Target Audience

### 6.1 Primary Users

| Segment              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Crypto Investors     | Hold crypto in self-custody and want to spend it via a card.       |
| Traders              | Active wallets; need fast, transparent payment verification.       |
| Freelancers          | Paid in crypto; want a card for everyday spend.                    |
| Digital Entrepreneurs| Run online businesses; want non-custodial spend tooling.           |
| Businesses           | Small teams managing card orders and payments.                     |

### 6.2 Secondary Users

| Segment              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Corporate Clients    | Larger organizations (post-MVP, Business Accounts).                |
| Agencies             | Manage card programs on behalf of clients.                         |
| Developers           | Consume the API platform (post-MVP).                               |

> Detailed personas live in Book 01 §6. This book references them by role.

---

## 7. User Roles

### 7.1 Role Catalog

| Role               | Code | Description                                                        |
| ------------------ | ---- | ------------------------------------------------------------------ |
| Guest              | G    | Unauthenticated visitor browsing public pages.                     |
| Customer           | C    | Authenticated user who orders cards and pays.                      |
| Support Agent      | S    | Staff handling tickets; read access to user/order context.         |
| Administrator      | A    | Staff managing users, orders, cards, tx, settings.                 |
| Super Administrator| SA   | Full system access including admin management and config.          |

### 7.2 Permission Matrix (High-Level)

> Detailed cell-level permissions live in Book 06 (Database/RLS) and Book 12 (Admin). This matrix states the policy.

| Capability                          | G  | C  | S  | A  | SA |
| ----------------------------------- | -- | -- | -- | -- | -- |
| View public website                 | ✓  | ✓  | ✓  | ✓  | ✓  |
| Register / Login                    | ✓  | —  | —  | —  | —  |
| Connect own wallet                  | —  | ✓  | —  | —  | —  |
| Place / view own orders             | —  | ✓  | —  | —  | —  |
| Submit payment tx for verification  | —  | ✓  | —  | —  | —  |
| View own transactions               | —  | ✓  | —  | —  | —  |
| Open / view own support tickets     | —  | ✓  | —  | —  | —  |
| View all users                      | —  | —  | limited | ✓  | ✓  |
| View all orders                     | —  | —  | linked | ✓  | ✓  |
| Transition order states             | —  | —  | —  | ✓  | ✓  |
| Resolve support tickets             | —  | —  | ✓  | ✓  | ✓  |
| Manage admins / roles               | —  | —  | —  | —  | ✓  |
| Configure platform settings         | —  | —  | —  | —  | ✓  |
| View analytics                      | —  | —  | —  | ✓  | ✓  |

Legend: `✓` allowed · `—` denied · `limited`/`linked` = scoped to tickets they handle.

### 7.3 Role Enforcement

- Enforced via **Row Level Security** (Postgres) for data access.
- Enforced via **server-side checks** in Edge Functions for state transitions.
- Enforced via **route guards** in Next.js for UI surface area.
- The client is never trusted for authorization decisions.

---

## 8. Core Modules

| ID    | Module              | Description                                                        | Owner Book |
| ----- | ------------------- | ------------------------------------------------------------------ | ---------- |
| M-01  | Public Website      | Marketing and informational surfaces.                              | 03, 04, 05 |
| M-02  | Authentication      | Register, login, forgot password, email verification.             | 07         |
| M-03  | Wallet Connection   | Standard-protocol wallet linking.                                  | 08         |
| M-04  | Card Ordering       | Physical/virtual card orders, shipping, tracking.                  | 09         |
| M-05  | Payments            | Crypto payments + on-chain verification.                           | 10         |
| M-06  | Customer Dashboard  | Overview, cards, wallet, orders, tx, profile, settings.            | 11         |
| M-07  | Admin Dashboard     | Users, orders, cards, tx, tickets, settings, analytics.            | 12         |
| M-08  | Support Center      | Ticket system, live status.                                        | 13         |
| M-09  | Notifications       | Transactional and in-app notifications.                            | 14         |
| M-10  | Settings            | User and admin configuration.                                      | 11, 12     |

---

## 9. Functional Requirements (MVP)

Functional requirements are numbered `FR-XX-NNN` where `XX` is the module ID.

### 9.1 Public Website (M-01)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-01-001    | System shall render a Homepage with hero, features, and CTAs.                | Must     |
| FR-01-002    | System shall render an About page.                                            | Must     |
| FR-01-003    | System shall render a Pricing page.                                           | Must     |
| FR-01-004    | System shall render a How It Works page.                                      | Must     |
| FR-01-005    | System shall render an FAQ page.                                              | Must     |
| FR-01-006    | System shall render a Contact page with a working form.                       | Must     |
| FR-01-007    | System shall render a Support entry page.                                     | Must     |
| FR-01-008    | System shall render a global Footer with navigation, legal, and brand.        | Must     |
| FR-01-009    | Public pages shall be server-rendered for SEO.                                | Must     |
| FR-01-010    | Public pages shall be fully responsive (mobile-first).                        | Must     |

### 9.2 Authentication (M-02)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-02-001    | System shall allow user registration with email and password.                | Must     |
| FR-02-002    | System shall send an email verification link after registration.             | Must     |
| FR-02-003    | System shall allow login with verified credentials.                          | Must     |
| FR-02-004    | System shall provide a forgot-password reset flow via email.                 | Must     |
| FR-02-005    | System shall enforce email verification before dashboard access.             | Must     |
| FR-02-006    | System shall never request a recovery phrase or private key anywhere.        | Must     |
| FR-02-007    | System shall support secure session management and logout.                   | Must     |
| FR-02-008    | System shall rate-limit auth endpoints to prevent abuse.                     | Must     |

### 9.3 Wallet Connection (M-03)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-03-001    | System shall support WalletConnect v2.                                       | Must     |
| FR-03-002    | System shall support MetaMask.                                               | Must     |
| FR-03-003    | System shall support Coinbase Wallet.                                        | Must     |
| FR-03-004    | System shall support Trust Wallet (via WalletConnect).                       | Must     |
| FR-03-005    | System shall never request, store, or transmit private keys or seed phrases. | Must     |
| FR-03-006    | System shall persist a linked wallet address per user (read-only).           | Must     |
| FR-03-007    | System shall allow disconnecting a linked wallet.                            | Must     |
| FR-03-008    | System shall display connection errors with retry guidance.                  | Must     |

### 9.4 Card Ordering (M-04)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-04-001    | System shall allow ordering a Physical Card.                                 | Must     |
| FR-04-002    | System shall allow ordering a Virtual Card.                                  | Must     |
| FR-04-003    | System shall collect a shipping address for physical cards.                  | Must     |
| FR-04-004    | System shall present an order review step before confirmation.               | Must     |
| FR-04-005    | System shall create an order record with status `pending`.                   | Must     |
| FR-04-006    | System shall display order confirmation with order ID.                       | Must     |
| FR-04-007    | System shall provide order tracking with status transitions.                 | Must     |
| FR-04-008    | System shall require registration + wallet connection before ordering.        | Must     |
| FR-04-009    | System shall enforce the order state machine (see Book 09).                  | Must     |

### 9.5 Payments (M-05)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-05-001    | System shall present the receiving wallet address and amount per order.       | Must     |
| FR-05-002    | System shall accept a transaction hash submitted by the customer.             | Must     |
| FR-05-003    | System shall verify the tx on-chain: correct address, amount, chain, confirmations. | Must |
| FR-05-004    | System shall reject already-used transactions (replay protection).           | Must     |
| FR-05-005    | System shall transition order to `paid` only after successful verification.   | Must     |
| FR-05-006    | System shall record a payment history per user/order.                         | Must     |
| FR-05-007    | System shall support EVM-compatible chains (set defined in Book 10).          | Must     |
| FR-05-008    | System shall never sign or broadcast transactions on behalf of the user.      | Must     |
| FR-05-009    | System shall require N confirmations before trusting a tx (N per chain).      | Must     |

### 9.6 Customer Dashboard (M-06)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-06-001    | System shall provide an Overview screen.                                     | Must     |
| FR-06-002    | System shall provide a Cards screen listing the user's cards.                | Must     |
| FR-06-003    | System shall provide a Wallet screen showing linked wallets + on-chain activity. | Must |
| FR-06-004    | System shall provide an Orders screen with status and tracking.               | Must     |
| FR-06-005    | System shall provide a Transactions screen with verified payment history.     | Must     |
| FR-06-006    | System shall provide a Profile screen.                                       | Must     |
| FR-06-007    | System shall provide a Settings screen.                                      | Must     |
| FR-06-008    | System shall provide a Security screen (password, sessions).                  | Must     |

### 9.7 Admin Dashboard (M-07)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-07-001    | System shall provide a Users management screen.                              | Must     |
| FR-07-002    | System shall provide an Orders management screen.                            | Must     |
| FR-07-003    | System shall provide a Cards management screen.                              | Must     |
| FR-07-004    | System shall provide a Transactions management screen.                       | Must     |
| FR-07-005    | System shall provide a Support Tickets management screen.                    | Must     |
| FR-07-006    | System shall provide a Settings screen (platform config).                    | Must     |
| FR-07-007    | System shall provide an Analytics screen.                                    | Must     |
| FR-07-008    | System shall enforce RBAC (Admin vs Super Admin).                            | Must     |

### 9.8 Support Center (M-08)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-08-001    | System shall allow customers to open support tickets.                        | Must     |
| FR-08-002    | System shall allow customers to view their ticket history and status.        | Must     |
| FR-08-003    | System shall allow support agents to view and respond to tickets.            | Must     |
| FR-08-004    | System shall link tickets to the relevant user/order/transaction context.    | Must     |
| FR-08-005    | System shall display live ticket status.                                     | Must     |

### 9.9 Notifications (M-09)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-09-001    | System shall send transactional emails for auth events.                      | Must     |
| FR-09-002    | System shall send transactional emails for order state changes.              | Must     |
| FR-09-003    | System shall send transactional emails for payment verification results.     | Must     |
| FR-09-004    | System shall provide in-app notifications for dashboard events.              | Must     |

### 9.10 Settings (M-10)

| ID           | Requirement                                                                  | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- |
| FR-10-001    | System shall allow users to update profile data.                             | Must     |
| FR-10-002    | System shall allow users to change their password.                           | Must     |
| FR-10-003    | System shall allow users to manage linked wallets.                           | Must     |
| FR-10-004    | System shall allow Super Admin to manage platform settings.                  | Must     |

---

## 10. Non-Functional Requirements

Numbered `NFR-XX-NNN` by category.

### 10.1 Performance (NFR-PERF)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-PERF-001 | Average page load on public pages.                                           | Below 2 seconds                 |
| NFR-PERF-002 | Dashboard API response (p95).                                                | Below 500ms                     |
| NFR-PERF-003 | Core Web Vitals.                                                             | "Good" (LCP<2.5s, INP<200ms, CLS<0.1) |
| NFR-PERF-004 | First Contentful Paint on mobile (4G).                                       | Below 1.8s                      |

### 10.2 Reliability & Availability (NFR-REL)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-REL-001  | System availability.                                                         | 99.9%                           |
| NFR-REL-002  | Payment verification accuracy (no false "paid").                             | 100%                            |
| NFR-REL-003  | Order state machine integrity (no illegal transitions).                      | 100%                            |
| NFR-REL-004  | Recovery from blockchain RPC degradation.                                    | Graceful (queue + retry)        |

### 10.3 Security (NFR-SEC)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-SEC-001  | Row Level Security on every table.                                           | 100% of tables                  |
| NFR-SEC-002  | No collection of recovery phrases or private keys.                           | Enforced (lint + UX)            |
| NFR-SEC-003  | Service-role key never in client bundle.                                     | Enforced (build check)          |
| NFR-SEC-004  | RBAC enforcement on all admin actions.                                       | Enforced (server-side)          |
| NFR-SEC-005  | Rate limiting on auth and verification endpoints.                            | Enforced                        |
| NFR-SEC-006  | OWASP-aligned posture.                                                       | Pass security review            |

### 10.4 Accessibility (NFR-A11Y)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-A11Y-001 | Accessibility conformance.                                                   | WCAG 2.1 AA                     |
| NFR-A11Y-002 | Keyboard navigation.                                                         | Full coverage                   |
| NFR-A11Y-003 | Screen-reader semantics.                                                     | Verified on key flows           |

### 10.5 Compatibility (NFR-COMP)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-COMP-001 | Browser support.                                                             | Modern evergreen (Chrome, Safari, Firefox, Edge) |
| NFR-COMP-002 | Device support.                                                              | Mobile-first responsive; iOS + Android |
| NFR-COMP-003 | Wallet support.                                                              | MetaMask, Coinbase, Trust, WalletConnect v2 |

### 10.6 Scalability (NFR-SCALE)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-SCALE-001| Architecture shall scale horizontally without rework.                        | Verified by load test           |
| NFR-SCALE-002| Database shall handle 10x MVP volume without schema redesign.                | Verified by load test           |

### 10.7 Maintainability (NFR-MAINT)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-MAINT-001| TypeScript strict mode; no `any`-first codepaths.                            | Enforced (typecheck)            |
| NFR-MAINT-002| Lint cleanliness.                                                            | Enforced (lint)                 |
| NFR-MAINT-003| Every feature traces to a Book.                                              | Enforced (workflow)             |

### 10.8 SEO (NFR-SEO)

| ID           | Requirement                                                                  | Target                          |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------- |
| NFR-SEO-001  | Public pages server-rendered and indexable.                                  | Verified                        |
| NFR-SEO-002  | Metadata, OpenGraph, sitemap, robots.                                        | Implemented (Book 18)           |

---

## 11. MVP Feature Catalog

### 11.1 Public Website
- Homepage
- About
- Pricing
- How It Works
- FAQ
- Contact
- Support

### 11.2 Authentication
- Register
- Login
- Forgot Password
- Email Verification

### 11.3 Dashboard
- Overview
- Cards
- Wallet
- Orders
- Transactions
- Profile
- Settings

### 11.4 Cards
- Physical Card
- Virtual Card
- Card Tracking

### 11.5 Payments
- Crypto Payments
- Transaction Verification

### 11.6 Support
- Ticket System
- Live Status

---

## 12. Success Metrics & KPIs

| KPI                              | Target            | Source FR/NFR               |
| -------------------------------- | ----------------- | --------------------------- |
| System availability              | 99.9%             | NFR-REL-001                 |
| Average page load                | Below 2 seconds   | NFR-PERF-001                |
| Dashboard response               | Below 500ms       | NFR-PERF-002                |
| Wallet connection success        | Above 98%         | CO-01 / FR-03-001..004      |
| Order completion rate            | Above 95%         | CO-03 / FR-04-001..007      |
| Payment verification accuracy    | 100%              | NFR-REL-002 / FR-05-005     |
| Registration success rate        | Above 98%         | FR-02-001..005              |
| Accessibility conformance        | WCAG 2.1 AA       | NFR-A11Y-001                |
| Core Web Vitals                  | "Good"            | NFR-PERF-003                |

---

## 13. Business Rules

| ID    | Rule                                                                  | Enforcement Point                       |
| ----- | --------------------------------------------------------------------- | --------------------------------------- |
| BR-01 | Users must register before ordering.                                  | Auth guard on order route               |
| BR-02 | Wallet connection is required before payment.                         | Order creation precondition             |
| BR-03 | No recovery phrase collection.                                        | UX policy + lint guard                  |
| BR-04 | No private key collection.                                            | UX policy + lint guard                  |
| BR-05 | Payment must be verified before an order is confirmed.                | Order state machine (Book 09/10)        |
| BR-06 | Only confirmed blockchain transactions create paid orders.            | Verification Edge Function (Book 10)    |
| BR-07 | A transaction may only be used once across orders.                    | Unique constraint on tx hash            |
| BR-08 | Admin actions require RBAC role.                                      | RLS + server-side checks                |
| BR-09 | The platform never signs or broadcasts user transactions.             | Architecture constraint                 |
| BR-10 | Customer funds go directly to the configured receiving address.       | Architecture constraint                 |

---

## 14. Out of Scope (Version 1)

| Item                  | Rationale                                            | Revisit |
| --------------------- | ---------------------------------------------------- | ------- |
| Fiat Payments         | MVP is crypto-only.                                  | v2      |
| Loans                 | Not part of card platform scope.                     | —       |
| Crypto Exchange       | Out of non-custodial card scope.                     | —       |
| NFT Marketplace       | Out of scope.                                        | —       |
| Staking               | Out of scope.                                        | v2+     |
| Savings               | Out of scope.                                        | v2+     |
| Bank Transfers        | Requires fiat rails.                                 | v2      |
| Debit Card Funding    | Requires fiat rails / issuer depth.                  | v2      |

> Any change to this list requires a version bump in Book 01 and a `CHANGELOG.md` entry.

---

## 15. Future Releases

### 15.1 Version 2

| Feature              | Notes                                                |
| -------------------- | ---------------------------------------------------- |
| Referral Program     | Track referrals and rewards.                         |
| Rewards              | Card spend rewards.                                  |
| Advanced Analytics    | Deeper admin/customer analytics.                     |
| KYC                  | Identity verification integration.                   |
| Merchant Portal      | Separate surface for merchants.                      |

### 15.2 Version 3

| Feature              | Notes                                                |
| -------------------- | ---------------------------------------------------- |
| Mobile App           | Native iOS/Android.                                  |
| Business Accounts    | Multi-user org accounts.                             |
| API Platform         | Public developer API.                                |
| Multi-language       | Localization.                                        |
| Multi-currency       | Currency display/selection.                          |
| Advanced Reporting   | Reporting and export.                                |

---

## 16. Project Timeline

| Phase    | Activities                                            | Owner Books |
| -------- | ----------------------------------------------------- | ----------- |
| Planning | Requirements, IA, design system.                      | 01–05       |
| Architecture | DB, APIs, security design.                        | 06, 15, 16 |
| UI Development | Component library, public + dashboard surfaces.   | 04, 05, 16 |
| Backend Development | Edge functions, auth, RLS.                       | 07, 10, 15 |
| Wallet Integration | WalletConnect, viem/wagmi.                        | 08          |
| Testing  | Unit, e2e, security, load.                            | 18          |
| Deployment | Vercel + Supabase production.                       | 17          |
| Maintenance | Monitoring, incident response.                     | 17, 15      |

---

## 17. Risks & Mitigations

| ID    | Risk                            | Severity | Likelihood | Mitigation                                                     |
| ----- | ------------------------------- | -------- | ---------- | -------------------------------------------------------------- |
| R-01  | Blockchain API Downtime         | High     | Medium     | Multi-RPC fallback; queue + retry for verification.            |
| R-02  | Wallet Provider Changes         | Medium   | Medium     | Use standard protocols (WalletConnect v2); abstract adapters.  |
| R-03  | Crypto Network Congestion       | Medium   | High       | Adjustable confirmations; status messaging; retry guidance.    |
| R-04  | Regulatory Changes              | High     | Medium     | Modular KYC hook; legal review; configurable geo policy.       |
| R-05  | Security Threats                | Critical | Medium     | RLS, RBAC, no-seed policy, security review, monitoring.        |
| R-06  | False "paid" via spoofed tx     | High     | Medium     | Independent on-chain verification (address/amount/chain/conf). |
| R-07  | Replay of tx across orders      | High     | Low        | Unique constraint on tx hash; check before marking paid.       |
| R-08  | Reorg invalidates a paid tx     | High     | Low        | N confirmations; monitor reorgs; flag for review.              |
| R-09  | Service-role key leak           | Critical | Low        | Server-only; build-time scan; env separation.                  |
| R-10  | Scope creep (fiat, yield, swaps)| Medium   | High       | Out-of-scope list enforced; version bump required to change.   |

---

## 18. Assumptions

1. Supabase is available and meets MVP uptime/performance.
2. Vercel is available and meets MVP uptime/performance.
3. Users have supported wallets (MetaMask, Coinbase, Trust, or any WalletConnect v2 wallet).
4. Blockchain providers (public RPC) remain operational.
5. Internet connection is available for the user.
6. A transactional email provider is configured.
7. The operator has legal/compliance guidance for served regions.
8. Accepted chain(s) and tokens are defined in Book 10.

---

## 19. Glossary

| Term                | Definition                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| MVP                 | Minimum Viable Product (Version 1.0.0).                                      |
| Non-custodial       | Platform never holds user private keys or recovery phrases.                  |
| Receiving Address   | Platform-owned wallet address users pay to.                                  |
| On-chain verification | Reading a tx from the blockchain to confirm it matches an order.          |
| RLS                 | Row Level Security (Postgres).                                               |
| RBAC                | Role-Based Access Control.                                                   |
| Order state machine | The set of allowed transitions for an order.                                 |
| Confirmation        | Number of blocks confirming a tx before trusting it.                         |
| Replay protection   | Preventing one tx from being used for two orders.                            |

---

## 20. References

- `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` — vision, scope, architecture
- `00-Project/PROJECT_OVERVIEW.md`
- `00-Project/TECH_STACK.md`
- `00-Project/ROADMAP.md`
- `00-Project/CHANGELOG.md`
- `README.md`

---

## Next Book

**Book 03 — Information Architecture** (`03-Architecture/BOOK_03_INFORMATION_ARCHITECTURE.md`): defines every page, route, user flow, navigation, and the Next.js application structure. The blueprint that Books 04–20 implement against.

---

> End of Book 02 — Business Requirements. This document is the requirements contract for the project. Any change to scope, business rules, or success metrics requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
