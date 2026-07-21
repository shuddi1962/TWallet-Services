# Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework (App Router) |
| React 19 | UI library |
| TypeScript (strict) | Language |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI primitives (via Radix) |
| Framer Motion | Animations |
| Lucide Icons | Icon library |

## Backend

| Technology | Purpose |
|------------|---------|
| Supabase | Backend platform |
| Supabase Auth | Authentication |
| Supabase PostgreSQL | Database |
| Supabase Storage | File storage |
| Supabase Realtime | Real-time subscriptions |
| Supabase Edge Functions | Serverless functions (Deno) |
| Vercel | Hosting |

## Wallet

| Technology | Purpose |
|------------|---------|
| WalletConnect AppKit | Wallet connection |
| wagmi | Wallet React hooks |
| viem | Ethereum interactions |
| Alchemy | RPC provider |

## Validation & Forms

| Technology | Purpose |
|------------|---------|
| Zod | Schema validation |
| React Hook Form | Form state management |

## State & Data

| Technology | Purpose |
|------------|---------|
| TanStack Query | Server state (optional, used sparingly) |
| React `cache()` | Request deduplication |
| Next.js Server Actions | Mutations |

## Testing & CI

| Technology | Purpose |
|------------|---------|
| Vitest | Unit + integration tests |
| Playwright | E2E tests |
| GitHub Actions | CI/CD |
| Sentry | Error tracking |

## DO NOT CHANGE THE STACK

| ❌ Never introduce | ✅ Stick with |
|-------------------|---------------|
| Another database | Supabase PostgreSQL |
| Another backend framework | Next.js + Supabase |
| Another CSS framework | Tailwind CSS |
| Redux | Server Components + TanStack Query |
| Firebase | Supabase |
| Express | Next.js Route Handlers + Edge Functions |
| MongoDB | Supabase PostgreSQL |
| Prisma | Supabase JS client |
