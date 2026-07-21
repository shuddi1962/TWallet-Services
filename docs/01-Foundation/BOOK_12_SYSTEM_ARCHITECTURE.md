# Book 12 — System Architecture

> **TWallet Services · TWallet Card**
> The engineering architecture document that gives OpenCode a strong foundation before building feature pages. Documents the Next.js App Router folder structure, Server Components vs. Client Components, Server Actions, Supabase integration patterns, middleware, route protection, state management, caching, error logging, and deployment architecture. This is the document that ensures consistency across the codebase.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 12 — System Architecture           |
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

| Version | Date       | Author                | Notes                                              |
| ------- | ---------- | --------------------- | -------------------------------------------------- |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft                                      |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: full system architecture spec            |

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Next.js App Router Folder Structure](#2-nextjs-app-router-folder-structure)
3. [Server Components vs. Client Components](#3-server-components-vs-client-components)
4. [Server Actions](#4-server-actions)
5. [Supabase Integration Patterns](#5-supabase-integration-patterns)
6. [Authentication Middleware](#6-authentication-middleware)
7. [Route Protection](#7-route-protection)
8. [Environment Variables](#8-environment-variables)
9. [API / Service Layer](#9-api--service-layer)
10. [State Management Strategy](#10-state-management-strategy)
11. [File Upload Architecture](#11-file-upload-architecture)
12. [Error Logging](#12-error-logging)
13. [Caching and Revalidation](#13-caching-and-revalidation)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Performance Architecture](#15-performance-architecture)
16. [Security Architecture](#16-security-architecture)
17. [Type Safety Architecture](#17-type-safety-architecture)
18. [References](#18-references)

---

## 1. Architecture Overview

### 1.1 High-Level Diagram

```
                    ┌─────────────────────────┐
                    │       User (Browser)      │
                    │  Next.js 15 App Router    │
                    └───────────┬─────────────┬─┘
                                │             │
                      HTTPS / RSC      Wallet connection
                                │        (WalletConnect v2)
                                ▼             │
                    ┌──────────────────┐     │
                    │      Vercel       │     │ user signs tx
                    │  (Next.js + Edge) │     │ in own wallet
                    └────────┬──────────┘     │
                             │                ▼
                             │       ┌─────────────────┐
                             │       │   EVM Chain(s)  │
                             │       │  (via Alchemy)  │
                             ▼       └────────┬────────┘
                    ┌──────────────────┐      │
                    │     Supabase      │◄─────┘
                    │  Postgres · Auth  │
                    │  Edge Functions   │
                    │  Storage · Realtime│
                    └──────────────────┘
```

### 1.2 Core Principles

| Principle              | Implementation                                       |
| ---------------------- | ---------------------------------------------------- |
| Type-safe end-to-end   | TypeScript strict + Supabase generated types         |
| Server-first           | RSC for data fetching; client islands for interactivity |
| Security by default    | RLS on every table; middleware route guards          |
| Non-custodial          | Platform never holds keys or funds                   |
| Performance budget     | Core Web Vitals "Good" is a product requirement      |
| AI-friendly            | Consistent patterns OpenCode can replicate           |

---

## 2. Next.js App Router Folder Structure

### 2.1 Complete `src/` Structure

```text
src/
├── middleware.ts                       # Route guards (auth, RBAC, email-verified)
├── instrumentation.ts                  # Sentry instrumentation (optional)
│
├── app/                                # App Router
│   ├── layout.tsx                      # Root layout — html/body, providers, fonts
│   ├── globals.css                     # Tailwind v4 + design tokens (@theme)
│   ├── not-found.tsx                   # Global 404
│   ├── error.tsx                       # Global error boundary
│   ├── loading.tsx                     # Global loading
│   ├── sitemap.ts                      # SEO sitemap (public pages only)
│   ├── robots.ts                       # SEO robots.txt
│   │
│   ├── (public)/                       # Route group — URL unchanged
│   │   ├── layout.tsx                  # Public layout (header + footer)
│   │   ├── page.tsx                    # / (Home)
│   │   ├── how-it-works/page.tsx
│   │   ├── cards/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── about/page.tsx
│   │   ├── security/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── support/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── auth/
│   │   ├── layout.tsx                  # Auth layout (centered card)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   │
│   ├── app/                            # Customer application (auth-gated)
│   │   ├── layout.tsx                  # App shell (sidebar + topbar)
│   │   ├── page.tsx                    # /app (Overview)
│   │   ├── cards/
│   │   ├── order/
│   │   ├── orders/
│   │   ├── transactions/
│   │   ├── wallet/
│   │   ├── profile/
│   │   ├── security/
│   │   └── settings/
│   │
│   ├── admin/                          # Admin portal (RBAC-gated)
│   │   ├── layout.tsx                  # Admin shell (sidebar + topbar)
│   │   ├── page.tsx                    # /admin (Overview)
│   │   ├── users/
│   │   ├── orders/
│   │   ├── cards/
│   │   ├── payments/
│   │   ├── wallets/
│   │   ├── support/
│   │   ├── content/
│   │   └── settings/
│   │
│   └── api/                            # Route handlers (if needed beyond Edge Functions)
│       └── ...
│
├── lib/                                # Shared libraries
│   ├── supabase/
│   │   ├── server.ts                   # createClient() — Server Components + Server Actions
│   │   ├── admin.ts                    # createAdminClient() — service-role (server-only)
│   │   ├── client.ts                   # createBrowserClient() — Client Components
│   │   └── middleware.ts              # createMiddlewareClient() — middleware
│   ├── wagmi/
│   │   └── provider.tsx               # WagmiProvider + config
│   ├── payment/
│   │   └── verify.ts                  # Server-side verification helper
│   ├── email/
│   │   └── resend.ts                  # Resend email client
│   ├── validations/                   # Zod schemas
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   ├── payment.ts
│   │   ├── order.ts
│   │   └── support.ts
│   └── utils/
│       ├── cn.ts                      # clsx + tailwind-merge
│       ├── format.ts                  # currency, date, address formatting
│       └── constants.ts               # App-wide constants
│
├── config/                             # App configuration
│   ├── site.ts                         # Site metadata, nav config
│   ├── seo.ts                          # SEO defaults
│   └── networks.ts                     # Supported chains, tokens, contracts
│
├── types/                              # TypeScript types
│   ├── database.types.ts               # Generated by supabase gen:types
│   └── domain.ts                       # Domain types (not in DB)
│
├── hooks/                              # Client hooks
│   ├── useWallet.ts                    # wagmi wrapper
│   ├── useAuth.ts                      # Auth state
│   └── useToast.ts                     # Toast notifications
│
├── components/                         # Shared components
│   ├── ui/                             # Base components (shadcn/ui pattern)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── auth/                           # Auth-specific components
│   ├── wallet/                         # Wallet-specific components
│   ├── payment/                        # Payment-specific components
│   ├── dashboard/                      # Dashboard-specific components
│   └── admin/                          # Admin-specific components
│
└── styles/
    └── tokens.css                      # Design tokens (if separate from globals.css)
```

### 2.2 Supabase Edge Functions

```text
supabase/
├── functions/
│   ├── verify-payment/
│   │   └── index.ts                    # Payment verification (Book 11)
│   ├── transition-order/
│   │   └── index.ts                    # Order state transitions (admin)
│   └── send-email/
│       └── index.ts                    # Email sending (Resend)
├── migrations/
│   ├── 20260721000001_create_profiles.sql
│   ├── ...
│   └── 20260721000023_create_seed_data.sql
└── config.toml
```

---

## 3. Server Components vs. Client Components

### 3.1 Decision Matrix

| Use Case                          | Component Type | Why                                    |
| --------------------------------- | -------------- | -------------------------------------- |
| Public marketing pages            | Server (RSC)   | SEO, fast first paint, no JS needed    |
| Auth forms (login, register)      | Client         | Form state, validation, interactivity  |
| Dashboard data display            | Server (shell) | Fetch data server-side; pass to client islands |
| Wallet connection                 | Client         | wagmi hooks require client             |
| Payment page                      | Client         | wagmi sendTransaction, tx hash input   |
| Admin tables                      | Hybrid         | RSC shell + client islands for search/filter |
| Settings toggles                  | Client         | Interactive switches, optimistic update |
| Contact form                      | Hybrid         | RSC shell + client form island         |

### 3.2 Pattern: Hybrid Page (RSC shell + client island)

```tsx
// page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server';
import { WalletContent } from './wallet-content';

export default async function WalletPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .single();

  const { data: connections } = await supabase
    .from('wallet_connections')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Pass data to client component for wagmi interactivity
  return <WalletContent initialWallet={wallet} connections={connections} />;
}
```

```tsx
// wallet-content.tsx (Client Component)
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletContent({ initialWallet, connections }: Props) {
  const { address, isConnected } = useAccount();
  // Use initialWallet for SSR + isConnected for real-time state
  // ...
}
```

### 3.3 Rules

| Rule                              | Detail                                              |
| --------------------------------- | --------------------------------------------------- |
| Default to Server Components       | Only add `'use client'` when interactivity is needed. |
| Push client boundary down          | Keep client components as leaf nodes; server components wrap. |
| Data fetching in Server Components | Use `createClient()` (server); don't fetch in client. |
| Client components for:             | Forms, wagmi, state, event handlers, browser APIs. |
| Server components for:             | Data fetching, SEO, static content, layouts. |
| Never import server-only in client | `createAdminClient()` never in a client component. |

---

## 4. Server Actions

### 4.1 Pattern

```tsx
// actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function someAction(input: SomeInput) {
  // 1. Validate with Zod
  const parsed = someSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 2. Get authenticated user
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: ['Not authenticated'] } };

  // 3. Perform operation (with service-role if needed)
  const supabaseAdmin = createAdminClient();
  // ...

  // 4. Revalidate cache
  revalidatePath('/app/some-path');

  // 5. Return result
  return { success: true };
}
```

### 4.2 Server Action Rules

| Rule                              | Detail                                              |
| --------------------------------- | --------------------------------------------------- |
| Always `'use server'` at top      | Marks the file as server-only.                      |
| Validate with Zod                 | Never trust client input.                           |
| Get user server-side              | `supabase.auth.getUser()` — never trust client state. |
| Use service-role for admin ops    | `createAdminClient()` for operations needing elevated access. |
| Revalidate after mutations        | `revalidatePath()` or `revalidateTag()` to update cached data. |
| Return structured results         | `{ success }` or `{ error }` — consistent shape.    |
| Never expose secrets              | Service-role key stays server-side.                 |

---

## 5. Supabase Integration Patterns

### 5.1 Four Client Patterns

| Client              | File                          | Used In              | Key              |
| ------------------- | ----------------------------- | -------------------- | ---------------- |
| Server              | `lib/supabase/server.ts`      | RSC, Server Actions  | Anon (with RLS)  |
| Admin               | `lib/supabase/admin.ts`       | Server Actions, Edge Functions | Service-role |
| Browser             | `lib/supabase/client.ts`      | Client Components    | Anon (with RLS)  |
| Middleware          | `lib/supabase/middleware.ts`  | middleware.ts        | Anon (with RLS)  |

### 5.2 Server Client (RSC + Server Actions)

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set(name, value, options) { cookieStore.set({ name, value, ...options }); },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
}
```

### 5.3 Admin Client (Service-Role)

```ts
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

> **NEVER import this in a Client Component.** The service-role key bypasses RLS.

### 5.4 Browser Client (Client Components)

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 5.5 Middleware Client

```ts
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  return { supabase, response };
}
```

### 5.6 Query Patterns

```ts
// RSC: Fetch with embedded relations (avoid N+1)
const { data: orders } = await supabase
  .from('card_orders')
  .select(`
    *,
    card_products(name, type, price),
    payment_transactions(tx_hash, amount, currency, status),
    shipping_addresses(recipient_name, city, country)
  `)
  .eq('profile_id', user.id)
  .order('created_at', { ascending: false })
  .limit(20);

// Keyset pagination (for large lists)
const { data: next } = await supabase
  .from('card_orders')
  .select('*')
  .eq('profile_id', user.id)
  .lt('created_at', lastDate)
  .order('created_at', { ascending: false })
  .limit(20);
```

---

## 6. Authentication Middleware

### 6.1 Middleware File

```ts
// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Auth routes: redirect to /app if already logged in
  if (pathname.startsWith('/auth/') && user) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // App routes: require auth + verified email
  if (pathname.startsWith('/app')) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }
  }

  // Admin routes: require auth + verified email + admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }

    // Check admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('profile_id', user.id);

    const adminRoles = ['admin', 'super_admin', 'support', 'manager', 'finance', 'operations'];
    const isAdmin = roles?.some(r => adminRoles.includes(r.roles.name));

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/app/:path*', '/admin/:path*'],
};
```

### 6.2 Middleware Rules

| Rule                              | Detail                                              |
| --------------------------------- | --------------------------------------------------- |
| Runs on every matched route       | Fast (edge); no DB calls except role check for /admin. |
| Refreshes session                 | Supabase SSR auto-refreshes JWT if needed.          |
| Never trusts client               | Always calls `getUser()` server-side.               |
| Redirect with return URL          | `/auth/login?redirect=/app/orders` preserves destination. |
| Matcher excludes static + API     | Only matches `/auth/*`, `/app/*`, `/admin/*`.       |

---

## 7. Route Protection

### 7.1 Three-Layer Defense

| Layer              | What It Checks                           | Where                     |
| ------------------ | ---------------------------------------- | ------------------------- |
| Middleware         | Session exists, email verified, role     | `src/middleware.ts` (edge)|
| Server Component   | User matches data owner (via RLS)        | `page.tsx` (server)       |
| RLS                | Row-level access control                 | Postgres policies         |

### 7.2 Route Access Matrix

| Route              | Auth     | Email Verified | Role       | Source              |
| ------------------ | -------- | -------------- | ---------- | ------------------- |
| `/` (public)       | No       | —              | —          | Book 03 §13         |
| `/auth/*`          | No (redirect if authed) | —    | —          | Book 09 §19         |
| `/app/*`           | Yes      | Yes            | Customer   | Book 09 §19         |
| `/admin/*`         | Yes      | Yes            | Admin+     | Book 09 §19         |

---

## 8. Environment Variables

### 8.1 Variable Categories

| Category       | Variables                                                        |
| -------------- | ---------------------------------------------------------------- |
| Supabase       | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| WalletConnect  | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`                           |
| Alchemy        | `NEXT_PUBLIC_ALCHEMY_RPC_URL`, `NEXT_PUBLIC_ALCHEMY_API_KEY`, `ALCHEMY_SERVER_RPC_URL` |
| Email (Resend) | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`                           |
| Bot Protection | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`        |
| Error Tracking | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`                   |
| App            | `NEXT_PUBLIC_SITE_URL`                                           |

### 8.2 Rules

- `NEXT_PUBLIC_*` vars are exposed to the client; safe for public keys.
- Server-only vars (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, etc.) are never in client bundles.
- Vercel env vars: mark server-only as "Server-only" (not exposed to client).
- `.env.example` committed; `.env.local` gitignored.

### 8.3 See Book 10A for Complete Setup

Full setup steps for each variable are in Book 10A — Third-Party Integrations & API Registry.

---

## 9. API / Service Layer

### 9.1 Layer Architecture

```
Client Component
    ↓ calls
Server Action (src/app/.../actions.ts)
    ↓ uses
Lib helpers (src/lib/...)
    ↓ calls
Supabase Client (server or admin)
    ↓ queries
Postgres (with RLS)
```

### 9.2 When to Use Edge Functions vs. Server Actions

| Use Case                          | Use Edge Function                | Use Server Action       |
| --------------------------------- | -------------------------------- | ----------------------- |
| Payment verification              | ✓ (needs Deno + viem)            | —                       |
| Order state transitions           | ✓ (admin actions, audit)         | —                       |
| Form submissions (auth, profile)  | —                                | ✓                       |
| Data fetching (RSC)               | —                                | ✓ (direct query)        |
| Email sending                     | ✓ (async, triggered by DB)       | ✓ (direct, if needed)   |
| Cron jobs                         | ✓ (Supabase scheduler)           | —                       |

### 9.3 API Routes (Next.js Route Handlers)

Minimal use in MVP — prefer Server Actions for form-like operations and Edge Functions for sensitive logic. Route handlers reserved for:
- Webhooks (e.g., from external services)
- Health checks
- Non-REST operations not suited to Server Actions

---

## 10. State Management Strategy

### 10.1 State Categories

| State Type              | Tool                        | Examples                              |
| ----------------------- | --------------------------- | ------------------------------------- |
| Server state (RSC)      | Supabase queries (direct)   | User profile, orders, transactions    |
| Server state (client)   | React Query (via wagmi)     | Blockchain data, wallet state         |
| Form state              | react-hook-form + Zod       | Registration, login, order forms      |
| UI state (local)        | useState / useReducer       | Modal open, tab active, filter selected |
| Global UI state         | Zustand (if needed)         | Theme, sidebar collapsed               |
| Auth state              | Supabase Auth + middleware  | Session, user, role                   |
| Wallet state            | wagmi hooks                 | address, chainId, isConnected         |
| Realtime state          | Supabase Realtime           | Order status updates, notifications   |

### 10.2 Rules

| Rule                              | Detail                                              |
| --------------------------------- | --------------------------------------------------- |
| Server state is the source        | Fetch in RSC; pass to client as props.              |
| Don't duplicate server state      | If RSC provides data, don't re-fetch in client.     |
| Form state is ephemeral           | react-hook-form manages it; reset on success.       |
| UI state stays local              | `useState` unless shared across many components.    |
| Use Zustand sparingly             | Only for truly global state (theme, sidebar).       |
| Realtime for live updates         | Supabase Realtime for order status, notifications.  |

### 10.3 Realtime Pattern

```tsx
'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export function useOrderRealtime(orderId: string, onUpdate: (order: Order) => void) {
  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`order:${orderId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'card_orders', filter: `id=eq.${orderId}` },
        (payload) => onUpdate(payload.new as Order)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId, onUpdate]);
}
```

---

## 11. File Upload Architecture

### 11.1 Supabase Storage Buckets

| Bucket          | Purpose              | Access     | RLS                        |
| --------------- | -------------------- | ---------- | -------------------------- |
| `avatars`       | User profile avatars | Public read | Users can upload own       |
| `card-images`   | Card product images  | Public read | Admin-only upload          |
| `kyc-documents` | KYC docs (future)    | Private    | User upload, admin read    |
| `attachments`   | Support ticket files | Private    | User upload own, admin read|

### 11.2 Upload Pattern

```ts
// Client-side upload (with signed URL from server)
const { data } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, { upsert: true });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`);
```

### 11.3 Rules

- Max file size: 5MB (avatars), 10MB (attachments).
- Allowed types: image/png, image/jpeg, image/webp (avatars); pdf, png, jpg (attachments).
- File names: `{userId}/{timestamp}-{random}.ext` to avoid collisions.
- RLS on storage: users can only upload to their own folder.

---

## 12. Error Logging

### 12.1 Error Tracking with Sentry

```ts
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.seedPhrase;
    }
    return event;
  },
});
```

### 12.2 Error Categories

| Category              | Where Logged              | User Message                      |
| --------------------- | ------------------------- | --------------------------------- |
| Client errors         | Sentry (client)           | Friendly message + retry          |
| Server Action errors  | Sentry (server) + Supabase logs | Structured error return      |
| Edge Function errors  | Sentry + Supabase logs    | Error code in response            |
| Auth errors           | Supabase Auth logs        | Generic "Invalid credentials"     |
| Payment errors        | activity_logs + Sentry    | Specific error code (Book 11 §18) |
| Admin audit errors    | audit_logs                | "Action failed" + log             |

### 12.3 Rules

- **Never expose stack traces to users.**
- Log full error detail server-side (Sentry + Supabase logs).
- User sees: friendly message + retry + support link.
- Payment errors include error code for support reference.
- Scrub passwords, seed phrases, private keys from Sentry events.

---

## 13. Caching and Revalidation

### 13.1 Caching Strategy

| Data Type              | Cache Strategy                    | Revalidation               |
| ---------------------- | --------------------------------- | -------------------------- |
| Public pages (RSC)     | Static + ISR (`revalidate: 3600`) | Hourly                     |
| User data (orders, tx) | No cache (always fresh)           | `revalidatePath()` on mutation |
| Card products          | Static (`revalidate: 86400`)      | Daily                      |
| Supported networks     | Static (`revalidate: 86400`)      | Daily                      |
| Admin data             | No cache                          | `revalidatePath()` on mutation |
| User profile           | No cache                          | `revalidatePath('/app/profile')` on update |

### 13.2 Revalidation Patterns

```ts
// After a Server Action mutation:
revalidatePath('/app/orders');          // Revalidate orders list
revalidatePath(`/app/orders/${orderId}`); // Revalidate specific order
revalidateTag('user-orders');           // Or use tag-based revalidation
```

### 13.3 Rules

- User-specific data: never cached (always fresh from RLS-protected query).
- Public reference data (card products, networks): cached with ISR.
- After every mutation: call `revalidatePath()` for affected routes.
- Use `revalidateTag()` for tag-based invalidation if needed.

---

## 14. Deployment Architecture

### 14.1 Environments

| Environment | Frontend              | Backend                   | Purpose              |
| ----------- | --------------------- | ------------------------- | -------------------- |
| Development | `npm run dev` (local) | `supabase start` (local)  | Local development    |
| Staging     | Vercel Preview        | Supabase Branch           | Pre-prod testing     |
| Production  | Vercel (twalletservices.com) | Supabase (project)  | Live                 |

### 14.2 CI/CD Pipeline

```
GitHub PR → Vercel Preview Deploy → Lint + Typecheck + Tests →
  → Supabase Branch DB (if schema change) →
  → PR Review → Merge to main →
  → Vercel Production Deploy →
  → Supabase Migration Apply (if schema change) →
  → Security Advisors Check →
  → Generate TypeScript Types
```

### 14.3 Build Commands

| Command              | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Local dev server                     |
| `npm run build`      | Production build                     |
| `npm run start`      | Start production server (local test) |
| `npm run lint`       | ESLint                               |
| `npm run typecheck`  | TypeScript type checking             |
| `npm run test`       | Vitest unit tests                    |
| `npm run test:e2e`   | Playwright E2E tests                 |
| `npm run gen:types`  | Generate Supabase TypeScript types   |

### 14.4 See Book 23 for Full Deployment Guide

---

## 15. Performance Architecture

### 15.1 Performance Budgets

| Route Type           | LCP    | TTFB   | JS Bundle |
| ---------------------| ------ | ------ | --------- |
| Public (RSC)         | < 2.0s | < 200ms| < 80KB    |
| Auth (Client)        | < 1.5s | < 200ms| < 60KB    |
| App (Hybrid)         | < 2.0s | < 300ms| < 150KB   |
| Admin (Hybrid)       | < 2.0s | < 300ms| < 200KB   |

### 15.2 Optimization Techniques

| Technique                  | Where                                |
| -------------------------- | ------------------------------------ |
| RSC for public pages       | Server-rendered; minimal JS          |
| Route-level code splitting | App Router default                   |
| `next/font` (self-hosted)  | No external font request; no CLS     |
| `next/image`               | Auto format (WebP/AVIF) + lazy load  |
| Tailwind v4 (CSS-first)    | Only used styles in production CSS   |
| Keyset pagination          | Avoid offset on large tables         |
| Supabase embedded select   | Avoid N+1 queries                    |
| ISR for public content     | `revalidate: 3600` on static pages   |
| Vercel Edge for middleware | Fast route guards at edge            |

---

## 16. Security Architecture

### 16.1 Security Layers

```
1. Vercel (HTTPS, HSTS, DDoS)
   ↓
2. Middleware (auth, RBAC, rate limit)
   ↓
3. Server Component / Server Action (auth re-check)
   ↓
4. Supabase RLS (row-level access control)
   ↓
5. Postgres (constraints, triggers)
```

### 16.2 Key Security Rules

| Rule                              | Enforcement                     |
| --------------------------------- | ------------------------------- |
| RLS on every table                | Migration + advisors check      |
| Service-role key server-only      | Build check + env separation    |
| No seed phrase / private key      | UX policy + lint guard          |
| Zod validation on all inputs      | Client + server                 |
| Rate limiting on auth + payments  | Middleware + Supabase Auth      |
| Audit trail for admin actions     | audit_logs (append-only)        |
| Payment verification on-chain     | Edge Function (viem)            |
| No CSRF (SameSite cookies)        | @supabase/ssr default           |

---

## 17. Type Safety Architecture

### 17.1 End-to-End Types

```
Database schema (Book 08)
  ↓ supabase gen:types
TypeScript types (src/types/database.types.ts)
  ↓ imported by
Supabase client (typed queries)
  ↓ inferred by
Server Components + Server Actions
  ↓ props to
Client Components
```

### 17.2 Type Rules

| Rule                              | Detail                                              |
| --------------------------------- | --------------------------------------------------- |
| `strict: true` in tsconfig        | No implicit any; strict null checks.                |
| No `any` type                     | Use `unknown` + narrow, or proper types.            |
| Supabase generated types          | Run `npm run gen:types` after schema changes.       |
| Zod schemas infer types           | `type Input = z.infer<typeof schema>`               |
| Domain types in `src/types/`      | For types not in the database (e.g., wallet state). |

### 17.3 Typecheck Command

```bash
npm run typecheck   # tsc --noEmit
```

Must pass before any commit. See `AGENTS.md`.

---

## 18. References

- Book 03 — Information Architecture (route structure, layouts)
- Book 05 — Software Requirements Specification (system interfaces, security)
- Book 08 — Database Schema (tables, constraints)
- Book 09 — Authentication System (middleware, Supabase clients)
- Book 10 — Wallet Integration (wagmi provider setup)
- Book 10A — Third-Party Integrations (env vars, setup)
- Book 11 — Crypto Payments (Edge Function pattern)
- `00-Project/TECH_STACK.md`
- `AGENTS.md` (build/lint/typecheck commands)

---

## Next Book

**Book 13 — Landing Page** (`02-UI-UX/BOOK_13_LANDING_PAGE/`): the homepage `/` route, documented as a modular folder with 11 focused files — Overview, Hero, Statistics, Card Showcase, How It Works, Features, Security, Testimonials, FAQ, Newsletter, and a complete OpenCode Prompt. Each section is independently implementable by OpenCode.

---

> End of Book 12 — System Architecture. This document is the engineering foundation for the codebase. Any change to folder structure, component patterns, state management, or deployment architecture requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
