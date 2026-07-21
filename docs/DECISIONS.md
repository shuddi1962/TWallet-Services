# Architectural Decision Log

This document captures every major architectural decision made during planning. Each decision includes the context, options considered, chosen approach, and rationale.

## Framework

### Why Next.js 15 App Router?

| Option | Considered | Verdict |
|--------|------------|---------|
| Next.js 15 (App Router) | ✅ Chosen | Best RSC support, Server Actions, streaming |
| Remix | ❌ Rejected | Smaller ecosystem, fewer integrations |
| SvelteKit | ❌ Rejected | Smaller talent pool, less enterprise adoption |
| Astro | ❌ Rejected | Islands pattern insufficient for app dashboard |

**Rationale:** RSC-first architecture reduces bundle size. Server Actions simplify mutations. Vercel hosting is the canonical deployment target. Supabase SSR library has first-class Next.js support.

---

### Why TypeScript strict?

**Rationale:** Eliminates entire classes of bugs at compile time. Enforced across the entire codebase including Edge Functions (Deno). No `any` escape hatches.

---

## Backend

### Why Supabase?

| Option | Considered | Verdict |
|--------|------------|---------|
| Supabase | ✅ Chosen | Postgres + Auth + Edge Functions + Realtime + Storage |
| Firebase | ❌ Rejected | NoSQL limits relational queries, vendor lock-in |
| Custom backend | ❌ Rejected | Too much operational overhead |
| Convex | ❌ Rejected | Too new, smaller ecosystem |

**Rationale:** PostgreSQL gives us relational integrity, RLS, JSONB, and CTEs. Supabase Auth integrates seamlessly with the database. Edge Functions (Deno) handle sensitive payment verification without exposing secrets. Realtime enables live dashboard updates.

---

### Why RLS on every table?

**Rationale:** Defense in depth. Even if a Server Action is somehow bypassed, the database enforces access control. No exceptions.

---

## Hosting

### Why Vercel?

| Option | Considered | Verdict |
|--------|------------|---------|
| Vercel | ✅ Chosen | First-class Next.js support, Edge Network, ISR |
| AWS (Lambda + CloudFront) | ❌ Rejected | Operational overhead, longer iteration cycles |
| Cloudflare Pages | ❌ Rejected | No Node.js runtime, limited Server Action support |

---

## Wallet

### Why WalletConnect v2 + wagmi?

| Option | Considered | Verdict |
|--------|------------|---------|
| WalletConnect v2 + wagmi | ✅ Chosen | Industry standard, 5+ wallets, active development |
| Privy | ❌ Rejected | Custodial embedded wallet conflicts with non-custodial requirement |
| Dynamic | ❌ Rejected | Over-engineered for our use case |
| Direct RPC only | ❌ Rejected | No wallet connection UI |

**Rationale:** Users connect their existing self-custody wallet. We never collect private keys or seed phrases. wagmi provides typed hooks for chain reads. viem handles RPC calls in Edge Functions.

---

### Why Alchemy for RPC?

| Option | Considered | Verdict |
|--------|------------|---------|
| Alchemy | ✅ Chosen | 7 chains, reliable, webhooks, good free tier |
| Infura | ❌ Rejected | Fewer chains, more expensive at scale |
| QuickNode | ❌ Rejected | Less documentation, smaller ecosystem |
| Public RPCs | ❌ Rejected | Rate limited, unreliable |

---

## Styling

### Why Tailwind CSS v4 + shadcn/ui?

| Option | Considered | Verdict |
|--------|------------|---------|
| Tailwind v4 + shadcn/ui | ✅ Chosen | Component-first, Radix accessible primitives |
| Material UI | ❌ Rejected | Heavy bundle, hard to customize, non-Web3 aesthetic |
| Chakra UI | ❌ Rejected | Slower development, smaller ecosystem |
| Pure CSS | ❌ Rejected | Too slow, inconsistent |

---

## Database

### Why PostgreSQL over NoSQL?

**Rationale:** Relational data model (users, wallets, orders, payments, cards) with foreign keys, transactions, and complex queries. RLS for row-level security. JSONB for flexible metadata fields. CTEs for analytics queries.

---

### Why UUID v4 over auto-increment?

**Rationale:** Security (no ID enumeration), distributed-friendly (no sequence coordination), consistent format across all tables.

---

## State Management

### Why no Redux/Zustand?

**Rationale:** Server Components + Server Actions reduce client state needs. URL state (search params) handles filters/pagination. Realtime subscriptions handle live updates. Zustand available for complex client-only interactions but avoided where possible.

---

## Testing

### Why Vitest over Jest?

**Rationale:** Faster (esbuild-native), ESM-compatible, same API as Jest, native TypeScript support.

---

### Why Playwright over Cypress?

**Rationale:** Faster, more reliable, better debugging (trace viewer), same tool for E2E and component testing.

---

## See Also

- `docs/adr/ADR-001-use-supabase.md`
- `docs/adr/ADR-002-walletconnect-appkit.md`
- `docs/adr/ADR-003-nextjs-15.md`
- `docs/adr/ADR-004-vercel-hosting.md`
- `docs/adr/ADR-005-crypto-payment-flow.md`
- `docs/adr/ADR-006-rbac-model.md`
