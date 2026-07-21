# AI Context — TWallet Services

## High-Level Overview

TWallet Services is a non-custodial, crypto-funded card platform. Users connect their existing self-custody wallet (MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet), order a virtual or physical card, and pay in crypto. The platform verifies every transaction on-chain before marking an order paid.

**The platform never collects users' recovery phrases or private keys.**

## Business Goals

- Provide a seamless crypto-to-fiat card experience
- Maintain non-custodial trust model (users control their keys)
- Achieve 99.9% platform availability
- Support 7+ blockchain networks at launch
- Scale to 100,000+ users within 12 months

## User Personas

| Persona | Description | Primary Actions |
|---------|-------------|-----------------|
| Crypto User | Self-custody wallet user | Connect wallet, order card, pay with crypto |
| Admin | Platform operator | Manage orders, users, payments, settings |
| Super Admin | System administrator | Full system access, audit, configuration |
| Visitor | Unregistered user | Browse landing pages, pricing, FAQ |

## System Architecture

```text
┌─────────────────────┐     ┌─────────────────────┐
│   Vercel (Next.js)  │     │    Supabase          │
│                     │     │                      │
│  ┌───────────────┐  │     │  ┌────────────────┐  │
│  │ Public Pages  │  │     │  │  PostgreSQL     │  │
│  │ (Marketing)   │  │     │  │  + RLS          │  │
│  ├───────────────┤  │     │  ├────────────────┤  │
│  │ Auth Pages    │  │     │  │  Auth           │  │
│  │ (Login/Signup)│──┼─────┼─▶│  (Supabase)     │  │
│  ├───────────────┤  │     │  ├────────────────┤  │
│  │ App Dashboard │  │     │  │  Storage        │  │
│  │ (Customer)    │  │     │  ├────────────────┤  │
│  ├───────────────┤  │     │  │  Realtime       │  │
│  │ Admin Portal  │  │     │  ├────────────────┤  │
│  └───────────────┘  │     │  │  Edge Functions │  │
│                     │     │  └────────────────┘  │
│  WalletConnect SDK  │     └─────────────────────┘
│  + wagmi + viem     │
└─────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router, RSC) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide |
| Language | TypeScript (strict) |
| Backend | Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) |
| Wallet | WalletConnect AppKit + wagmi + viem |
| RPC | Alchemy |
| Validation | Zod |
| Testing | Vitest + Playwright |
| Deployment | Vercel + Supabase CLI |
| Monitoring | Sentry + Vercel Analytics |
| Notifications | Resend (email) |

## Key Constraints

- Never collect/accept recovery phrases or private keys
- RLS on every database table
- On-chain verification before marking orders paid
- Funds flow directly to configured receiving wallet address
- TypeScript strict mode required
- Server Components by default
- Server Actions for all mutations

## Documentation Structure

Books are in numbered folders (00-Project through 30-Launch). Each Book contains implementation-ready specifications. Read the relevant Book before implementing any feature.

- **AGENTS.md** — Build commands and project conventions
- **.ai/** — AI context files (this folder)
- **src/** — Application source code (once implementation begins)

## Project Status

Books 01–28 complete (documentation phase). Books 29–30 complete (AI master instructions + launch checklist). Ready for Phase 2 — Implementation.
