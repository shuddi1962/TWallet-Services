# TWallet Services — Technology Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Language         | TypeScript (strict)                                     |
| Frontend         | Next.js 15 (App Router, RSC, Server Components)         |
| UI               | React 19, Tailwind CSS, Radix UI primitives             |
| Animations       | Framer Motion                                           |
| Backend          | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) |
| Database         | PostgreSQL 15 (via Supabase)                            |
| Auth             | Supabase Auth (email/password, OAuth), Row Level Security |
| Wallet           | WalletConnect v2, viem / wagmi, MetaMask, Coinbase Wallet, Trust Wallet |
| Blockchain       | EVM chains (verification via public RPC + block explorers) |
| Payments         | Crypto-only (MVP); on-chain transaction verification    |
| Hosting          | Vercel (frontend + edge), Supabase (backend)            |
| Email            | Supabase Auth email + transactional provider (Resend/SES) |
| Monitoring       | Vercel Analytics, Supabase logs, Sentry (error tracking) |
| Testing          | Vitest (unit), Playwright (e2e), Supabase local stack    |
| CI/CD            | GitHub + Vercel previews + Supabase branch databases    |
| Design           | Figma (design system), component-first implementation   |

## Runtime Versions (Target)

- Node.js 20 LTS
- Next.js 15
- React 19
- TypeScript 5.x
- Supabase CLI (latest)
- Tailwind CSS 4

## Notes

- All wallet interactions are read/connection-only from the platform side; signing happens in the user's wallet.
- The platform never holds custody of user funds; it verifies transactions on-chain.
- RLS is enforced on every table; no client may read/write unauthorized rows.
