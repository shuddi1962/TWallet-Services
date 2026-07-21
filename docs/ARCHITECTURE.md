# TWallet Services — Architecture Overview

## System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Next.js App    │  │ WalletConnect│  │ wagmi/viem        │  │
│  │ (RSC + Client) │  │ AppKit Modal │  │ (chain reads)     │  │
│  └────────────────┘  └──────────────┘  └────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼───────────────────────────────────────┐
│                    VERCEL (Next.js 15)                            │
│                                                                  │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────────┐   │
│  │ RSC Pages   │  │ Client Islands │  │ Server Actions      │   │
│  │ / (public)  │  │ /app/* (dash)  │  │ (Auth, Wallet,      │   │
│  │ /auth/*     │  │ /admin/*       │  │  Payment, Profile)  │   │
│  └─────────────┘  └────────────────┘  └──────────┬──────────┘   │
│                                                   │             │
│  ┌────────────────────────────────────────────────┴────────┐    │
│  │              API Route Handlers (/api/*)                 │    │
│  │  health | ready | version | webhooks | uploads | admin   │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────────┐
        │                  │                  │                  │
┌───────▼────────┐ ┌──────▼───────┐ ┌────────▼───────┐ ┌───────▼────────┐
│   SUPABASE     │ │   ALCHEMY   │ │ WALLETCONNECT  │ │     RESEND     │
│                │ │   RPC       │ │   CLOUD        │ │                │
│  PostgreSQL 15 │ │  7 EVM      │ │  Project ID    │ │ Transactional  │
│  Auth (GoTrue) │ │  chains     │ │  5 wallets     │ │ Email (12 tmpl)│
│  Edge Fns(Deno)│ │              │ │  v2 protocol   │ │                │
│  Storage (S3)  │ │              │ │                │ │                │
│  Realtime (WS) │ │              │ │                │ │                │
└────────────────┘ └──────────────┘ └────────────────┘ └────────────────┘
```

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 App Router | RSC, Server Actions, streaming, ISR |
| Backend | Supabase | Postgres, Auth, Edge Functions, Realtime, Storage |
| Hosting | Vercel | First-class Next.js support, Edge Network, ISR |
| Wallet | WalletConnect v2 + wagmi | Industry standard, 5+ wallets supported |
| RPC | Alchemy | 7 chains, reliable, webhook support |
| Styling | Tailwind v4 + shadcn/ui | Component-first, Radix primitives, accessible |
| DB | PostgreSQL 15 | RLS, JSONB, CTEs, 65-index optimization |

## Authentication Flow

```text
Browser → /auth/login → Server Action → Supabase Auth
  → Email OTP sent via Resend
  → User clicks link → Session created
  → Middleware reads session cookie
  → Route guard redirects unauthorized users
```

## Wallet Flow

```text
Browser → Connect button → WalletConnect AppKit modal
  → User selects wallet → Approves connection
  → wagmi reads address + chain
  → Server Action stores wallet record (address only)
  → NEVER requests/collects private keys or seed phrases
```

## Payment Verification Flow

```text
User submits payment → Server Action creates pending order
  → User sends crypto to receiving address
  → Edge Function polls chain via Alchemy RPC (10 confirmations)
  → Verifies: correct address, amount, chain, not already used
  → Updates order status (paid/confirmed)
  → Only then marks order as paid
```

## Deployment Flow

```text
git push → GitHub Actions CI
  → lint → typecheck → test → build
  → Vercel deploy (preview for PRs, production for main)
  → Supabase migrations applied
  → Edge Functions deployed
  → Smoke tests → Monitoring active
```

## Security Layers

1. **Middleware** — Route protection, session validation
2. **Server Actions** — Server-only business logic, never exposed
3. **RLS** — Row-level security on all 19 tables
4. **Input validation** — Zod schemas on all inputs
5. **Rate limiting** — 14 endpoint groups with tiered limits
6. **Security headers** — CSP, HSTS, X-Frame-Options, etc.
7. **Audit logging** — All sensitive operations logged

## See Also

- `BOOK-12/BOOK_12_SYSTEM_ARCHITECTURE.md` — Full system architecture
- `BOOK-21/BOOK-21-SECURITY/` — Security & compliance
- `BOOK-23/BOOK-23-DEVOPS/` — DevOps & deployment
- `docs/DECISIONS.md` — Architectural decision log
