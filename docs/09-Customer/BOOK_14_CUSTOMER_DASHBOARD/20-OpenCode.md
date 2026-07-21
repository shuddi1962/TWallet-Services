# 20 — OpenCode Implementation

> The complete build directive for the entire Customer Dashboard.

---

## OpenCode Prompt

```
Build a premium fintech customer dashboard for TWallet Services using Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (customized to Book 04 tokens), Framer Motion, Lucide icons, Supabase, and wagmi/viem.

## Routes to Build
1. /app — Dashboard Overview (all widgets)
2. /app/wallet — Wallet management
3. /app/cards — Card management
4. /app/orders — Order list
5. /app/orders/[id] — Order details + tracking
6. /app/transactions — Transaction history
7. /app/transactions/[id] — Transaction details
8. /app/notifications — All notifications
9. /app/profile — Profile management
10. /app/settings — Settings
11. /app/security — Security center
12. /app/support — Support tickets
13. /app/support/[id] — Ticket detail (optional — can be modal)

## Architecture
- Server Components for page shells and data fetching (RSC)
- Client Components for interactive widgets (wagmi, forms, carousels, realtime)
- Server Actions for mutations (profile update, settings, ticket create, disconnect wallet)
- Supabase SSR for auth + data (createClient for server, createBrowserClient for client)
- createAdminClient for service-role operations (server-only, NEVER in client)
- Middleware: /app/* requires auth + email verified (from Book 09)
- RLS on all tables (user can only see own data)

## Layout
- App shell: Sidebar (260px, desktop) + TopBar (72px, sticky) + main content
- Mobile: Bottom tab bar (Overview, Cards, Orders, Wallet + More) + top bar (56px)
- Main content: 12-column grid, 32px gap, #F8FAFC bg
- Cards: #FFFFFF, 24px radius, shadow-md (resting), shadow-lg (hover)
- Section padding: 32px

## Dashboard Overview (/app)
Compose in order (see 01-Dashboard-Overview.md):
1. WelcomeBanner — greeting based on time of day + user name + card illustration
2. StatsGrid — 4 stat cards (Wallets, Orders, Transactions, Notifications) with count-up
3. QuickActions — 6 buttons (Connect Wallet, Order Card, Track Order, View Tx, Support, Settings)
4. WalletOverview (8 cols) — connected wallet info or empty state + connect CTA
5. NotificationPanel (4 cols) — 5 recent unread notifications
6. RecentOrders (8 cols) — 5 recent orders in compact table
7. RecentTransactions (4 cols) — 5 recent transactions
8. ActivityTimeline (12 cols) — 10 recent activities
All data fetched in parallel via Promise.all

## Top Navigation (see 02-Top-Navigation.md)
- 72px sticky, white bg, 1px bottom border, shadow-xs
- Left: Logo + Search (global search with dropdown results)
- Center: Breadcrumb (current page)
- Right: Notifications bell (with unread badge) + Wallet status + Profile dropdown (avatar + name + menu)
- Profile dropdown: Profile, Security, Settings, Logout
- Search: debounced 300ms, results grouped by category, `/` keyboard shortcut

## Sidebar (Desktop)
- 260px fixed left, white bg, 1px right border
- 8 nav items: Overview, Cards, Orders, Transactions, Wallet, Profile, Security, Settings
- Active: primary-light bg, primary text, 3px left primary bar
- Icons: Lucide 24px, labels 14px 500

## Mobile Navigation
- Bottom tab bar: 56px, 5 items (Overview, Cards, Orders, Wallet, More)
- "More" drawer: Profile, Security, Settings, Logout
- Top bar: 56px, logo + bell + avatar

## Component Library (src/components/dashboard/)
- DashboardHeader, Sidebar, BottomTabBar, StatsCard, QuickActions, WalletCard,
  WalletConnect, CardList, OrderTable, TransactionTable, NotificationPanel,
  ProfileForm, SettingsForm, SupportTickets, ActivityTimeline, SecurityCenter,
  EmptyState, ErrorState, SkeletonCard
- Each component: TypeScript props interface, loading/empty/error/success states

## Design System (Book 04 tokens)
- Primary: #2563EB, Bg: #F8FAFC, Surface: #FFFFFF, Border: #E2E8F0
- Heading: #0F172A, Body: #475569, Muted: #94A3B8
- Radius: 24px (cards), 14px (buttons/inputs)
- Shadow: shadow-md (resting), shadow-lg (hover)
- Font: Geist (next/font)
- Section: clamp(1.75rem, 5vw, 2.5rem), Body: 16px, Small: 14px, Caption: 12px

## Data Fetching (RSC)
- Use createClient() (server) for all queries
- RLS ensures user only sees own data
- Parallel fetch with Promise.all on dashboard overview
- Keyset pagination for lists (20 per page)
- Embedded selects to avoid N+1 (e.g., card_orders select '*, card_products(*), payment_transactions(*)')

## Server Actions
- disconnectWallet: soft-delete wallet + log event + log activity
- updateProfile: validate with Zod + update profiles table
- updateSettings: update preferences (JSONB or separate table)
- changePassword: supabase.auth.updateUser({ password }) + log activity
- createTicket: insert support_tickets + first ticket_message
- replyTicket: insert ticket_message
- markNotificationRead: update notifications set read=true
- markAllNotificationsRead: update all unread notifications
- dismissNotification: soft-delete notification
- revokeSession: sign out from other sessions

## Realtime
- Notifications: subscribe to INSERT on notifications table (filtered by profile_id)
- Order status: subscribe to UPDATE on card_orders (for tracking page)
- Use createBrowserClient for realtime subscriptions
- Unsubscribe on unmount

## States (All Pages)
- Loading: Skeleton components matching final content shape (no CLS)
- Empty: Illustration (64px icon) + message + CTA
- Error: Error card with friendly message + retry button + support link
- Success: Toast notification (slide-up, 3s auto-dismiss)

## Animations (Framer Motion)
- Page load: fade-in 300ms
- Stats: count-up 800ms easeOut
- Cards: hover lift translateY(-2px) 150ms
- Tabs: underline slide 200ms (layoutId)
- Notifications: slide-in 300ms, slide-out 200ms
- Modals: scale(0.96→1) 200ms
- Toasts: slide-up 300ms
- Timeline: progress line draw 400ms
- Switches: CSS transition 200ms
- ALL respect prefers-reduced-motion

## Accessibility (WCAG 2.1 AA)
- Skip-to-content link on every page
- Landmarks: header, nav, main, section
- One h1 per page, h2 per section, h3 per card
- :focus-visible ring on all interactive elements
- All forms: labels above inputs, errors in aria-live
- Tables: th scope
- Status badges: text + icon (not color alone)
- Tabs: ARIA tablist
- Modals: ARIA dialog, focus trap, Esc close
- Switches: role="switch", aria-checked
- Keyboard: full navigation via Tab; "/" for search; Esc closes modals

## SEO
- All dashboard pages: noindex, nofollow
- Page titles: "Dashboard | TWallet Services", "Wallet | TWallet Services", etc.

## Performance
- LCP < 2.0s, API p95 < 500ms, CLS < 0.1, INP < 200ms
- JS bundle < 150KB
- Lazy-load client islands (wallet, notifications, forms, charts)
- Parallel data fetching (Promise.all)
- Skeletons during load (no CLS)
- Keyset pagination for large lists

## Security
- RLS on all tables (user sees only own data)
- Service-role key server-only (NEVER in client)
- All inputs validated with Zod (client + server)
- No seed phrase or private key fields anywhere
- Trust notice on wallet pages

## File Structure
src/
├── app/
│   └── app/
│       ├── layout.tsx              (AppLayout — sidebar + topbar)
│       ├── page.tsx                (Dashboard Overview)
│       ├── wallet/page.tsx
│       ├── cards/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── transactions/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── notifications/page.tsx
│       ├── profile/page.tsx
│       ├── settings/page.tsx
│       ├── security/page.tsx
│       └── support/
│           ├── page.tsx
│           └── [id]/page.tsx
├── components/
│   └── dashboard/
│       ├── dashboard-header.tsx
│       ├── sidebar.tsx
│       ├── bottom-tab-bar.tsx
│       ├── stats-card.tsx
│       ├── quick-actions.tsx
│       ├── wallet-card.tsx
│       ├── card-list.tsx
│       ├── order-table.tsx
│       ├── transaction-table.tsx
│       ├── notification-panel.tsx
│       ├── profile-form.tsx
│       ├── settings-form.tsx
│       ├── support-tickets.tsx
│       ├── activity-timeline.tsx
│       ├── security-center.tsx
│       ├── empty-state.tsx
│       ├── error-state.tsx
│       └── skeleton-card.tsx
├── hooks/
│   ├── useWallet.ts
│   ├── useCountUp.ts
│   ├── useToast.ts
│   └── useRealtime.ts
└── lib/
    └── validations/
        ├── profile.ts
        ├── settings.ts
        └── support.ts

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-only)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_ALCHEMY_RPC_URL=...

Generate all files with full TypeScript types, strict mode, no `any`. Follow the TWallet Services Design System (Book 04) for all visual elements. Ensure all acceptance criteria (AC-CD-01 through AC-CD-15 from README.md) are satisfied. The dashboard must feel like Stripe + Coinbase + Vercel — premium, clean, fast, trustworthy. NEVER request seed phrases or private keys.
```
