# Book 03 — Information Architecture

> **TWallet Services · TWallet Card**
> The blueprint for the entire Next.js application: every page, route, user flow, navigation pattern, layout, access-control rule, and SEO surface. Books 04–20 implement against this map.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 03 — Information Architecture      |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |

### Revision History

| Version | Date       | Author                  | Notes                                                                    |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (site map, page compositions, user journey)                |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Approved: `/app` + `/admin` split, App Router blueprint, route inventory, access-control matrix, multi-flow user journeys |

### Architectural Decision (v1.0.0)

The application separates the **marketing site** (`/`) from the **authenticated application** (`/app`) and the **admin portal** (`/admin`). This mirrors modern SaaS/fintech products, keeps routing and access control cleaner, and scales better than flat `/dashboard` + `/administrator` prefixes.

---

## Table of Contents

1. [Information Architecture Overview](#1-information-architecture-overview)
2. [IA Principles](#2-ia-principles)
3. [High-Level Site Map](#3-high-level-site-map)
4. [Application Areas](#4-application-areas)
5. [Next.js App Router Blueprint](#5-nextjs-app-router-blueprint)
6. [Route Inventory](#6-route-inventory)
7. [Public Website Pages](#7-public-website-pages)
8. [Authentication Pages](#8-authentication-pages)
9. [Customer Application Pages](#9-customer-application-pages)
10. [Admin Portal Pages](#10-admin-portal-pages)
11. [Navigation Structure](#11-navigation-structure)
12. [User Flows](#12-user-flows)
13. [Access Control & Route Guards](#13-access-control--route-guards)
14. [Layout System](#14-layout-system)
15. [Loading, Error & Not-Found States](#15-loading-error--not-found-states)
16. [URL Structure & Naming Conventions](#16-url-structure--naming-conventions)
17. [SEO Structure](#17-seo-structure)
18. [Sitemap & Robots](#18-sitemap--robots)
19. [Redirects](#19-redirects)
20. [Internationalization Hooks](#20-internationalization-hooks)
21. [Future Navigation](#21-future-navigation)
22. [Glossary](#22-glossary)
23. [References](#23-references)

---

## 1. Information Architecture Overview

The application is divided into **four major areas**, each with its own layout, access control, render strategy, and navigation pattern:

1. **Public Website** — marketing and informational surfaces (server-rendered, SEO-indexable).
2. **Authentication** — register, login, password recovery, email verification.
3. **Customer Application** — the authenticated user's workspace (`/app`).
4. **Admin Portal** — staff operations workspace (`/admin`).

> The `/dashboard` and `/administrator` prefixes from the original draft are replaced by `/app` and `/admin` respectively (see Architectural Decision v1.0.0).

---

## 2. IA Principles

| ID    | Principle                  | Rule                                                                    |
| ----- | -------------------------- | ----------------------------------------------------------------------- |
| IA-01 | Marketing is separate from product | Public site (`/`) is indexable and server-rendered; product surfaces (`/app`, `/admin`) are auth-gated. |
| IA-02 | One URL = one page         | No duplicate routes for the same content.                               |
| IA-03 | Predictable hierarchy      | Routes read as `area / resource / detail` (e.g., `/app/orders/:id`).   |
| IA-04 | Lowercase, hyphen-separated | URLs are lowercase; words separated by hyphens.                        |
| IA-05 | No trailing slashes        | Canonical URLs do not end with a slash.                                 |
| IA-06 | Access control by area     | Each top-level area (`/auth`, `/app`, `/admin`) has one guard policy.   |
| IA-07 | Render strategy by purpose | Public = RSC; Auth = Client forms; App/Admin = Hybrid (RSC + islands).  |
| IA-08 | Mobile-first navigation    | Every navigation pattern has a defined mobile equivalent.               |
| IA-09 | SEO on public only         | `/app` and `/admin` are `noindex`; `/` and `/auth` are handled per route. |
| IA-10 | Future-ready               | Structure supports i18n, merchant portal, developer portal without rework. |

---

## 3. High-Level Site Map

```text
TWallet Services (twalletservices.com)
│
├── /                              Public Website
│   ├── /how-it-works
│   ├── /cards
│   ├── /pricing
│   ├── /about
│   ├── /security
│   ├── /faq
│   ├── /support
│   └── /contact
│
├── /auth/*                        Authentication
│   ├── /auth/login
│   ├── /auth/register
│   ├── /auth/forgot-password
│   ├── /auth/reset-password
│   └── /auth/verify-email
│
├── /app/*                         Customer Application (auth-gated)
│   ├── /app                       Overview
│   ├── /app/cards                 My Cards
│   ├── /app/cards/:id             Card Details
│   ├── /app/order                 Order Wizard (new card)
│   │   ├── /app/order/shipping
│   │   ├── /app/order/review
│   │   ├── /app/order/payment
│   │   └── /app/order/confirmation
│   ├── /app/orders                Order History
│   ├── /app/orders/:id            Order Details + Tracking
│   ├── /app/transactions          Transactions
│   ├── /app/transactions/:id      Transaction Details
│   ├── /app/wallet                Wallet
│   ├── /app/profile               Profile
│   ├── /app/security              Security
│   └── /app/settings              Settings
│
└── /admin/*                       Admin Portal (RBAC-gated)
    ├── /admin                     Overview
    ├── /admin/users               Users
    ├── /admin/users/:id           User Details
    ├── /admin/orders              Orders
    ├── /admin/orders/:id          Order Details
    ├── /admin/cards               Cards
    ├── /admin/payments            Payments
    ├── /admin/wallets             Receiving Wallets
    ├── /admin/support             Support Tickets
    ├── /admin/content             Content Management
    └── /admin/settings            Platform Settings
```

---

## 4. Application Areas

| Area       | URL Prefix | Purpose                              | Auth         | Render Strategy     | Indexable |
| ---------- | ---------- | ------------------------------------ | ------------ | ------------------- | --------- |
| Public     | `/`        | Marketing, info, SEO.                | None         | RSC (server)        | Yes       |
| Auth       | `/auth`    | Authentication flows.                | Optional     | Client (forms)      | No        |
| Customer   | `/app`     | Customer workspace.                  | Required     | Hybrid (RSC + islands) | No    |
| Admin      | `/admin`   | Staff operations.                    | Required + RBAC | Hybrid (RSC + islands) | No    |
| API        | `/api`     | Route handlers (prefer Edge Functions for sensitive logic). | Per endpoint | Server               | No        |

---

## 5. Next.js App Router Blueprint

The folder structure below is the canonical implementation map for the Next.js 15 App Router. Route groups `(name)` do not affect the URL.

```text
src/app/
├── layout.tsx                          # Root layout — html/body, providers, fonts
├── globals.css                         # Tailwind + design tokens
├── not-found.tsx                       # Global 404
├── error.tsx                           # Global error boundary
│
├── (public)/                           # Route group — URL unchanged
│   ├── layout.tsx                      # Public layout — header + footer
│   ├── page.tsx                        # / (Home)
│   ├── how-it-works/page.tsx
│   ├── cards/page.tsx
│   ├── pricing/page.tsx
│   ├── about/page.tsx
│   ├── security/page.tsx
│   ├── faq/page.tsx
│   ├── support/page.tsx
│   └── contact/page.tsx
│
├── auth/
│   ├── layout.tsx                      # Auth layout — centered card, no public nav
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── verify-email/page.tsx
│
├── app/                                # Customer application (auth-gated)
│   ├── layout.tsx                      # App shell — sidebar + topbar
│   ├── page.tsx                        # /app (Overview)
│   ├── cards/
│   │   ├── page.tsx                    # /app/cards
│   │   └── [id]/page.tsx              # /app/cards/:id
│   ├── order/                          # Order wizard (detailed in Book 09)
│   │   ├── page.tsx                    # /app/order (choose card type)
│   │   ├── shipping/page.tsx
│   │   ├── review/page.tsx
│   │   ├── payment/page.tsx
│   │   └── confirmation/page.tsx
│   ├── orders/
│   │   ├── page.tsx                    # /app/orders
│   │   └── [id]/page.tsx              # /app/orders/:id (details + tracking)
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── wallet/page.tsx
│   ├── profile/page.tsx
│   ├── security/page.tsx
│   └── settings/page.tsx
│
├── admin/                              # Admin portal (RBAC-gated)
│   ├── layout.tsx                      # Admin shell — sidebar + topbar
│   ├── page.tsx                        # /admin (Overview)
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cards/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── payments/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── wallets/page.tsx
│   ├── support/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── content/page.tsx
│   └── settings/page.tsx
│
└── api/                                # Route handlers (prefer Supabase Edge Functions for sensitive logic)
    └── ...                             # Defined in Book 16
```

### Supporting Files (App-Level)

```text
src/
├── middleware.ts                       # Route guards (auth, RBAC, email-verified)
├── components/                         # Shared UI (Book 16)
├── lib/                                # Typed helpers (supabase clients, viem, utils)
├── config/                             # Site config, nav config, feature flags
├── types/                              # Generated + domain types
├── hooks/                              # Client hooks (wallet, auth state)
└── styles/                             # Tailwind config tokens
```

---

## 6. Route Inventory

| Route                          | App Router Path                  | Render    | Auth         | Role    | Indexable | Notes                                   |
| ------------------------------ | -------------------------------- | --------- | ------------ | ------- | --------- | --------------------------------------- |
| `/`                            | `(public)/page.tsx`              | RSC       | None         | —       | Yes       | Home                                    |
| `/how-it-works`                | `(public)/how-it-works/page.tsx` | RSC       | None         | —       | Yes       |                                         |
| `/cards`                       | `(public)/cards/page.tsx`        | RSC       | None         | —       | Yes       |                                         |
| `/pricing`                     | `(public)/pricing/page.tsx`      | RSC       | None         | —       | Yes       |                                         |
| `/about`                       | `(public)/about/page.tsx`        | RSC       | None         | —       | Yes       |                                         |
| `/security`                    | `(public)/security/page.tsx`     | RSC       | None         | —       | Yes       |                                         |
| `/faq`                         | `(public)/faq/page.tsx`          | RSC       | None         | —       | Yes       |                                         |
| `/support`                     | `(public)/support/page.tsx`      | RSC       | None         | —       | Yes       |                                         |
| `/contact`                     | `(public)/contact/page.tsx`      | RSC + Client | None      | —       | Yes       | Contact form is a client island         |
| `/auth/login`                  | `auth/login/page.tsx`            | Client    | Redirect if authed | — | No        | → `/app` if session                     |
| `/auth/register`               | `auth/register/page.tsx`         | Client    | Redirect if authed | — | No        | → `/app` if session                     |
| `/auth/forgot-password`        | `auth/forgot-password/page.tsx`  | Client    | None         | —       | No        |                                         |
| `/auth/reset-password`         | `auth/reset-password/page.tsx`   | Client    | Token-gated  | —       | No        | Invalid token → error state             |
| `/auth/verify-email`           | `auth/verify-email/page.tsx`     | Client    | None         | —       | No        | Success / failed / resend               |
| `/app`                         | `app/page.tsx`                   | Hybrid    | Required     | Customer| No        | Overview                                |
| `/app/cards`                   | `app/cards/page.tsx`             | Hybrid    | Required     | Customer| No        |                                         |
| `/app/cards/:id`               | `app/cards/[id]/page.tsx`        | Hybrid    | Required     | Customer| No        |                                         |
| `/app/order`                   | `app/order/page.tsx`             | Client    | Required     | Customer| No        | Wizard step 1 (Book 09)                 |
| `/app/order/shipping`          | `app/order/shipping/page.tsx`    | Client    | Required     | Customer| No        | Physical only                           |
| `/app/order/review`            | `app/order/review/page.tsx`      | Client    | Required     | Customer| No        |                                         |
| `/app/order/payment`           | `app/order/payment/page.tsx`     | Client    | Required     | Customer| No        | Pay + submit tx hash                    |
| `/app/order/confirmation`      | `app/order/confirmation/page.tsx`| Hybrid    | Required     | Customer| No        |                                         |
| `/app/orders`                  | `app/orders/page.tsx`            | Hybrid    | Required     | Customer| No        |                                         |
| `/app/orders/:id`              | `app/orders/[id]/page.tsx`       | Hybrid    | Required     | Customer| No        | Details + tracking                      |
| `/app/transactions`            | `app/transactions/page.tsx`      | Hybrid    | Required     | Customer| No        |                                         |
| `/app/transactions/:id`        | `app/transactions/[id]/page.tsx` | Hybrid    | Required     | Customer| No        |                                         |
| `/app/wallet`                  | `app/wallet/page.tsx`            | Hybrid    | Required     | Customer| No        | Connect/disconnect (client islands)     |
| `/app/profile`                 | `app/profile/page.tsx`           | Hybrid    | Required     | Customer| No        |                                         |
| `/app/security`                | `app/security/page.tsx`          | Hybrid    | Required     | Customer| No        | Password, sessions                      |
| `/app/settings`                | `app/settings/page.tsx`          | Hybrid    | Required     | Customer| No        |                                         |
| `/admin`                       | `admin/page.tsx`                 | Hybrid    | Required     | Admin/SA| No        | Overview                                |
| `/admin/users`                 | `admin/users/page.tsx`           | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/users/:id`             | `admin/users/[id]/page.tsx`      | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/orders`                | `admin/orders/page.tsx`          | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/orders/:id`            | `admin/orders/[id]/page.tsx`     | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/cards`                 | `admin/cards/page.tsx`           | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/payments`              | `admin/payments/page.tsx`        | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/wallets`               | `admin/wallets/page.tsx`         | Hybrid    | Required     | SA      | No        | Super Admin only for config changes     |
| `/admin/support`               | `admin/support/page.tsx`         | Hybrid    | Required     | Admin/SA/Support| No | Support role read access (Book 12)      |
| `/admin/content`               | `admin/content/page.tsx`         | Hybrid    | Required     | Admin/SA| No        |                                         |
| `/admin/settings`              | `admin/settings/page.tsx`        | Hybrid    | Required     | SA      | No        | Super Admin only                        |

> Render strategy: **RSC** = React Server Component (server-rendered); **Client** = Client Component (interactive); **Hybrid** = RSC shell with client islands for interactive parts.

---

## 7. Public Website Pages

### 7.1 `/` — Homepage
- Hero
- Features
- Card Showcase
- Dashboard Preview
- Why Choose Us
- Security
- Testimonials
- FAQ Preview
- Newsletter
- Footer

### 7.2 `/how-it-works`
- Step 1 — Create Account
- Step 2 — Verify Email
- Step 3 — Connect Wallet
- Step 4 — Order Card
- Step 5 — Pay with Crypto
- Step 6 — Track Order

### 7.3 `/cards`
- Physical Cards
- Virtual Cards
- Card Comparison
- Benefits
- Fees
- Supported Networks

### 7.4 `/pricing`
- Physical Card Pricing
- Virtual Card Pricing
- Shipping Fees
- Supported Networks
- Frequently Asked Questions

### 7.5 `/about`
- Company Story
- Mission
- Vision
- Core Values
- Timeline

### 7.6 `/security`
- Wallet Security
- Encryption
- Compliance
- Privacy
- Best Practices

### 7.7 `/faq`
- Grouped questions:
  - Cards
  - Payments
  - Wallets
  - Shipping
  - Accounts
  - Security

### 7.8 `/support`
- Support Ticket (entry)
- Knowledge Base
- Contact
- Status Page

### 7.9 `/contact`
- Email
- Phone
- Office Address
- Contact Form
- Google Maps

---

## 8. Authentication Pages

All auth pages live under `/auth` with a shared centered-card layout (no public header/footer). See Book 07 for detailed behavior.

### 8.1 `/auth/login`
- Email + Password
- Register link
- Forgot Password link
- Google Login (Future)

### 8.2 `/auth/register`
- Name
- Email
- Password
- Confirm Password
- Accept Terms

### 8.3 `/auth/forgot-password`
- Email
- Send Reset Link

### 8.4 `/auth/reset-password`
- New Password
- Confirm Password
- Token-gated (invalid/expired token → error state)

### 8.5 `/auth/verify-email`
- Verification Success
- Verification Failed
- Resend Email

---

## 9. Customer Application Pages

All pages under `/app` require authentication + verified email. Shared app shell with sidebar + topbar. See Books 08–11 for detailed behavior.

### 9.1 `/app` — Overview
- Quick Statistics
- Recent Orders
- Recent Transactions
- Wallet Status
- Notifications
- Card Preview
- Quick Actions

### 9.2 `/app/cards` — My Cards
- My Cards list
- Card Details (`/app/cards/:id`)
- View Card Status
- Order New Card (→ `/app/order`)
- Freeze Card (Future)

### 9.3 `/app/order` — Order Wizard (Book 09)
- Step 1 `/app/order` — Choose Physical / Virtual
- Step 2 `/app/order/shipping` — Shipping Address (physical only)
- Step 3 `/app/order/review` — Review Order
- Step 4 `/app/order/payment` — Pay with Crypto + submit tx hash
- Step 5 `/app/order/confirmation` — Order Confirmed

### 9.4 `/app/orders` — Orders
- Current Orders
- Completed Orders
- Cancelled Orders
- Order Details (`/app/orders/:id`)
- Tracking

### 9.5 `/app/transactions` — Transactions
- Incoming Payments
- Outgoing Payments
- Transaction Details (`/app/transactions/:id`)
- Blockchain Hash
- Export History

### 9.6 `/app/wallet` — Wallet
- Connected Wallet
- Wallet Address
- Network
- Disconnect Wallet
- Connect New Wallet

### 9.7 `/app/profile` — Profile
- Personal Information
- Shipping Address
- Preferences

### 9.8 `/app/security` — Security
- Password
- Two-Factor Authentication (Future)
- Sessions
- Connected Devices

### 9.9 `/app/settings` — Settings
- Theme
- Notifications
- Language (Future)
- Privacy

---

## 10. Admin Portal Pages

All pages under `/admin` require authentication + RBAC (Admin or Super Admin; Support role has scoped access on `/admin/support`). See Book 12 for detailed behavior.

### 10.1 `/admin` — Overview
- System Overview
- Revenue
- Orders
- Users
- Charts
- Recent Activity

### 10.2 `/admin/users` — Users
- Search Users
- Edit User
- Suspend User
- Delete User
- User Details (`/admin/users/:id`)

### 10.3 `/admin/orders` — Orders
- Pending
- Paid
- Shipped
- Delivered
- Cancelled
- Order Details (`/admin/orders/:id`)

### 10.4 `/admin/cards` — Cards
- Physical Cards
- Virtual Cards
- Card Inventory
- Card Status

### 10.5 `/admin/payments` — Payments
- Blockchain Payments
- Verification
- Refund Requests

### 10.6 `/admin/wallets` — Receiving Wallets
- Receiving Wallets
- Supported Networks
- Wallet Status
- (Config changes: Super Admin only)

### 10.7 `/admin/support` — Support
- Tickets
- Messages
- Priority
- Resolved

### 10.8 `/admin/content` — Content
- Homepage
- FAQ
- Pricing
- Blog (Future)

### 10.9 `/admin/settings` — Settings (Super Admin only)
- General Settings
- Platform Settings
- Security
- API Keys
- Email
- System Logs

---

## 11. Navigation Structure

### 11.1 Public Header (Primary Navigation)

| Label          | Route             |
| -------------- | ----------------- |
| Home           | `/`               |
| How It Works   | `/how-it-works`   |
| Cards          | `/cards`          |
| Pricing        | `/pricing`        |
| Security       | `/security`       |
| Support        | `/support`        |
| Dashboard      | `/app` (CTA)      |
| Login          | `/auth/login`     |

### 11.2 Public Footer

**Company**
- About → `/about`
- Careers → (Future)
- Contact → `/contact`

**Resources**
- Help Center → `/support`
- Documentation → (Future)
- Blog → (Future)

**Legal**
- Privacy → (Future `/privacy`)
- Terms → (Future `/terms`)
- Cookies → (Future `/cookies`)
- Compliance → `/security`

**Products**
- TWallet Card → `/cards`
- Virtual Card → `/cards`
- Physical Card → `/cards`
- Customer Dashboard → `/app`

### 11.3 Customer App Sidebar

| Label          | Route             | Icon |
| -------------- | ----------------- | ---- |
| Overview       | `/app`            | home |
| Cards          | `/app/cards`      | card |
| Orders         | `/app/orders`     | bag  |
| Transactions   | `/app/transactions` | receipt |
| Wallet         | `/app/wallet`     | wallet |
| Profile        | `/app/profile`    | user |
| Security       | `/app/security`   | shield |
| Settings       | `/app/settings`   | gear |

### 11.4 Admin Portal Sidebar

| Label          | Route             |
| -------------- | ----------------- |
| Overview       | `/admin`          |
| Users          | `/admin/users`    |
| Orders         | `/admin/orders`   |
| Cards          | `/admin/cards`    |
| Payments       | `/admin/payments` |
| Wallets        | `/admin/wallets`  |
| Support        | `/admin/support`  |
| Content        | `/admin/content`  |
| Settings       | `/admin/settings` |

### 11.5 Mobile Navigation

| Area    | Mobile Pattern                                             |
| ------- | --------------------------------------------------------- |
| Public  | Hamburger menu → full-width drawer with primary nav.      |
| Auth    | No nav; centered card only.                               |
| App     | Bottom tab bar (Overview, Cards, Orders, Wallet) + drawer for the rest. |
| Admin   | Hamburger → slide-in sidebar (desktop sidebar collapses). |

### 11.6 Breadcrumbs

- App and Admin surfaces use breadcrumbs (e.g., `Orders / #1024`).
- Public pages do not require breadcrumbs (flat hierarchy).

---

## 12. User Flows

### 12.1 Acquisition Flow (Guest → Register)

```text
Guest
  ↓
Homepage (/)
  ↓
How It Works (/how-it-works)
  ↓
Cards (/cards)
  ↓
Pricing (/pricing)
  ↓
Register (/auth/register)
```

### 12.2 Registration & Onboarding Flow

```text
Register (/auth/register)
  ↓
Verify Email (/auth/verify-email)
  ↓
Login (/auth/login)
  ↓
App Overview (/app)
  ↓
Connect Wallet (/app/wallet)
```

### 12.3 Card Order & Payment Flow (Core)

```text
App Overview (/app)
  ↓
My Cards (/app/cards)
  ↓
Order New Card (/app/order)            [choose physical/virtual]
  ↓
Shipping Address (/app/order/shipping) [physical only]
  ↓
Review Order (/app/order/review)
  ↓
Pay with Crypto (/app/order/payment)   [receiving address + amount + submit tx hash]
  ↓
Blockchain Confirmation                [server-side on-chain verification — Book 10]
  ↓
Order Confirmed (/app/order/confirmation)
  ↓
Track Order (/app/orders/:id)
  ↓
Card Delivered
```

> Detailed state machine and verification rules live in Books 09 and 10.

### 12.4 Wallet Connection Flow

```text
Wallet Page (/app/wallet)
  ↓
Connect New Wallet
  ↓
Choose Wallet (MetaMask / Coinbase / Trust / WalletConnect)
  ↓
Wallet prompts user to approve connection (user signs in own wallet)
  ↓
Address captured (read-only)
  ↓
Wallet Connected → redirect to /app
```

### 12.5 Support Flow (Customer)

```text
Support (/support) or App
  ↓
Open Ticket
  ↓
Ticket Created (status: open)
  ↓
Agent Responds (status: pending customer)
  ↓
Customer Replies (status: pending agent)
  ↓
Resolved (status: resolved)
```

### 12.6 Admin Order Management Flow

```text
Admin Overview (/admin)
  ↓
Orders (/admin/orders) → filter: Pending
  ↓
Order Details (/admin/orders/:id)
  ↓
Review payment verification
  ↓
Mark Shipped (state transition)
  ↓
Mark Delivered (state transition)
```

### 12.7 Admin User Management Flow

```text
Admin Users (/admin/users)
  ↓
Search Users
  ↓
User Details (/admin/users/:id)
  ↓
Edit / Suspend / Delete (RBAC-gated)
```

---

## 13. Access Control & Route Guards

Enforced in `src/middleware.ts` (Next.js middleware) plus server-side checks in Edge Functions and RLS policies. The client is never trusted for authorization.

### 13.1 Guard Matrix

| Area       | Condition                                           | On Failure                          |
| ---------- | --------------------------------------------------- | ----------------------------------- |
| `/`        | None                                                | —                                   |
| `/auth/*`  | If session exists → redirect away                  | Redirect to `/app`                  |
| `/app/*`   | Session required + email verified + customer role  | → `/auth/login` (or `/auth/verify-email`) |
| `/admin/*` | Session required + email verified + admin/super-admin role | → `/auth/login` or 403         |

### 13.2 Middleware Logic

```text
request →
  match route prefix
  → /auth/*   : if session → redirect(/app)
  → /app/*    : if !session → redirect(/auth/login)
                if !email_verified → redirect(/auth/verify-email)
  → /admin/*  : if !session → redirect(/auth/login)
                if role not in [admin, super_admin] → 403
  → else      : continue
```

### 13.3 Defense in Depth

- Middleware handles route-level gating (fast, edge).
- Server Components / Edge Functions re-check auth for data access.
- RLS policies are the final authority at the database layer.
- No client-side gate is ever the only check.

---

## 14. Layout System

| Layout                       | Path                          | Wraps                            | Contains                                |
| ---------------------------- | ----------------------------- | -------------------------------- | --------------------------------------- |
| Root layout                  | `app/layout.tsx`              | Everything                       | `<html>`, `<body>`, providers, fonts    |
| Public layout                | `(public)/layout.tsx`         | Public pages                     | Header, Footer                          |
| Auth layout                  | `auth/layout.tsx`             | Auth pages                       | Centered card, brand mark, no nav       |
| App layout (customer)        | `app/layout.tsx`              | `/app/*`                         | Sidebar, topbar, notifications bell     |
| Admin layout                 | `admin/layout.tsx`            | `/admin/*`                       | Admin sidebar, topbar, role badge       |

### 14.1 Layout Principles

- Root layout is minimal (no chrome).
- Each area owns its chrome (header/footer, sidebar/topbar).
- Auth layout is intentionally chromeless to focus the user.
- App and Admin layouts are distinct; admin is never rendered inside the customer shell.

---

## 15. Loading, Error & Not-Found States

| File                          | Scope        | Purpose                                              |
| ----------------------------- | ------------ | ---------------------------------------------------- |
| `app/loading.tsx`             | Global       | Top-level route segment suspense fallback.           |
| `app/error.tsx`               | Global       | Top-level error boundary.                            |
| `app/not-found.tsx`           | Global       | Global 404.                                          |
| `(public)/loading.tsx`        | Public       | Skeleton for public pages.                           |
| `auth/loading.tsx`            | Auth         | Auth form skeletons.                                 |
| `app/loading.tsx`             | App          | App shell skeleton (sidebar + content).              |
| `app/error.tsx`               | App          | App-level error boundary (keeps shell intact).       |
| `app/not-found.tsx`           | App          | 404 for unknown `/app/*` routes.                     |
| `admin/loading.tsx`           | Admin        | Admin shell skeleton.                                |
| `admin/error.tsx`             | Admin        | Admin-level error boundary.                          |
| `admin/not-found.tsx`         | Admin        | 404 for unknown `/admin/*` routes.                   |

### 15.1 Strategy

- Public 404 → branded, helpful, with links to key pages.
- App/Admin 404 → scoped, with link back to area root.
- Errors → user-friendly message + retry; technical detail logged server-side (never exposed).
- Loading → skeletons matching the final content shape (no layout shift).

---

## 16. URL Structure & Naming Conventions

### 16.1 URL Structure

```text
/                  Public pages
/auth/*            Authentication
/app/*             Customer application
/admin/*           Admin portal
/api/*             Backend route handlers (Supabase Edge Functions preferred for sensitive logic)
```

### 16.2 Naming Convention

| Rule                  | Example              |
| --------------------- | -------------------- |
| Lowercase             | `how-it-works`       |
| Hyphen-separated      | `order-history`      |
| No trailing slashes   | `/app/cards` (not `/app/cards/`) |
| Plural for collections| `/app/orders`        |
| `:id` for detail      | `/app/orders/:id`    |
| No file extensions    | —                    |
| No query-driven pages for primary content | (filters via query are allowed) |

---

## 17. SEO Structure

### 17.1 Public Pages (Indexable)

| Element          | Implementation                                |
| ---------------- | --------------------------------------------- |
| Readable URLs    | Hyphen-separated, lowercase.                  |
| Meta Titles      | Per-route, 50–60 chars.                       |
| Meta Descriptions| Per-route, 150–160 chars.                     |
| OpenGraph        | `og:title`, `og:description`, `og:image`, `og:url` |
| Twitter Cards    | `twitter:card`, `twitter:title`, `twitter:image` |
| Schema.org       | Organization, FAQ, Breadcrumb where relevant. |
| Canonical URLs   | Per-route `<link rel="canonical">`.           |
| Hreflang         | Prepared (i18n hook, see §20).                |

### 17.2 Auth / App / Admin Pages (Noindex)

- `/auth/*`, `/app/*`, `/admin/*` → `noindex, nofollow`.
- Implemented via metadata `robots` per layout.

### 17.3 Metadata Ownership

- Each `page.tsx` exports a `metadata` object (or `generateMetadata` for dynamic routes).
- A central `src/config/seo.ts` holds site defaults (site name, OG image, Twitter handle).

---

## 18. Sitemap & Robots

### 18.1 Sitemap (`/sitemap.xml`)

- Generated via `app/sitemap.ts` (Next.js metadata API).
- Includes all public routes only.
- Dynamic content (e.g., future blog posts) appended when available.

### 18.2 Robots (`/robots.txt`)

- Generated via `app/robots.ts`.
- Allow all public paths.
- Disallow `/auth`, `/app`, `/admin`, `/api`.
- Reference the sitemap URL.

---

## 19. Redirects

| From             | To                | Reason                                     |
| ---------------- | ----------------- | ------------------------------------------ |
| `/dashboard`     | `/app`            | Legacy prefix (if any inbound links).      |
| `/administrator` | `/admin`          | Legacy prefix (if any inbound links).      |
| `/login`         | `/auth/login`     | Short alias.                               |
| `/register`      | `/auth/register`  | Short alias.                               |
| `/support`       | `/support` (kept) | Public support stays at root.              |

> Redirects defined in `next.config.ts` (rewrites/redirects) for permanent moves.

---

## 20. Internationalization Hooks

The MVP is English-only, but the architecture must not block i18n.

- Route structure is i18n-ready: a `(public)/(en)` route group can be introduced without breaking URLs.
- Metadata API supports `alternates.languages` for hreflang.
- Strings will live in a `src/locales/` structure (keyed) from day one — even if only `en` is populated.
- Navigation config is data-driven (not hardcoded), so labels can be localized.

> Full i18n is a Version 3 feature (Book 02 §15.2). The hooks here only guarantee no rework.

---

## 21. Future Navigation

Reserved routes / areas for post-MVP (do not implement in MVP):

| Area              | Route (reserved)     | Version |
| ----------------- | -------------------- | ------- |
| Merchant Portal   | `/merchant`          | v2      |
| Developer Portal  | `/developers`        | v3      |
| API Documentation | `/docs`              | v3      |
| Referral Dashboard| `/app/referrals`     | v2      |
| Affiliate Dashboard| `/affiliate`         | v2      |
| Business Dashboard| `/business`          | v3      |
| Status Page       | `/status`            | v2      |
| Community         | `/community`         | v3      |

---

## 22. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| IA                  | Information Architecture.                                         |
| App Router          | Next.js 15 routing system (file-based, layouts, RSC).             |
| RSC                 | React Server Component.                                           |
| Route group         | `(name)` folder that groups routes without affecting the URL.     |
| Hybrid page         | RSC shell with client islands for interactivity.                  |
| Route guard         | Middleware/server check that gates access to a route area.        |
| RBAC                | Role-Based Access Control.                                        |
| RLS                 | Row Level Security (Postgres).                                    |
| Sitemap             | `/sitemap.xml` listing indexable URLs for search engines.         |
| Wizard              | Multi-step flow (e.g., card order) spread across routes.          |

---

## 23. References

- `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` — vision, scope, architecture
- `01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md` — requirements, roles, business rules
- `00-Project/TECH_STACK.md` — stack
- `00-Project/ROADMAP.md` — roadmap
- `00-Project/CHANGELOG.md` — change log
- `README.md` — project index

### Downstream Books That Implement This Blueprint

| Book | Title              | Consumes Book 03 as...                |
| ---- | ------------------ | ------------------------------------- |
| 04   | Design System      | Visual tokens + component specs       |
| 05   | UI/UX System       | Page composition + navigation patterns|
| 05   | Design System      | Layout primitives + mobile patterns   |
| 06   | Database Design    | Route → resource mapping              |
| 07   | Authentication     | Auth routes + guards                  |
| 08   | Wallet Integration | `/app/wallet` + order payment step    |
| 09   | Card Ordering      | `/app/order/*` wizard                 |
| 10   | Crypto Payments    | Payment step + verification           |
| 11   | Customer Dashboard | `/app/*` pages                        |
| 12   | Admin Dashboard    | `/admin/*` pages                      |
| 13   | Support Center     | `/support` + `/admin/support`         |
| 16   | APIs               | `/api/*` and Edge Function surface    |
| 17   | Deployment         | Route-level middleware + redirects    |
| 18   | SEO                | Public metadata, sitemap, robots      |

---

## Next Book

**Book 04 — Design System** (`02-UI-UX/BOOK_04_DESIGN_SYSTEM.md`): defines every design token, spacing rule, typography scale, color system, button/form/card/table/chart component, and reusable pattern so the entire application has a consistent, enterprise-quality look. Implements the page compositions and navigation patterns defined here.

---

> End of Book 03 — Information Architecture. This document is the application blueprint. Any change to routes, areas, access-control boundaries, or the `/app` + `/admin` split requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
