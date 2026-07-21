# TWallet Services — Project Overview

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Domain       | twalletservices.com                |
| Version      | 1.0.0                              |
| Status       | Planning                           |
| Architecture | Enterprise                         |
| Frontend     | Next.js 15                         |
| Backend      | Supabase (PostgreSQL + Auth + Edge Functions) |
| Hosting      | Vercel                             |
| Database     | PostgreSQL                         |
| Language     | TypeScript                         |
| Owner        | TWallet Services Team              |

## 1. Summary

TWallet Services is a fintech/Web3 platform whose primary product is the **TWallet Card** — a crypto-funded payment card (physical and virtual) that lets users spend from their self-custody wallets without surrendering their private keys or recovery phrases to the platform.

The platform connects a user's existing Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet) to a card ordering and payment flow. Payments are crypto-only for the MVP, settled against a configured receiving wallet address, and verified on-chain before an order is marked paid.

## 2. Primary Product

**TWallet Card**

- Physical card and virtual card variants.
- Ordered through a customer dashboard.
- Funded via verified on-chain crypto payments.
- No custody of user seed phrases or private keys, ever.

## 3. Core Principles

1. Security First
2. Mobile First
3. Component First
4. API First
5. Performance First
6. Accessibility First
7. SEO Ready
8. Enterprise Architecture
9. AI-Friendly Documentation

## 4. Hard Rules (Non-Negotiable)

- Never collect users' recovery phrases or private keys.
- All wallet connections use standard wallet connection protocols only.
- Customer funds go directly to the configured receiving wallet address.
- Blockchain transactions are verified before any order is marked paid.

## 5. Documentation Map

Detailed specifications live in the numbered Books under their respective folders. See the root `README.md` for the full index and status of all 20 books.

## 6. References

- `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` — vision, goals, personas, scope, architecture
- `00-Project/TECH_STACK.md` — technology stack summary
- `00-Project/ROADMAP.md` — delivery roadmap
- `00-Project/REQUIREMENTS.md` — requirements index
- `00-Project/CHANGELOG.md` — change log
