# Book 10A — Third-Party Integrations & API Registry

> **TWallet Services · TWallet Card**
> The single reference for every external service, SDK, and API used in the TWallet Services platform. Each integration documents its purpose, required environment variables, pricing tier, rate limits, setup steps, security considerations, and where it's used in the application. This is the document to consult when configuring the project, onboarding a new developer, or deploying to production.

---

## Document Control

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Book         | 10A — Third-Party Integrations & API Registry |
| Project      | TWallet Services                           |
| Product      | TWallet Card                               |
| Version      | 1.0.0                                      |
| Status       | Approved                                   |
| Type         | Reference Document (companion to Books 10–26) |
| Owner        | TWallet Services Team                      |
| Created      | 2026-07-21                                 |
| Last Updated | 2026-07-21                                 |

### Revision History

| Version | Date       | Author                | Notes                                              |
| ------- | ---------- | --------------------- | -------------------------------------------------- |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft                                      |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: 10 integrations documented with full setup guides |

---

## Table of Contents

1. [Integrations Overview](#1-integrations-overview)
2. [Supabase](#2-supabase)
3. [Vercel](#3-vercel)
4. [WalletConnect](#4-walletconnect)
5. [wagmi](#5-wagmi)
6. [viem](#6-viem)
7. [Alchemy](#7-alchemy)
8. [Resend](#8-resend)
9. [Cloudflare Turnstile](#9-cloudflare-turnstile)
10. [Sentry](#10-sentry)
11. [GitHub](#11-github)
12. [Environment Variables Master List](#12-environment-variables-master-list)
13. [Setup Order](#13-setup-order)
14. [Cost Estimate (MVP)](#14-cost-estimate-mvp)
15. [References](#15-references)

---

## 1. Integrations Overview

| #  | Service               | Category       | MVP? | Cost (MVP) | Env Vars |
| -- | --------------------- | -------------- | ---- | ---------- | -------- |
| 1  | Supabase              | Backend        | ✓    | Free tier  | 5        |
| 2  | Vercel                | Hosting        | ✓    | Free/Hobby | 0        |
| 3  | WalletConnect         | Wallet protocol| ✓    | Free       | 1        |
| 4  | wagmi                 | React hooks    | ✓    | Free (OSS) | 0        |
| 5  | viem                  | EVM library    | ✓    | Free (OSS) | 0        |
| 6  | Alchemy               | Blockchain RPC | ✓    | Free tier  | 1        |
| 7  | Resend                | Email          | ✓    | Free tier  | 2        |
| 8  | Cloudflare Turnstile  | Bot protection | ✓    | Free       | 2        |
| 9  | Sentry                | Error tracking | ✓    | Free tier  | 2        |
| 10 | GitHub                | Version control| ✓    | Free       | 0        |

---

## 2. Supabase

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Backend (Database, Auth, Edge Functions, Storage, Realtime) |
| Website      | https://supabase.com                       |
| Docs         | https://supabase.com/docs                  |
| Pricing      | Free tier: 500MB DB, 50K MAU, 1GB storage  |
| MVP Cost     | $0 (Free tier sufficient for MVP)          |
| Production   | Pro plan: $25/mo (8GB DB, 100K MAU, 100GB storage) |

### 2.1 Purpose

Supabase is the entire backend for TWallet Services:
- **PostgreSQL** — 19 tables with RLS (Book 08)
- **Auth** — email/password registration, login, verification (Book 09)
- **Edge Functions** — payment verification, order state transitions (Deno runtime)
- **Storage** — user avatars, card images
- **Realtime** — order status updates, notifications

### 2.2 Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  (publishable anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ...      (server-only, NEVER in client)
```

### 2.3 Setup Steps

1. Go to https://supabase.com and create an account.
2. Create a new project — note the project URL and region.
3. Get the project URL from Settings → API.
4. Get the anon (publishable) key from Settings → API → Project API keys.
5. Get the service role key from Settings → API → Project API keys (keep secret).
6. Set the `pgcrypto` extension (needed for `gen_random_uuid()`):
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```
7. Apply migrations from Book 08 (Database Schema).
8. Run `supabase_get_advisors` (security) after migrations.
9. Generate TypeScript types: `npx supabase gen:types --lang typescript`.
10. Configure Auth: Settings → Authentication → Email.
    - Enable email confirmations.
    - Set email templates for verification, reset, magic link.
    - Configure redirect URLs: `https://twalletservices.com/auth/verify-email`.
11. Configure Storage buckets: `avatars` (public), `card-images` (public).

### 2.4 Rate Limits

| Resource         | Free Tier       | Pro Plan          |
| ---------------- | --------------- | ----------------- |
| API requests     | 500/hour, 2/sec | 10K/hour, 100/sec |
| Database         | 60 conns, 200 pool | 200 conns, 200 pool |
| Auth             | 3 signups/hour/email | 3 signups/hour/email |
| Edge Functions   | 50K invocations/mo | 2M invocations/mo |
| Realtime         | 200 conns       | 500 conns         |

### 2.5 Security Considerations

- **Service role key**: NEVER in client bundles. Server-only (Edge Functions, Server Components, Server Actions).
- **Anon key**: Safe for client; RLS is the authority.
- **RLS**: Enabled on every table. No exceptions.
- **Auth cookies**: HTTP-only, SameSite=Lax (via `@supabase/ssr`).
- **Database backups**: Daily on free tier; PITR available on Pro.

### 2.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 09   | Authentication        | Supabase Auth, profiles, user_roles |
| 10   | Wallet Integration    | wallets, wallet_connections tables  |
| 11   | Crypto Payments       | Edge Functions for verification     |
| 12   | Card Ordering         | card_orders, order state machine    |
| 13   | Customer Dashboard    | All customer data queries           |
| 14   | Admin Dashboard       | All admin data queries              |
| 15   | Support Center        | support_tickets, ticket_messages    |
| 18   | API Specifications    | Edge Function endpoints             |

---

## 3. Vercel

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Hosting (Frontend + Edge)                  |
| Website      | https://vercel.com                         |
| Docs         | https://vercel.com/docs                    |
| Pricing      | Free (Hobby): 100GB bandwidth, 100K requests |
| MVP Cost     | $0 (Free tier)                             |
| Production   | Pro plan: $20/mo (1TB bandwidth, 1M requests) |

### 3.1 Purpose

Vercel hosts the Next.js 15 application:
- **Frontend** — App Router pages, RSC, client components.
- **Edge Runtime** — middleware (route protection), edge functions.
- **Preview deployments** — every PR gets a preview URL.
- **Analytics** — Core Web Vitals, traffic.

### 3.2 Required Environment Variables

No Vercel-specific env vars required. Vercel auto-provides:
- `NEXT_PUBLIC_VERCEL_URL` — preview URL
- `VERCEL_ENV` — production/preview/development

All app env vars (Supabase, WalletConnect, etc.) are configured in the Vercel dashboard.

### 3.3 Setup Steps

1. Go to https://vercel.com and create an account (or sign in with GitHub).
2. Import the GitHub repository.
3. Framework preset: Next.js (auto-detected).
4. Configure environment variables (see §12 Master List).
   - Set `NEXT_PUBLIC_*` vars for both Preview and Production.
   - Set server-only vars (`SUPABASE_SERVICE_ROLE_KEY`) for Production only.
5. Deploy.
6. Configure custom domain: `twalletservices.com`.
   - Add domain in Vercel dashboard.
   - Update DNS records at domain registrar (CNAME to `cname.vercel-dns.com`).
   - Wait for SSL certificate provisioning.
7. Enable Vercel Analytics (Settings → Analytics).

### 3.4 Rate Limits

| Resource         | Free Tier       | Pro Plan          |
| ---------------- | --------------- | ----------------- |
| Bandwidth        | 100GB/mo        | 1TB/mo            |
| Edge requests    | 100K/mo         | 1M/mo             |
| Build minutes    | 6,000/mo        | 24,000/mo         |
| Max duration     | 10s (serverless)| 60s (serverless)  |

### 3.5 Security Considerations

- **Environment variables**: Mark server-only secrets as "Server-only" (not exposed to client).
- **Deploy protection**: Enable Vercel Authentication for preview deployments.
- **DDoS protection**: Vercel includes basic DDoS protection.
- **HSTS**: Enable via `next.config.ts` headers.

### 3.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| All  | All frontend          | Hosting the Next.js application     |
| 09   | Authentication        | Middleware (edge) for route guards  |
| 23   | Deployment            | CI/CD, preview deploys, production  |

---

## 4. WalletConnect

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Wallet connection protocol                 |
| Website      | https://walletconnect.com                  |
| Docs         | https://docs.walletconnect.com             |
| Pricing      | Free (AppKit / Web3Modal)                  |
| MVP Cost     | $0                                         |

### 4.1 Purpose

WalletConnect v2 is the universal wallet connection protocol:
- Connects mobile wallets (Trust, Rainbow, TokenPocket) to the web app.
- Provides QR code modal for cross-device connection.
- Handles session management and wallet-side approval.

### 4.2 Required Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...  # From WalletConnect Cloud
```

### 4.3 Setup Steps

1. Go to https://cloud.walletconnect.com and create an account.
2. Create a new project.
3. Name it "TWallet Services".
4. Add the project's domain: `twalletservices.com`.
5. Copy the Project ID.
6. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in env vars.
7. Install the wagmi WalletConnect connector:
   ```bash
   npm install wagmi viem @tanstack/react-query
   ```
8. Configure in `src/lib/wagmi/provider.tsx` (see Book 10 §22.1).

### 4.4 Rate Limits

| Resource           | Limit                |
| ------------------ | -------------------- |
| Session requests   | 100/sec per project  |
| Active sessions    | Unlimited (free)     |
| Relay messages     | Fair use             |

### 4.5 Security Considerations

- WalletConnect v2 uses end-to-end encryption for session relay.
- The platform never receives private keys; only the public address.
- Sessions expire automatically; user must re-approve.
- Project ID is public (used client-side); not a secret.

### 4.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 10   | Wallet Integration    | Wallet picker, QR code, mobile wallet connection |
| 12   | Card Ordering         | Payment wallet selection (via wagmi)|

---

## 5. wagmi

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | React hooks for EVM                        |
| Website      | https://wagmi.sh                           |
| Docs         | https://wagmi.sh/dev/docs                  |
| Pricing      | Free (Open Source — MIT)                   |
| MVP Cost     | $0                                         |

### 5.1 Purpose

wagmi provides React hooks for EVM (Ethereum Virtual Machine) interactions:
- `useAccount` — current connected account (address, isConnected).
- `useConnect` — connect to a wallet (injected, WalletConnect).
- `useDisconnect` — disconnect wallet.
- `useChainId` — current chain ID.
- `useSwitchChain` — switch to a different network.
- `useBalance` — wallet balance (future).
- `sendTransaction` — prepare and send transactions (user signs).

### 5.2 Required Environment Variables

None (wagmi uses the WalletConnect project ID via the connector config).

### 5.3 Setup Steps

1. Install:
   ```bash
   npm install wagmi viem @tanstack/react-query
   ```
2. Configure chains and connectors in `src/lib/wagmi/provider.tsx` (Book 10 §22.1).
3. Wrap root layout with `WagmiProvider` + `QueryClientProvider`.
4. Use hooks in Client Components.

### 5.4 Security Considerations

- wagmi is a client-side library; no secrets involved.
- All signing happens in the user's wallet; wagmi only initiates the request.
- The platform never has access to private keys via wagmi.

### 5.5 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 10   | Wallet Integration    | useAccount, useConnect, useDisconnect, useChainId |
| 12   | Card Ordering         | sendTransaction for crypto payments |
| 11   | Crypto Payments       | Transaction submission (via wagmi)  |

---

## 6. viem

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | TypeScript EVM library                     |
| Website      | https://viem.sh                            |
| Docs         | https://viem.sh/docs                       |
| Pricing      | Free (Open Source — MIT)                   |
| MVP Cost     | $0                                         |

### 6.1 Purpose

viem provides low-level EVM functionality:
- `isAddress()` — validate Ethereum address format.
- `getTransaction()` — read transaction from blockchain (verification).
- `getTransactionReceipt()` — get transaction receipt (confirmations, block number).
- `getTransactionConfirmations()` — count confirmations.
- `formatEther()` / `parseEther()` — ETH unit conversion.
- Chain configs (ethereum, polygon, arbitrum, etc.).

### 6.2 Required Environment Variables

None (viem uses RPC URLs passed via wagmi transports or directly).

### 6.3 Setup Steps

1. Install (included with wagmi):
   ```bash
   npm install viem
   ```
2. Import chain configs from `viem/chains`.
3. Use utility functions (`isAddress`, `formatEther`) where needed.
4. Use `createPublicClient` for server-side blockchain reads (verification).

### 6.4 Security Considerations

- viem is a read-only library on the server side (verification).
- Never used to sign transactions (the user signs in their wallet).
- RPC URLs should use HTTPS (Alchemy provides this).

### 6.5 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 10   | Wallet Integration    | isAddress() for validation          |
| 11   | Crypto Payments       | getTransaction, getTransactionReceipt, getTransactionConfirmations for on-chain verification |

---

## 7. Alchemy

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Blockchain RPC provider                    |
| Website      | https://alchemy.com                        |
| Docs         | https://docs.alchemy.com                   |
| Pricing      | Free tier: 300M compute units/mo           |
| MVP Cost     | $0 (Free tier sufficient for MVP)          |
| Production   | Growth plan: $199/mo (unlimited compute)   |

### 7.1 Purpose

Alchemy provides reliable blockchain RPC endpoints:
- **Read transactions** — for payment verification (Book 11).
- **Read block numbers** — for confirmation counting.
- **Read balances** — (future, for wallet display).
- **Multi-chain** — Ethereum, Polygon, Arbitrum, Optimism, Base.

### 7.2 Required Environment Variables

```env
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/[API_KEY]
NEXT_PUBLIC_ALCHEMY_API_KEY=...
```

> For server-side verification (Edge Functions), use a separate server-only Alchemy key:
> ```env
> ALCHEMY_SERVER_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/[SERVER_API_KEY]
> ```

### 7.3 Setup Steps

1. Go to https://alchemy.com and create an account.
2. Create a new app.
3. Name it "TWallet Services".
4. Select the Ethereum Mainnet network.
5. Copy the API key.
6. Create separate apps for each chain (Polygon, Arbitrum, Optimism, Base).
   - Or use the same key with different URLs (Alchemy supports multi-chain keys).
7. Set environment variables.
8. Configure RPC URLs in `src/lib/wagmi/provider.tsx` (Book 10 §22.1).
9. Configure server-side public client for verification (Book 11).

### 7.4 Rate Limits

| Resource           | Free Tier              | Growth Plan          |
| ------------------ | ---------------------- | -------------------- |
| Compute units      | 300M/mo                | Unlimited            |
| Requests/sec       | ~600/sec               | ~660/sec             |
| Concurrent requests| 5                      | 20                   |

### 7.5 Security Considerations

- Alchemy API key is not a secret (used client-side in RPC URLs).
- For server-side verification, use a separate key stored as a server-only env var.
- All RPC calls over HTTPS.
- Alchemy includes DDoS protection and rate limiting.

### 7.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 10   | Wallet Integration    | RPC transport for wagmi (chain data)|
| 11   | Crypto Payments       | Server-side transaction verification|

---

## 8. Resend

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Transactional email                        |
| Website      | https://resend.com                         |
| Docs         | https://resend.com/docs                    |
| Pricing      | Free tier: 3,000 emails/mo, 100 emails/day |
| MVP Cost     | $0 (Free tier sufficient for MVP)          |
| Production   | Pro plan: $20/mo (50K emails/mo)           |

### 8.1 Purpose

Resend sends transactional emails for the platform:
- **Auth emails** — email verification, password reset (can be handled by Supabase Auth's built-in email or routed through Resend for custom templates).
- **Order emails** — order confirmation, shipping notification, delivery confirmation.
- **Payment emails** — payment verification success/failure.
- **Support emails** — ticket updates.

### 8.2 Required Environment Variables

```env
RESEND_API_KEY=re_...           # Server-only
RESEND_FROM_EMAIL=noreply@twalletservices.com
```

### 8.3 Setup Steps

1. Go to https://resend.com and create an account.
2. Add and verify your domain: `twalletservices.com`.
   - Add DNS records (SPF, DKIM, DMARC) at your domain registrar.
   - Wait for verification (usually a few minutes).
3. Create an API key (API Keys → Create API Key).
4. Set `RESEND_API_KEY` (server-only) and `RESEND_FROM_EMAIL` in env vars.
5. Install the SDK:
   ```bash
   npm install resend
   ```
6. Create email sending helper:
   ```ts
   // src/lib/email/resend.ts
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   export { resend };
   ```

### 8.4 Rate Limits

| Resource           | Free Tier       | Pro Plan        |
| ------------------ | --------------- | --------------- |
| Emails per month   | 3,000           | 50,000          |
| Emails per day     | 100             | No daily limit  |
| Emails per second  | 2               | 10              |

### 8.5 Security Considerations

- API key is server-only; never in client bundles.
- Domain verification (SPF, DKIM, DMARC) prevents email spoofing.
- Use `noreply@twalletservices.com` for transactional emails.
- Never send passwords, seed phrases, or private keys in emails.

### 8.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 09   | Authentication        | Verification email, password reset  |
| 12   | Card Ordering         | Order confirmation, shipping update |
| 11   | Crypto Payments       | Payment verification success/failure|
| 15   | Support Center        | Ticket update notifications         |
| 20   | Notifications & Email | All transactional email templates   |

---

## 9. Cloudflare Turnstile

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Bot protection / CAPTCHA alternative       |
| Website      | https://developers.cloudflare.com/turnstile/ |
| Docs         | https://developers.cloudflare.com/turnstile/ |
| Pricing      | Free                                       |
| MVP Cost     | $0                                         |

### 9.1 Purpose

Cloudflare Turnstile protects forms from bots without user friction:
- **Registration form** — prevent bot signups.
- **Contact form** — prevent spam.
- **Password reset** — prevent automated reset requests.
- **Support ticket creation** — prevent spam tickets.

Turnstile is a privacy-friendly CAPTCHA alternative that doesn't require user interaction in most cases (invisible verification).

### 9.2 Required Environment Variables

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...  # Public (client-side)
TURNSTILE_SECRET_KEY=...            # Server-only (verification)
```

### 9.3 Setup Steps

1. Go to https://dash.cloudflare.com → Turnstile.
2. Create a new widget.
3. Name it "TWallet Services".
4. Add domain: `twalletservices.com`.
5. Choose widget mode: Managed (recommended).
6. Copy the Site Key (public) and Secret Key (server-only).
7. Set environment variables.
8. Install the React component:
   ```bash
   npm install @marsidev/react-turnstile
   ```
9. Add to forms:
   ```tsx
   import { Turnstile } from '@marsidev/react-turnstile';

   <Turnstile
     siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
     onSuccess={(token) => setTurnstileToken(token)}
   />
   ```
10. Verify token server-side:
    ```ts
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
    });
    const data = await response.json();
    if (!data.success) throw new Error('Bot verification failed');
    ```

### 9.4 Rate Limits

| Resource           | Limit                |
| ------------------ | -------------------- |
| Verification calls | Unlimited (free)     |
| Widget renders     | Unlimited (free)     |

### 9.5 Security Considerations

- Site key is public (used client-side).
- Secret key is server-only; never in client bundles.
- Always verify the token server-side before processing the form.
- Turnstile respects user privacy (no cookies required in most cases).

### 9.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| 09   | Authentication        | Registration form bot protection    |
| 15   | Support Center        | Ticket creation bot protection      |
| 17   | Homepage              | Contact form bot protection         |

---

## 10. Sentry

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Error tracking & monitoring                |
| Website      | https://sentry.io                          |
| Docs         | https://docs.sentry.io                     |
| Pricing      | Free tier: 5K errors/mo, 50 perf trans     |
| MVP Cost     | $0 (Free tier)                             |
| Production   | Team plan: $26/mo (50K errors, 10K perf)   |

### 10.1 Purpose

Sentry tracks errors and performance issues:
- **Frontend errors** — React component crashes, unhandled exceptions.
- **Edge Function errors** — payment verification failures, order state errors.
- **Performance monitoring** — page load times, API response times.
- **Release tracking** — errors linked to specific deployments.

### 10.2 Required Environment Variables

```env
NEXT_PUBLIC_SENTRY_DSN=https://[key]@sentry.io/[project]  # Public (client-side)
SENTRY_AUTH_TOKEN=...  # Server-only (for source maps)
```

### 10.3 Setup Steps

1. Go to https://sentry.io and create an account.
2. Create a new project → Next.js.
3. Copy the DSN.
4. Set `NEXT_PUBLIC_SENTRY_DSN` in env vars.
5. Install the SDK:
   ```bash
   npm install @sentry/nextjs
   ```
6. Initialize Sentry:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   This creates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.
7. Configure source maps (optional but recommended):
   - Set `SENTRY_AUTH_TOKEN` (server-only).
   - Configure `next.config.ts` to upload source maps on build.

### 10.4 Rate Limits

| Resource           | Free Tier       | Team Plan       |
| ------------------ | --------------- | --------------- |
| Errors/month       | 5,000           | 50,000          |
| Performance transactions | 50         | 10,000          |
| Replay sessions    | 10              | 1,000           |

### 10.5 Security Considerations

- DSN is public (used client-side); it only sends error data, not user data.
- Sentry automatically scrubs sensitive fields (passwords, tokens).
- Configure `beforeSend` to scrub any custom sensitive data:
  ```ts
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    beforeSend(event) {
      // Scrub wallet addresses from error reports if needed
      return event;
    },
  });
  ```
- Never log seed phrases, private keys, or passwords to Sentry.

### 10.6 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| All  | All modules           | Error tracking across the app       |
| 23   | Deployment            | Release tracking, performance       |
| 24   | Testing               | Error monitoring in production      |

---

## 11. GitHub

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| Category     | Version control + CI/CD                    |
| Website      | https://github.com                         |
| Docs         | https://docs.github.com                    |
| Pricing      | Free (public repos), Free (private repos up to 3 collaborators) |
| MVP Cost     | $0                                         |

### 11.1 Purpose

GitHub hosts the code repository and enables CI/CD:
- **Version control** — all code, documentation, migrations.
- **Pull requests** — code review before merge.
- **Actions** — CI pipeline (lint, typecheck, tests on PR).
- **Vercel integration** — PR previews auto-deployed.

### 11.2 Required Environment Variables

None (GitHub is accessed via git CLI and web interface).

### 11.3 Setup Steps

1. Create a GitHub repository: `twallet-services`.
2. Push the project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[org]/twallet-services.git
   git push -u origin main
   ```
3. Connect to Vercel: import the GitHub repo in Vercel.
4. Set up GitHub Actions (optional for MVP; Vercel handles CI):
   ```yaml
   # .github/workflows/ci.yml
   name: CI
   on: [pull_request]
   jobs:
     lint-typecheck:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run lint
         - run: npm run typecheck
   ```

### 11.4 Security Considerations

- Never commit `.env` files or secrets to the repository.
- Use `.gitignore` for `.env`, `.env.local`, `node_modules/`, `.next/`.
- Use GitHub Secrets for CI environment variables if needed.
- Enable branch protection on `main` (require PR + review).

### 11.5 Where Used

| Book | Module                | Usage                               |
| ---- | --------------------- | ----------------------------------- |
| All  | All modules           | Code repository                     |
| 23   | Deployment            | CI/CD via GitHub Actions + Vercel   |

---

## 12. Environment Variables Master List

### 12.1 Client-Side (NEXT_PUBLIC_*)

| Variable                                    | Source      | Used In              |
| ------------------------------------------- | ----------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                  | Supabase    | All clients          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`             | Supabase    | All clients          |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`      | WalletConnect | Wallet module     |
| `NEXT_PUBLIC_ALCHEMY_RPC_URL`               | Alchemy     | wagmi provider       |
| `NEXT_PUBLIC_ALCHEMY_API_KEY`               | Alchemy     | wagmi provider       |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`            | Cloudflare  | Forms (register, contact) |
| `NEXT_PUBLIC_SENTRY_DSN`                    | Sentry      | Error tracking       |
| `NEXT_PUBLIC_SITE_URL`                      | Self        | Auth redirects       |

### 12.2 Server-Only (NEVER in client bundles)

| Variable                                    | Source      | Used In              |
| ------------------------------------------- | ----------- | -------------------- |
| `SUPABASE_SERVICE_ROLE_KEY`                 | Supabase    | Server Actions, Edge Functions |
| `RESEND_API_KEY`                            | Resend      | Email sending        |
| `RESEND_FROM_EMAIL`                         | Resend      | Email sending        |
| `TURNSTILE_SECRET_KEY`                      | Cloudflare  | Bot verification     |
| `SENTRY_AUTH_TOKEN`                         | Sentry      | Source map upload    |
| `ALCHEMY_SERVER_RPC_URL`                    | Alchemy     | Payment verification (Edge Function) |

### 12.3 `.env.example` File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...

# Alchemy (Blockchain RPC)
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
ALCHEMY_SERVER_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@twalletservices.com

# Cloudflare Turnstile (Bot Protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...

# App
NEXT_PUBLIC_SITE_URL=https://twalletservices.com
```

---

## 13. Setup Order

When setting up the project from scratch, follow this order:

1. **GitHub** — Create repository, push code.
2. **Supabase** — Create project, apply migrations, configure Auth, generate types.
3. **Vercel** — Import repo, configure env vars, deploy.
4. **WalletConnect** — Create project, get Project ID.
5. **Alchemy** — Create app, get API key, configure RPC URLs.
6. **Resend** — Create account, verify domain, get API key.
7. **Cloudflare Turnstile** — Create widget, get keys.
8. **Sentry** — Create project, get DSN, install SDK.
9. **wagmi + viem** — Install npm packages, configure provider.
10. **Test end-to-end** — Register, connect wallet, verify email.

---

## 14. Cost Estimate (MVP)

| Service               | Plan        | Monthly Cost |
| --------------------- | ----------- | ------------ |
| Supabase              | Free        | $0           |
| Vercel                | Free/Hobby  | $0           |
| WalletConnect         | Free        | $0           |
| wagmi + viem          | OSS         | $0           |
| Alchemy               | Free        | $0           |
| Resend                | Free        | $0           |
| Cloudflare Turnstile  | Free        | $0           |
| Sentry                | Free        | $0           |
| GitHub                | Free        | $0           |
| Domain                | Annual      | ~$1/mo       |
| **Total MVP**         |             | **~$1/mo**   |

### 14.1 Production Scaling Costs

| Service               | Upgrade Trigger        | Cost          |
| --------------------- | ---------------------- | ------------- |
| Supabase              | >500MB DB or >50K MAU  | $25/mo (Pro)  |
| Vercel                | >100GB bandwidth       | $20/mo (Pro)  |
| Alchemy               | >300M compute units    | $199/mo (Growth) |
| Resend                | >3K emails/mo          | $20/mo (Pro)  |
| Sentry                | >5K errors/mo          | $26/mo (Team) |
| **Total Production**  |                        | **~$290/mo**  |

---

## 15. References

- Book 09 — Authentication System (Supabase Auth setup)
- Book 10 — Wallet Integration (WalletConnect, wagmi, viem, Alchemy setup)
- Book 11 — Crypto Payments (Alchemy server-side verification)
- Book 20 — Notifications & Email Templates (Resend setup)
- Book 23 — Deployment (Vercel, GitHub CI/CD setup)
- `00-Project/TECH_STACK.md`
- `AGENTS.md`

---

## Next Book

**Book 11 — Crypto Payments** (`08-Payments/`): the complete checkout, blockchain verification, and order confirmation flow — the most critical financial logic in the platform. Uses viem for on-chain verification, Supabase Edge Functions for verification logic, and Alchemy RPC for blockchain reads.

---

> End of Book 10A — Third-Party Integrations & API Registry. This document is the single reference for configuring all external services. Any change to integrations, environment variables, or pricing requires an update to this document and a `00-Project/CHANGELOG.md` entry.
