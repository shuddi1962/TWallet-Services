# Book 14 — Customer Dashboard

> **TWallet Services · TWallet Card**
> The authenticated workspace for every user. This is the largest module in the project — 21 files covering every dashboard page, component, and interaction. Each file is independently implementable by OpenCode.

---

## Document Control

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Book         | 14 — Customer Dashboard              |
| Version      | 1.0.0                                |
| Status       | Approved                             |
| Priority     | Critical                             |
| Route        | `/app/*`                             |
| Type         | Modular folder (21 files)            |
| Created      | 2026-07-21                           |

---

## Overview

The Customer Dashboard is the authenticated workspace for every user. It provides one place to:

- View Wallet
- Order Cards
- Track Orders
- View Transactions
- Manage Profile
- View Notifications
- Contact Support
- Manage Settings

The dashboard should be minimal, elegant, and extremely fast.

---

## Dashboard Design Philosophy

### Inspired By
- Stripe Dashboard
- Coinbase
- Vercel
- Linear
- Notion
- Apple

### Avoid
- ❌ Crowded interfaces
- ❌ Too many colors
- ❌ Large tables everywhere

### Prefer
- ✓ White cards
- ✓ Plenty of whitespace
- ✓ Rounded corners (24px)
- ✓ Soft shadows
- ✓ Beautiful charts
- ✓ Smooth animations

---

## Routes

| Route | Page | File |
|-------|------|------|
| `/app` | Dashboard Overview | 01-Dashboard-Overview.md |
| `/app/wallet` | Wallet Overview | 06-Wallet-Overview.md |
| `/app/cards` | Card Management | 08-Card-Management.md |
| `/app/orders` | Order Management | 09-Order-Management.md |
| `/app/transactions` | Transaction History | 10-Transaction-History.md |
| `/app/profile` | Profile | 12-Profile.md |
| `/app/settings` | Settings | 13-Settings.md |
| `/app/security` | Security Center | 16-Security-Center.md |
| `/app/support` | Support | 14-Support.md |

---

## Layout

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────────┐
│  Top Navigation (72px, sticky)                        │
├────────┬─────────────────────────────────────────────┤
│        │                                              │
│  Side  │  Main Content Area                           │
│  bar   │                                              │
│  260px │  Welcome Banner (12 cols)                    │
│        │  Statistics (3+3+3+3)                        │
│        │  Quick Actions (12 cols)                     │
│        │  Wallet (8) + Notifications (4)              │
│        │  Recent Orders (8) + Transactions (4)        │
│        │  Activity Timeline (12 cols)                 │
│        │                                              │
├────────┴─────────────────────────────────────────────┤
│  (No footer in dashboard — app shell)                 │
└──────────────────────────────────────────────────────┘
```

### Tablet (768–1023px)
- Sidebar collapses to icons-only (72px) or hamburger drawer
- Grid: 2 columns for statistics, stacked for content

### Mobile (320–767px)
- Bottom tab bar (Overview, Cards, Orders, Wallet + More)
- Single column, stacked sections
- Full-width cards

---

## Grid System

12-column grid for the main content area:

| Section | Desktop Columns | Tablet | Mobile |
|---------|----------------|--------|--------|
| Welcome Banner | 12 | 12 | 12 |
| Statistics (4 cards) | 3+3+3+3 | 2+2 | 1+1+1+1 |
| Quick Actions | 12 | 12 | 12 |
| Wallet Overview | 8 | 12 | 12 |
| Notifications | 4 | 12 | 12 |
| Recent Orders | 8 | 12 | 12 |
| Transactions | 4 | 12 | 12 |
| Activity Timeline | 12 | 12 | 12 |

---

## Theme

| Token | Value | Usage |
|-------|-------|-------|
| Background | #F8FAFC (`--color-bg`) | Dashboard bg |
| Cards | #FFFFFF (`--color-surface`) | All cards |
| Radius | 24px (per user spec) | Card radius |
| Gap | 32px (`--space-8`) | Grid gap |
| Shadow (resting) | shadow-md | Default card |
| Shadow (hover) | shadow-lg | Hover state |
| Primary | #2563EB | CTAs, active states |
| Sidebar | #FFFFFF | Sidebar bg |
| Top nav | #FFFFFF | Top nav bg |
| Border | #E2E8F0 | Card borders, dividers |

---

## File Index

| File | Section | Component Type | Key Features |
|------|---------|---------------|--------------|
| `README.md` | This file | — | Folder index, philosophy, layout, grid, component map |
| `01-Dashboard-Overview.md` | Overview | RSC + Client | 12-col grid, all widgets composed |
| `02-Top-Navigation.md` | Top Navigation | Client (sticky) | 72px, search, notifications, profile |
| `03-Welcome-Banner.md` | Welcome Banner | RSC | Greeting, subtitle, card illustration |
| `04-Statistics.md` | Statistics | RSC + Client (count-up) | 4 stat cards, animated counters |
| `05-Quick-Actions.md` | Quick Actions | RSC | 6 action buttons in a row |
| `06-Wallet-Overview.md` | Wallet Overview | RSC + Client | Connected wallet, address, network |
| `07-Connected-Wallet.md` | Connected Wallet | Client (wagmi) | Connect/disconnect/switch/copy/explorer |
| `08-Card-Management.md` | Card Management | RSC | Virtual + physical cards, status, order new |
| `09-Order-Management.md` | Order Management | RSC + Client | Order list, filter, tracking, details |
| `10-Transaction-History.md` | Transaction History | RSC + Client | Tx table, filter, explorer links, export |
| `11-Notifications.md` | Notifications | RSC + Client (Realtime) | In-app notifications, mark read, dismiss |
| `12-Profile.md` | Profile | RSC + Client (form) | Personal info, shipping address, avatar |
| `13-Settings.md` | Settings | RSC + Client (forms) | Preferences, notifications, privacy |
| `14-Support.md` | Support | RSC + Client (form) | Ticket list, new ticket, messages |
| `15-Activity-Timeline.md` | Activity Timeline | RSC | Login/wallet/order activity, chronological |
| `16-Security-Center.md` | Security Center | RSC + Client (form) | Password change, sessions, 2FA (future) |
| `17-Mobile-Dashboard.md` | Mobile Dashboard | — | Responsive specs for all pages at 320–767px |
| `18-Animations.md` | Animations | — | Framer Motion patterns for dashboard |
| `19-Accessibility.md` | Accessibility | — | WCAG 2.1 AA checklist for dashboard |
| `20-OpenCode.md` | OpenCode Prompt | — | Complete build directive for entire dashboard |

---

## Component Library Map

Each dashboard component has a companion spec in the section files. Components live in `src/components/dashboard/`:

| Component | Spec File | Props | States |
|-----------|----------|-------|--------|
| `DashboardHeader` | 02-Top-Navigation.md | user, notifications, onLogout | loading, authed, unauthed |
| `Sidebar` | 02-Top-Navigation.md | navItems, activeRoute | collapsed, expanded, mobile drawer |
| `StatsCard` | 04-Statistics.md | label, value, icon, delta | loading (skeleton), loaded, error |
| `QuickActions` | 05-Quick-Actions.md | actions[] | loading, ready |
| `WalletCard` | 06-Wallet-Overview.md | wallet, onDisconnect | connected, disconnected, error |
| `WalletConnect` | 07-Connected-Wallet.md | onConnect, onDisconnect | idle, connecting, connected, failed |
| `CardList` | 08-Card-Management.md | cards[] | loading, empty, populated, error |
| `OrderTable` | 09-Order-Management.md | orders[], filters | loading, empty, populated, error |
| `TransactionTable` | 10-Transaction-History.md | transactions[], filters | loading, empty, populated, error |
| `NotificationPanel` | 11-Notifications.md | notifications[] | loading, empty, populated, unread |
| `ProfileForm` | 12-Profile.md | profile, onSave | idle, saving, saved, error |
| `SettingsForm` | 13-Settings.md | settings, onSave | idle, saving, saved, error |
| `SupportTickets` | 14-Support.md | tickets[], onNewTicket | loading, empty, populated, error |
| `ActivityTimeline` | 15-Activity-Timeline.md | activities[] | loading, empty, populated |
| `SecurityCenter` | 16-Security-Center.md | sessions[], onPasswordChange | idle, saving, saved, error |

---

## Performance Budget

| Metric | Target |
|--------|--------|
| Dashboard LCP | < 2.0s |
| Dashboard API (p95) | < 500ms |
| INP | < 200ms |
| CLS | < 0.1 |
| JS Bundle (dashboard) | < 150KB |
| Initial data load | < 500ms |

---

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-CD-01 | Given an authenticated user, when they navigate to /app, then the dashboard overview loads with all widgets in under 2s. |
| AC-CD-02 | Given the dashboard, then the sidebar shows: Overview, Cards, Orders, Transactions, Wallet, Profile, Security, Settings. |
| AC-CD-03 | Given the dashboard, then the welcome banner shows "Good Morning/Afternoon/Evening, [First Name]". |
| AC-CD-04 | Given the dashboard, then 4 stat cards display with count-up animation. |
| AC-CD-05 | Given the dashboard, then quick actions show: Connect Wallet, Order Card, Track Order, View Transactions, Support, Settings. |
| AC-CD-06 | Given the dashboard, then the wallet overview shows connected wallet or "Connect Wallet" CTA. |
| AC-CD-07 | Given the dashboard on mobile, then the bottom tab bar shows: Overview, Cards, Orders, Wallet + More. |
| AC-CD-08 | Given the dashboard, then all data is fetched via RLS-protected queries (user can only see own data). |
| AC-CD-09 | Given the dashboard, then loading states show skeletons (no CLS). |
| AC-CD-10 | Given the dashboard, then empty states show illustration + message + CTA. |
| AC-CD-11 | Given the dashboard, then error states show friendly message + retry. |
| AC-CD-12 | Given the dashboard, then all pages are noindex (not indexed by search engines). |
| AC-CD-13 | Given the dashboard, then all interactive elements are keyboard navigable. |
| AC-CD-14 | Given the dashboard, then the user can log out from the top navigation. |
| AC-CD-15 | Given the dashboard, then notifications show unread count badge in the top nav. |

---

## References

- Book 03 — Information Architecture (routes, layout, access control)
- Book 04 — Design System (tokens, components, states)
- Book 06 — User Experience & User Flows (dashboard page specs)
- Book 08 — Database Schema (all tables)
- Book 09 — Authentication System (session, middleware, route guard)
- Book 10 — Wallet Integration (wagmi hooks, wallet connection)
- Book 11 — Crypto Payments (transactions, payment history)
- Book 12 — System Architecture (RSC pattern, Server Actions, state management)
