# Book 10 — Wallet Integration

> **TWallet Services · TWallet Card**
> The complete, implementation-ready specification for the Wallet Integration module — the Web3 foundation of the platform. Covers WalletConnect v2, MetaMask, Coinbase Wallet, and Trust Wallet connections using wagmi + viem. The platform never requests or stores private keys, seed phrases, or recovery phrases. This document follows the implementation-ready template so OpenCode can build the entire wallet module from this one file.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 10 — Wallet Integration            |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Module       | Wallet Integration                 |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |
| Implements   | Book 02 FR-03-001..008, Book 05 SFR-03-001..005, Book 06 §11 |

### Revision History

| Version | Date       | Author                | Notes                                                                    |
| ------- | ---------- | --------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft (overview, wallets, networks, flows, UI, security, OpenCode prompt) |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: implementation-ready spec — wagmi/viem config, Supabase queries, server actions, Zod validation, component tree, edge cases, testing checklist, full OpenCode prompt |

---

## Table of Contents

1. [Business Purpose](#1-business-purpose)
2. [Overview](#2-overview)
3. [Objectives](#3-objectives)
4. [Supported Wallets (MVP)](#4-supported-wallets-mvp)
5. [Supported Networks](#5-supported-networks)
6. [Wallet Connection Flow](#6-wallet-connection-flow)
7. [UI Preview Description](#7-ui-preview-description)
8. [Components Used](#8-components-used)
9. [Component Tree](#9-component-tree)
10. [Database Tables](#10-database-tables)
11. [Supabase Queries](#11-supabase-queries)
12. [Server Actions](#12-server-actions)
13. [Validation Rules](#13-validation-rules)
14. [Wallet Information Stored](#14-wallet-information-stored)
15. [Connect Wallet UI](#15-connect-wallet-ui)
16. [Wallet Status States](#16-wallet-status-states)
17. [Connect Wallet Modal](#17-connect-wallet-modal)
18. [Wallet Dashboard Card](#18-wallet-dashboard-card)
19. [Network Switching](#19-network-switching)
20. [Disconnect Flow](#20-disconnect-flow)
21. [Payment Wallet Selection](#21-payment-wallet-selection)
22. [wagmi + viem Configuration](#22-wagmi--viem-configuration)
23. [Security Requirements](#23-security-requirements)
24. [Edge Cases](#24-edge-cases)
25. [Loading States](#25-loading-states)
26. [Empty States](#26-empty-states)
27. [Error States](#27-error-states)
28. [Success States](#28-success-states)
29. [Accessibility](#29-accessibility)
30. [SEO](#30-seo)
31. [Future Features](#31-future-features)
32. [Acceptance Criteria](#32-acceptance-criteria)
33. [Testing Checklist](#33-testing-checklist)
34. [OpenCode Prompt](#34-opencode-prompt)
35. [Glossary](#35-glossary)
36. [References](#36-references)

---

## 1. Business Purpose

The Wallet Integration module allows customers to securely connect supported cryptocurrency wallets to TWallet Services. This is the Web3 foundation of the platform — without a connected wallet, a user cannot order a card or make a crypto payment.

### 1.1 Why This Module Exists

- **Web3 identity:** The connected wallet address serves as the user's crypto identity for payments.
- **Payment authorization:** The wallet is used to sign and broadcast crypto payments to the platform's receiving address.
- **Transaction verification:** The platform verifies on-chain that the payment came from the connected wallet address.
- **Non-custodial principle:** The platform connects to the wallet using standard protocols (WalletConnect v2, injected providers) and never touches private keys or seed phrases.

### 1.2 Requirements Tracing

| Book 02 FR    | Description                              | Implemented In |
| ------------- | ---------------------------------------- | -------------- |
| FR-03-001     | Support WalletConnect v2                 | §22, §17       |
| FR-03-002     | Support MetaMask                         | §22, §17       |
| FR-03-003     | Support Coinbase Wallet                  | §22, §17       |
| FR-03-004     | Support Trust Wallet (via WalletConnect) | §22, §17       |
| FR-03-005     | Never request/store/transmit private keys or seed phrases | §23, §14 |
| FR-03-006     | Persist linked wallet address per user (read-only) | §11, §14 |
| FR-03-007     | Allow disconnecting a linked wallet      | §20            |
| FR-03-008     | Display connection errors with retry guidance | §27       |

### 1.3 Non-Negotiable Rules

> **The platform NEVER stores or requests:**
> - ✗ Seed Phrase
> - ✗ Recovery Phrase
> - ✗ Private Key
> - ✗ Wallet Password
>
> **The platform ONLY stores:**
> - ✓ Public wallet address
> - ✓ Wallet provider type
> - ✓ Connected network / chain ID
> - ✓ Connection timestamp
> - ✓ Wallet nickname (optional, user-provided)

---

## 2. Overview

The Wallet Integration module allows customers to securely connect supported cryptocurrency wallets to TWallet Services.

Wallet connections are used for:

- User identity (crypto address)
- Payment authorization (user signs in their own wallet)
- Transaction verification (platform verifies on-chain)
- Wallet management (connect, disconnect, reconnect)

The platform uses **standard wallet connection protocols only**:
- **WalletConnect v2** — for mobile wallets and universal connectivity
- **Injected providers** — for browser-extension wallets (MetaMask, Coinbase Wallet)
- **wagmi + viem** — React hooks and EVM interaction library

The platform **never signs or broadcasts transactions on behalf of the user**. The user signs in their own wallet; the platform only reads the public address and verifies on-chain transactions.

---

## 3. Objectives

| Objective                          | How Achieved                                              |
| ---------------------------------- | -------------------------------------------------------- |
| Provide secure wallet connectivity | Standard protocols (WalletConnect v2, injected providers)|
| Support multiple wallets           | MetaMask, Coinbase, Trust, Rainbow + any WC v2 wallet    |
| Support multiple blockchain networks | Ethereum, Polygon, Arbitrum, Optimism, Base, BNB, Avalanche |
| Allow easy reconnection            | Persisted wallet state; one-click reconnect              |
| Maintain user trust                | No-seed policy, trust notices, transparent connection log |
| Never request private keys         | Architecture constraint; enforced by design              |

---

## 4. Supported Wallets (MVP)

| Wallet            | Protocol           | Platform                    | MVP? |
| ----------------- | ------------------ | --------------------------- | ---- |
| WalletConnect     | WalletConnect v2   | Universal (mobile + desktop)| ✓    |
| MetaMask          | Injected provider  | Desktop extension + mobile  | ✓    |
| Coinbase Wallet   | Injected / SDK     | Desktop + mobile            | ✓    |
| Trust Wallet      | WalletConnect v2   | Mobile (via WC)             | ✓    |
| Rainbow Wallet    | WalletConnect v2   | Mobile (via WC)             | ✓    |
| TokenPocket       | WalletConnect v2   | Mobile (via WC)             | ✓    |
| Safe Wallet       | WalletConnect v2   | Desktop + mobile            | Future |
| Phantom           | Solana adapter     | Desktop extension + mobile  | Future |

### 4.1 Wallet Detection Strategy

```ts
// wagmi automatically detects available injected wallets
// WalletConnect v2 handles wallets not detected via injection
// The wallet picker shows:
//   1. Detected injected wallets (MetaMask, Coinbase) with "Detected" badge
//   2. WalletConnect option for all other wallets
//   3. Specific WC-compatible wallets (Trust, Rainbow, TokenPocket) with deep links
```

---

## 5. Supported Networks

| Network           | Chain ID | Symbol | RPC | MVP? |
| ----------------- | -------- | ------ | --- | ---- |
| Ethereum          | 1        | ETH    | Public/Alchemy | ✓ |
| BNB Smart Chain   | 56       | BNB    | Public  | ✓    |
| Polygon           | 137      | MATIC  | Public/Alchemy | ✓ |
| Arbitrum          | 42161    | ETH    | Public/Alchemy | ✓ |
| Optimism          | 10       | ETH    | Public/Alchemy | ✓ |
| Base              | 8453     | ETH    | Public/Alchemy | ✓ |
| Avalanche         | 43114    | AVAX   | Public  | ✓    |
| Solana            | —        | SOL    | —       | Future |

### 5.1 Network Configuration (wagmi chains)

```ts
import { ethereum, polygon, arbitrum, optimism, base, bnbSmartChain, avalanche } from 'wagmi/chains';

export const supportedChains = [
  ethereum,
  bnbSmartChain,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
] as const;
```

### 5.2 Unsupported Network Handling

If a user's wallet is on an unsupported network:
1. Display "Unsupported Network" warning.
2. Show "Switch Network" button (calls `wallet_switchEthereumChain` RPC).
3. If switch fails (chain not added), show "Add Network" button (calls `wallet_addEthereumChain`).
4. User cannot proceed with ordering/payment until on a supported network.

---

## 6. Wallet Connection Flow

```text
User
  ↓
Dashboard (/app) or Wallet page (/app/wallet)
  ↓
Click "Connect Wallet"
  ↓
Wallet Selection Modal opens
  ↓
Choose Wallet:
  • WalletConnect (QR code for mobile wallets)
  • MetaMask (injected)
  • Coinbase Wallet (injected/SDK)
  • Trust Wallet (via WalletConnect)
  • Rainbow Wallet (via WalletConnect)
  ↓
Wallet app opens (in user's browser extension or mobile app)
  ↓
User approves connection (in their own wallet)
  ↓
[if rejected: error with retry, no data written]
  ↓
Wallet address returned (read-only public address)
  ↓
Validate: supported network? address not already linked?
  ↓
Save wallet connection to Supabase (wallets table)
  ↓
Log connection event (wallet_connections table)
  ↓
Log activity (activity_logs table)
  ↓
Dashboard updated to show connected wallet
```

### 6.1 State Machine

```text
[not_connected]
      |
      | user clicks connect
      v
[selecting_wallet] ──user picks wallet──> [connecting]
      |                                         |
      | user closes modal                      | wallet prompts user
      v                                        v
[not_connected]                         [connecting]
                                              |
                                    +---------+---------+
                                    |                   |
                              user approves         user rejects
                                    |                   |
                                    v                   v
                              [connected]         [connection_failed]
                                    |                   |
                                    | disconnect        | retry
                                    v                   v
                              [disconnected]      [selecting_wallet]
```

---

## 7. UI Preview Description

### 7.1 `/app/wallet` — Wallet Page

**Layout (desktop):**
- Sidebar (app shell) + main content
- Main content sections:
  1. Page header: "Wallet" heading + "Connect Wallet" button (if not connected)
  2. Wallet status card (if connected): address, provider, network, status, disconnect button
  3. "What is wallet connection?" info panel (trust-building)
  4. Recent connections list (wallet_connections history)

**Layout (mobile):**
- Bottom tab bar + main content
- Same sections, stacked vertically
- Wallet card fills width

### 7.2 Trust Elements

- **Trust notice** at top of page: "We never ask for your recovery phrase or private keys. We only see your public wallet address."
- **Info panel**: Explains that the platform connects via standard protocols and cannot access funds.
- **Connection log**: User can see their connection history (transparency).

---

## 8. Components Used

| Component              | Source     | Usage in Wallet Module                |
| ---------------------- | ---------- | ------------------------------------- |
| `Button`               | Book 04 §11 | Connect/disconnect buttons           |
| `Card`                 | Book 04 §13 | Wallet status card, info panel        |
| `Modal` (Dialog)       | Book 04 §17 | Wallet picker modal, disconnect confirm |
| `Badge`                | Book 04 §16 | Network badge, status badge, "Detected" badge |
| `Spinner`              | Book 04 §23 | Connecting/loading states             |
| `Skeleton`             | Book 04 §23 | Initial page load                     |
| `Alert`                | Book 04 §23 | Error/success messages                |
| `Avatar`               | Book 04 §16 | Wallet provider logo                  |
| `Tooltip`              | Book 04 §17 | Address explanation, network info     |
| `WalletCard`           | Custom     | Connected wallet display              |
| `WalletPicker`         | Custom     | Wallet selection modal                |
| `NetworkBadge`         | Custom     | Network/chain indicator               |
| `TrustNotice`          | Custom     | "We never ask for seed phrase"        |
| `AddressDisplay`       | Custom     | Truncated address + copy button       |
| `QRCode`               | Custom     | WalletConnect QR code display         |

### 8.1 Custom Components

#### WalletCard

```tsx
interface WalletCardProps {
  address: string;
  provider: wallet_provider;
  network: string;
  chainId: number;
  walletName?: string;
  isPrimary: boolean;
  connectedAt: string;
  lastUsedAt?: string;
  onDisconnect: () => void;
}
// Displays wallet info in a card with:
// - Provider logo + name
// - Truncated address (0x1234...5678) with copy button
// - Network badge
// - Connection date + last used
// - Primary wallet badge
// - Disconnect button
```

#### WalletPicker

```tsx
interface WalletPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (connector: Connector) => void;
}
// Modal listing available wallets:
// - Detected injected wallets (MetaMask, Coinbase) with "Detected" badge
// - WalletConnect (shows QR code when selected)
// - Trust, Rainbow, TokenPocket (via WalletConnect with deep links)
```

#### NetworkBadge

```tsx
interface NetworkBadgeProps {
  network: string;
  chainId: number;
  logo?: string;
}
// Badge showing network name + logo + chain ID
// Color-coded per network (Ethereum=blue, Polygon=purple, etc.)
```

#### AddressDisplay

```tsx
interface AddressDisplayProps {
  address: string;
  truncateLength?: number;  // default 6 (0x1234...5678)
  showCopy?: boolean;       // default true
  showExternalLink?: boolean; // link to block explorer, default true
}
// Truncated address with:
// - Copy button (copies full address)
// - External link to block explorer (explorer_url/address/...)
// - Monospace font
```

---

## 9. Component Tree

### 9.1 Wallet Page (Not Connected)

```
WalletPage (Server Component shell)
├── AppLayout (sidebar + topbar)
└── WalletContent (Client Component — uses wagmi hooks)
    ├── PageHeader
    │   ├── Heading ("Wallet")
    │   └── Button ("Connect Wallet" → opens WalletPicker)
    ├── EmptyState
    │   ├── Illustration (wallet icon)
    │   ├── Text ("Connect your wallet to get started")
    │   └── Button ("Connect Wallet")
    ├── TrustNotice
    │   └── Text ("We never ask for your recovery phrase or private keys...")
    ├── InfoPanel (Card)
    │   ├── Heading ("What is wallet connection?")
    │   └── Text (explanation of standard protocols)
    └── WalletPicker (Modal, hidden until triggered)
        ├── DialogHeader ("Choose your wallet")
        ├── WalletOptionList
        │   ├── WalletOption (MetaMask, "Detected")
        │   ├── WalletOption (Coinbase Wallet, "Detected")
        │   ├── WalletOption (WalletConnect)
        │   ├── WalletOption (Trust Wallet)
        │   └── WalletOption (Rainbow Wallet)
        └── TrustNotice
```

### 9.2 Wallet Page (Connected)

```
WalletPage (Server Component shell)
├── AppLayout
└── WalletContent (Client Component)
    ├── PageHeader
    │   ├── Heading ("Wallet")
    │   └── Badge ("Connected" — success)
    ├── WalletCard
    │   ├── CardHeader
    │   │   ├── Avatar (provider logo)
    │   │   ├── ProviderName (e.g., "MetaMask")
    │   │   └── Badge ("Primary" — if is_primary)
    │   ├── CardContent
    │   │   ├── AddressDisplay (0x1234...5678)
    │   │   ├── NetworkBadge (Ethereum, Chain ID: 1)
    │   │   ├── KeyValue ("Connected", connectedAt)
    │   │   └── KeyValue ("Last used", lastUsedAt)
    │   └── CardFooter
    │       └── Button ("Disconnect" → opens confirm modal)
    ├── DisconnectConfirmModal
    │   ├── AlertTitle ("Disconnect Wallet?")
    │   ├── AlertDescription ("You'll need to reconnect to make payments...")
    │   ├── Button ("Cancel")
    │   └── Button ("Disconnect" — danger variant)
    ├── TrustNotice
    └── RecentConnectionsList
        ├── Heading ("Recent Connections")
        └── ConnectionItem[] (from wallet_connections table)
            ├── ProviderName
            ├── AddressDisplay
            ├── Badge (action: connect/disconnect/failed)
            └── Timestamp
```

---

## 10. Database Tables

### 10.1 Tables Used

| Table                   | Purpose in Wallet Module                | Book 08 §  |
| ----------------------- | --------------------------------------- | ---------- |
| `wallets`               | Stores connected wallets (read-only address) | §5.1  |
| `wallet_connections`    | Connection event history (audit)        | §5.2       |
| `supported_networks`    | Network configuration (chain IDs, RPCs) | §7.1       |
| `payment_transactions`  | References wallet_id for payments       | §7.3       |
| `activity_logs`         | Logs wallet connect/disconnect events   | §9.2       |

### 10.2 Key Columns

**wallets** (created on connect):
- `id` = UUID PK
- `profile_id` = FK → profiles(id)
- `wallet_provider` = 'metamask' | 'coinbase' | 'trust' | 'walletconnect'
- `wallet_address` = public address (TEXT, UNIQUE per chain)
- `network` = network name (TEXT)
- `chain_id` = EVM chain ID (INTEGER)
- `wallet_name` = optional user label
- `is_primary` = boolean (one primary per user)
- `connected_at` = timestamp
- `last_used_at` = timestamp
- `deleted_at` = soft delete (disconnect)

**wallet_connections** (append-only event log):
- `id` = UUID PK
- `profile_id` = FK → profiles(id)
- `wallet_id` = FK → wallets(id) (SET NULL on delete)
- `wallet_provider` = enum
- `wallet_address` = TEXT
- `action` = 'connect' | 'disconnect' | 'failed' (CHECK)
- `error_message` = TEXT (nullable)
- `ip_address` = INET
- `user_agent` = TEXT
- `created_at` = timestamp

---

## 11. Supabase Queries

### 11.1 Save Wallet Connection (Server Action)

```ts
// After wallet is connected via wagmi, save to database
async function saveWalletConnection(
  userId: string,
  address: string,
  provider: WalletProvider,
  network: string,
  chainId: number
) {
  const supabaseAdmin = createAdminClient();

  // 1. Insert or update wallet (upsert)
  const { data: wallet, error: walletError } = await supabaseAdmin
    .from('wallets')
    .upsert({
      profile_id: userId,
      wallet_provider: provider,
      wallet_address: address,
      network,
      chain_id: chainId,
      connected_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
      is_primary: true, // first wallet is primary
    }, {
      onConflict: 'wallet_address,chain_id',
    })
    .select()
    .single();

  if (walletError) throw walletError;

  // 2. Log connection event
  await supabaseAdmin
    .from('wallet_connections')
    .insert({
      profile_id: userId,
      wallet_id: wallet.id,
      wallet_provider: provider,
      wallet_address: address,
      action: 'connect',
      ip_address: clientIP,
      user_agent: userAgent,
    });

  // 3. Log activity
  await supabaseAdmin
    .from('activity_logs')
    .insert({
      profile_id: userId,
      action: 'wallet_connect',
      metadata: { provider, address, network, chain_id: chainId },
    });

  return wallet;
}
```

### 11.2 Disconnect Wallet (Server Action)

```ts
async function disconnectWallet(userId: string, walletId: string) {
  const supabaseAdmin = createAdminClient();

  // 1. Get wallet info before soft-deleting
  const { data: wallet } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('id', walletId)
    .eq('profile_id', userId)
    .single();

  if (!wallet) throw new Error('Wallet not found');

  // 2. Soft-delete wallet
  await supabaseAdmin
    .from('wallets')
    .update({ deleted_at: new Date().toISOString(), is_primary: false })
    .eq('id', walletId)
    .eq('profile_id', userId);

  // 3. Log disconnection event
  await supabaseAdmin
    .from('wallet_connections')
    .insert({
      profile_id: userId,
      wallet_id: walletId,
      wallet_provider: wallet.wallet_provider,
      wallet_address: wallet.wallet_address,
      action: 'disconnect',
    });

  // 4. Log activity
  await supabaseAdmin
    .from('activity_logs')
    .insert({
      profile_id: userId,
      action: 'wallet_disconnect',
      metadata: { provider: wallet.wallet_provider, address: wallet.wallet_address },
    });
}
```

### 11.3 Get User's Connected Wallet (Server Component)

```ts
async function getUserWallet(userId: string) {
  const supabase = createClient();

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('profile_id', userId)
    .is('deleted_at', null)
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();

  return wallet;
}
```

### 11.4 Get Connection History (Server Component)

```ts
async function getWalletConnections(userId: string) {
  const supabase = createClient();

  const { data: connections } = await supabase
    .from('wallet_connections')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return connections;
}
```

### 11.5 Get Supported Networks (Server Component)

```ts
async function getSupportedNetworks() {
  const supabase = createClient();

  const { data: networks } = await supabase
    .from('supported_networks')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return networks;
}
```

### 11.6 Log Failed Connection (Server Action)

```ts
async function logFailedConnection(
  userId: string,
  provider: WalletProvider,
  address: string | null,
  errorMessage: string
) {
  const supabaseAdmin = createAdminClient();

  await supabaseAdmin
    .from('wallet_connections')
    .insert({
      profile_id: userId,
      wallet_provider: provider,
      wallet_address: address || 'unknown',
      action: 'failed',
      error_message: errorMessage,
    });
}
```

### 11.7 Update Last Used (Server Action)

```ts
async function updateLastUsed(walletId: string) {
  const supabaseAdmin = createAdminClient();

  await supabaseAdmin
    .from('wallets')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', walletId);
}
```

---

## 12. Server Actions

### 12.1 Action Inventory

| Action                    | Route              | Input                    | Output                    |
| ------------------------- | ------------------ | ------------------------ | ------------------------- |
| `saveWalletConnection`    | `/app/wallet`      | WalletConnectionInput    | `{ wallet } \| { error }` |
| `disconnectWallet`        | `/app/wallet`      | `{ walletId }`           | `{ success } \| { error }` |
| `logFailedConnection`     | `/app/wallet`      | FailedConnectionInput    | `{ success }`             |
| `updateLastUsed`          | Internal           | `{ walletId }`           | `{ success }`             |

### 12.2 Validation Schema

```ts
// src/lib/validations/wallet.ts
import { z } from 'zod';

export const walletConnectionSchema = z.object({
  wallet_address: z
    .string()
    .min(1, 'Wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format'),
  wallet_provider: z.enum(['metamask', 'coinbase', 'trust', 'walletconnect']),
  network: z.string().min(1, 'Network is required'),
  chain_id: z.number().int().positive(),
  wallet_name: z.string().max(50).optional(),
});

export type WalletConnectionInput = z.infer<typeof walletConnectionSchema>;

export const disconnectWalletSchema = z.object({
  walletId: z.string().uuid('Invalid wallet ID'),
});

export type DisconnectWalletInput = z.infer<typeof disconnectWalletSchema>;
```

---

## 13. Validation Rules

| Field            | Rules                                                       |
| ---------------- | ----------------------------------------------------------- |
| wallet_address   | Required, valid EVM address format (0x + 40 hex chars)      |
| wallet_provider  | Required, enum: metamask/coinbase/trust/walletconnect       |
| network          | Required, must be in supported_networks table               |
| chain_id         | Required, positive integer, must match a supported network  |
| wallet_name      | Optional, max 50 chars                                      |

### 13.1 Address Validation (viem)

```ts
import { isAddress } from 'viem';

// Validate Ethereum address
const valid = isAddress(address); // returns boolean
```

### 13.2 Network Validation

```ts
const supportedChainIds = [1, 56, 137, 42161, 10, 8453, 43114];

const isSupportedNetwork = (chainId: number) =>
  supportedChainIds.includes(chainId);
```

---

## 14. Wallet Information Stored

### 14.1 Stored (Safe — Public Data)

| Field            | Type     | Example                              |
| ---------------- | -------- | ------------------------------------ |
| Wallet Address   | TEXT     | `0x1234...5678`                      |
| Wallet Provider  | ENUM     | `metamask`                           |
| Network          | TEXT     | `ethereum`                           |
| Chain ID         | INTEGER  | `1`                                  |
| Wallet Nickname  | TEXT     | `My MetaMask` (optional)             |
| Connection Date  | TIMESTAMPTZ | `2026-07-21T...`                  |
| Last Connected   | TIMESTAMPTZ | `2026-07-21T...`                  |
| Status           | —        | Active / Disconnected (soft delete)  |
| Is Primary       | BOOLEAN  | `true`                               |

### 14.2 NEVER Stored

| Field            | Reason                                                  |
| ---------------- | ------------------------------------------------------- |
| Private Key      | NEVER collected, NEVER stored. Architecture constraint. |
| Seed Phrase      | NEVER collected, NEVER stored. Architecture constraint. |
| Recovery Phrase  | NEVER collected, NEVER stored. Architecture constraint. |
| Wallet Password  | NEVER collected, NEVER stored. Architecture constraint. |

### 14.3 Data Access (RLS)

| Role     | SELECT | INSERT | UPDATE | DELETE |
| -------- | ------ | ------ | ------ | ------ |
| Customer | Own wallets only | Own wallets | Own wallets (soft delete) | — (no hard delete) |
| Admin    | All wallets | — | — | — |
| System   | All (Edge Functions) | All | All | All |

> Full RLS policies in Book 08 §10 (RLS overview) and deferred RLS book.

---

## 15. Connect Wallet UI

### 15.1 Page

`/app/wallet` (Hybrid: RSC shell + Client Component for wagmi hooks)

### 15.2 Sections

| Section                  | When Shown           |
| ------------------------ | -------------------- |
| Wallet Status            | Always               |
| Connect Wallet Button    | When not connected   |
| Connected Wallet Card    | When connected       |
| Network Information      | When connected       |
| Disconnect Button        | When connected       |
| Reconnect Button         | When disconnected    |
| Recent Connections       | Always (if history)  |
| Trust Notice             | Always               |
| Info Panel               | When not connected   |

---

## 16. Wallet Status States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| Not Connected        | Illustration + "Connect Wallet" primary button + info panel. |
| Connecting           | Spinner + "Connecting to [wallet name]..."                |
| Connected            | WalletCard with address, network, disconnect button.      |
| Connection Failed    | Error icon + message + "Try Again" button.                |
| Network Unsupported  | Warning + "Switch Network" button + "Try Another Wallet". |
| Disconnected         | Return to "Not Connected" state + toast "Wallet disconnected". |

---

## 17. Connect Wallet Modal

### 17.1 Modal Content

| Wallet            | Display                     | Badge         |
| ----------------- | --------------------------- | ------------- |
| MetaMask          | Logo + "MetaMask"           | "Detected" (if injected) |
| Coinbase Wallet   | Logo + "Coinbase Wallet"    | "Detected" (if injected) |
| WalletConnect     | Logo + "WalletConnect"      | —             |
| Trust Wallet      | Logo + "Trust Wallet"       | "Via WalletConnect" |
| Rainbow Wallet    | Logo + "Rainbow Wallet"     | "Via WalletConnect" |

### 17.2 Modal Behavior

- Opens as a centered dialog (Radix UI Dialog)
- Wallet options in a vertical list (cards)
- Clicking a wallet:
  - If injected (MetaMask/Coinbase): calls `connect()` from wagmi
  - If WalletConnect: opens WalletConnect modal (QR code for mobile, deep link for desktop)
- On success: close modal, save connection, show WalletCard
- On failure: show error in modal with "Try Again"
- Esc or backdrop click closes modal (no connection made)
- Trust notice at bottom of modal

### 17.3 QR Code (WalletConnect)

When WalletConnect is selected:
1. WalletConnect modal opens (provided by AppKit/Web3Modal)
2. QR code displayed for mobile wallet scanning
3. Deep links for mobile browsers (if on mobile)
4. User scans QR with their wallet app → approves connection
5. Connection established → close modals → save to DB

---

## 18. Wallet Dashboard Card

### 18.1 Displays

| Field              | Example                              |
| ------------------ | ------------------------------------ |
| Provider Logo      | MetaMask logo (avatar)               |
| Provider Name      | "MetaMask"                           |
| Wallet Address     | `0x1234...5678` (truncated + copy)   |
| Current Network    | NetworkBadge (Ethereum, Chain ID: 1) |
| Connection Date    | "Connected Jul 21, 2026"             |
| Last Activity      | "Last used Jul 21, 2026"             |
| Status             | Badge ("Connected" — success)        |
| Primary Wallet     | Badge ("Primary")                    |
| Disconnect Button  | "Disconnect" (danger ghost)          |
| Reconnect Button   | "Reconnect" (if disconnected)        |

---

## 19. Network Switching

### 19.1 If Network Unsupported

```text
User's wallet is on an unsupported network
  ↓
Display: "Unsupported Network"
  ↓
Show: "Switch Network" button
  ↓
[if user clicks]:
  ↓
  wallet_switchEthereumChain RPC call
  ↓
  [if success]: network switches → proceed
  ↓
  [if chain not added]: wallet_addEthereumChain RPC call
  ↓
  [if user rejects]: show error + "Try Again"
```

### 19.2 Network Switch Implementation (wagmi)

```ts
import { useSwitchChain } from 'wagmi';

function NetworkSwitcher({ targetChainId }: { targetChainId: number }) {
  const { switchChain, isPending, error } = useSwitchChain();

  return (
    <div>
      <Alert variant="warning">
        <AlertTitle>Unsupported Network</AlertTitle>
        <AlertDescription>
          Please switch to a supported network to continue.
        </AlertDescription>
      </Alert>
      <Button
        onClick={() => switchChain({ chainId: targetChainId })}
        isLoading={isPending}
      >
        Switch Network
      </Button>
      {error && <Alert variant="error">{error.message}</Alert>}
    </div>
  );
}
```

---

## 20. Disconnect Flow

```text
Settings (/app/wallet)
  ↓
Click "Disconnect" on WalletCard
  ↓
Confirmation Modal opens:
  "Disconnect Wallet?"
  "You'll need to reconnect to make payments. Your connection history will be retained."
  ↓
[if cancel]: close modal, no action
  ↓
[if confirm]:
  ↓
  wagmi disconnect()
  ↓
  Server Action: disconnectWallet()
    - Soft-delete wallet (set deleted_at)
    - Log disconnection event (wallet_connections)
    - Log activity (activity_logs)
  ↓
  Dashboard updated → show "Not Connected" state
  ↓
  Toast: "Wallet disconnected"
```

### 20.1 Disconnect Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Confirmation required         | Modal with "Disconnect" + "Cancel" buttons.         |
| Soft delete only              | Wallet row is soft-deleted (deleted_at set); history retained. |
| Connection log preserved      | wallet_connections rows are append-only (never deleted). |
| Activity logged               | 'wallet_disconnect' action in activity_logs.        |
| wagmi disconnect              | Clears wagmi connection state + WalletConnect session. |
| Toast notification            | "Wallet disconnected" success toast.                |
| Can reconnect                 | Reconnecting creates a new wallets row (old one stays soft-deleted). |

---

## 21. Payment Wallet Selection

During the payment step of the order wizard (Book 12 — Card Ordering):

```text
Customer at /app/order/payment
  ↓
Select payment wallet (if multiple — MVP: one at a time)
  ↓
System displays:
  - Receiving address (platform's address)
  - Amount to send
  - Network to send on
  ↓
User clicks "Pay with [Wallet]"
  ↓
Wallet opens (wagmi sendTransaction)
  ↓
User confirms transaction in their own wallet
  ↓
Transaction broadcast to blockchain
  ↓
User submits tx hash to platform
  ↓
Platform verifies on-chain (Book 11 — Crypto Payments)
```

> The platform **never** signs or broadcasts on behalf of the user. The user signs in their own wallet.

---

## 22. wagmi + viem Configuration

### 22.1 Wagmi Provider Setup

```ts
// src/lib/wagmi/provider.tsx
'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, bnbSmartChain, polygon, arbitrum, optimism, base, avalanche } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const chains = [mainnet, bnbSmartChain, polygon, arbitrum, optimism, base, avalanche];

const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [polygon.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [optimism.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [bnbSmartChain.id]: http(),
    [avalanche.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WagmiProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 22.2 Root Layout Integration

```ts
// src/app/layout.tsx
import { WagmiProviders } from '@/lib/wagmi/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <WagmiProviders>
          {/* Supabase providers, other providers */}
          {children}
        </WagmiProviders>
      </body>
    </html>
  );
}
```

### 22.3 Client Hooks Usage

```ts
// src/hooks/useWallet.ts
'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { isAddress } from 'viem';

export function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const chainId = useChainId();

  const connect = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (!connector) throw new Error('Wallet not found');
    return connectAsync({ connector });
  };

  const disconnect = async () => {
    return disconnectAsync();
  };

  return {
    address: address as `0x${string}` | undefined,
    isConnected,
    connector,
    chainId,
    connect,
    disconnect,
    isConnecting,
    isAddress,
  };
}
```

### 22.4 Environment Variables

```env
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...  # From WalletConnect Cloud

# Blockchain RPC (Alchemy — see Book 10A for setup)
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
NEXT_PUBLIC_ALCHEMY_API_KEY=...

# Block Explorer (for address links)
NEXT_PUBLIC_ETHERSCAN_API_KEY=...
```

---

## 23. Security Requirements

### 23.1 Security Measures

| Measure                          | Implementation                                       |
| -------------------------------- | ---------------------------------------------------- |
| Never expose wallet secrets      | No private key / seed phrase fields, anywhere.       |
| Always use HTTPS                 | Vercel enforces HTTPS; HSTS header.                  |
| Validate chain ID                | Check against supported_networks table.              |
| Verify wallet ownership          | The act of connecting via WalletConnect/injected proves ownership. |
| Reject unsupported networks      | Display warning + network switch prompt.             |
| Log wallet events                | All connect/disconnect/failed events logged to wallet_connections. |
| Encrypt session data             | HTTPS in transit; Supabase encryption at rest.       |
| Read-only address                | Platform stores address only; no signing capability. |
| No transaction signing           | Platform never signs or broadcasts for the user.     |
| Rate limit connection attempts   | 10 / min / user to prevent abuse.                    |

### 23.2 Trust Notice

Displayed on the wallet page and in the wallet picker modal:

```
🔒 We never ask for your recovery phrase or private keys.
We only see your public wallet address.
```

### 23.3 What the Platform CAN Do

- ✓ Read the public wallet address
- ✓ Request network switches (user approves in their wallet)
- ✓ Read the current chain ID
- ✓ Request transactions (user signs in their own wallet)

### 23.4 What the Platform CANNOT Do

- ✗ Access private keys
- ✗ Access seed phrases
- ✗ Sign transactions on behalf of the user
- ✗ Broadcast transactions without user approval
- ✗ Move funds without the user's explicit wallet approval

---

## 24. Edge Cases

| Edge Case                              | Handling                                              |
| -------------------------------------- | ----------------------------------------------------- |
| User's wallet not installed            | Show "Wallet not detected" + link to wallet's website |
| User rejects connection                | "Connection rejected" + "Try Again" button            |
| User's wallet is on unsupported network| "Unsupported Network" + "Switch Network" button       |
| Wallet extension is locked             | "Please unlock your wallet" message                   |
| User closes WalletConnect QR modal     | Return to wallet picker, no error                     |
| WalletConnect session expires          | Show "Session expired" + "Reconnect" button           |
| Network switch rejected by user        | "Network switch cancelled" + stay on warning          |
| User refreshes during connection       | Connection state lost; show "Not Connected"           |
| Duplicate wallet address (same chain)  | Upsert (update existing row) instead of insert        |
| User has wallet on mobile, no extension| WalletConnect QR code works cross-device              |
| Multiple wallets injected              | Let user choose which to connect                      |
| User's chain ID doesn't match network  | Detect mismatch, prompt network switch                |
| RPC endpoint down                      | "Network unavailable" + retry                         |
| Wallet address format invalid          | Validate with viem `isAddress()` before saving        |
| User disconnects while payment pending | Payment can still be verified (tx already broadcast)  |

---

## 25. Loading States

| Component              | Loading Behavior                                      |
| ---------------------- | ----------------------------------------------------- |
| Connect button         | Spinner + "Connecting..."                             |
| Wallet picker          | Spinner on selected wallet option                     |
| QR code (WalletConnect)| Skeleton QR while generating                          |
| Wallet page (initial)  | Skeleton wallet card                                  |
| Network switch button  | Spinner + "Switching..."                              |
| Disconnect button      | Spinner + "Disconnecting..."                          |
| Recent connections     | Skeleton list                                         |

---

## 26. Empty States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| No wallet connected  | Illustration (wallet icon) + "Connect your wallet to get started" + "Connect Wallet" button. |
| No connection history| "No recent connections" (muted text, no illustration needed) |

---

## 27. Error States

### 27.1 Error Messages

| Error                  | Message                                          | Action                |
| ---------------------- | ------------------------------------------------ | --------------------- |
| Wallet not installed   | "[Wallet name] not detected. Install the extension to continue." | Link to wallet website |
| Connection rejected    | "Connection rejected. Please try again."         | "Try Again" button    |
| Unsupported network    | "Unsupported network. Please switch to a supported network." | "Switch Network" button |
| Wallet locked          | "Please unlock your wallet and try again."       | "Try Again" button    |
| Session expired        | "Wallet session expired. Please reconnect."      | "Reconnect" button    |
| Network unavailable    | "Network unavailable. Please try again later."   | "Retry" button        |
| Timeout                | "Connection timed out. Please try again."        | "Try Again" button    |
| Wallet busy            | "Your wallet is busy. Please try again."         | "Try Again" button    |
| Unknown error          | "Something went wrong. Please try again."        | "Try Again" + "Contact Support" |

### 27.2 Error Display Rules

- Errors shown in the wallet picker modal (during connection) or as an Alert on the wallet page.
- All errors are user-friendly; technical details logged server-side.
- Failed connections logged to `wallet_connections` table with `action = 'failed'`.
- Every error has a retry path.

---

## 28. Success States

| Action              | Success Behavior                                      |
| ------------------- | ----------------------------------------------------- |
| Wallet connected    | WalletCard appears + toast "Wallet connected" + connection logged. |
| Network changed     | NetworkBadge updates + toast "Network switched to [name]". |
| Wallet disconnected | WalletCard disappears + toast "Wallet disconnected" + disconnection logged. |
| Wallet reconnected  | WalletCard appears + toast "Wallet reconnected".      |

---

## 29. Accessibility

| Requirement                  | Implementation                                       |
| ---------------------------- | ---------------------------------------------------- |
| Keyboard navigation          | Wallet picker options reachable via Tab; Enter to select. |
| Focus indicators             | `:focus-visible` ring on all interactive elements.   |
| ARIA labels                  | Wallet option buttons have `aria-label` with wallet name. |
| Modal                        | ARIA dialog; focus trapped; Esc closes; focus restored. |
| Address display              | `aria-label` with full address; copy button announces "Address copied". |
| Network badge                | `aria-label` with network name + chain ID.           |
| QR code (WalletConnect)      | `alt` text describing the QR code purpose.           |
| Screen reader                | Connection status changes announced via `aria-live`. |
| Color contrast               | WCAG 2.1 AA (Book 04 §4.5).                          |
| Reduced motion               | QR code appearance and status transitions respect `prefers-reduced-motion`. |

---

## 30. SEO

The wallet page is **not indexable**.

| Page         | Meta Robots                    |
| ------------ | ------------------------------ |
| `/app/wallet`| `noindex, nofollow`            |

```ts
export const metadata = {
  title: 'Wallet | TWallet Services',
  robots: { index: false, follow: false },
};
```

---

## 31. Future Features

Reserved for post-MVP:

| Feature                    | Version |
| -------------------------- | ------- |
| Multiple connected wallets | v2      |
| Favorite wallet            | v2      |
| ENS name resolution        | v2      |
| Wallet avatar              | v2      |
| Wallet balance display     | v2      |
| NFT holdings               | v2      |
| Token portfolio            | v2      |
| Wallet activity timeline   | v2      |
| Cross-chain support        | v2      |
| Safe Wallet (multi-sig)    | v2      |
| Phantom (Solana)           | v3      |
| Wallet signature verification | v2   |

---

## 32. Acceptance Criteria

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-WL-01 | Given an authenticated user, when they connect MetaMask, then their address is stored read-only. |
| AC-WL-02 | Given an authenticated user, when they connect Coinbase Wallet, then their address is stored read-only. |
| AC-WL-03 | Given an authenticated user, when they connect Trust Wallet via WalletConnect, then their address is stored read-only. |
| AC-WL-04 | Given any wallet flow, then no private key or seed phrase is ever requested. |
| AC-WL-05 | Given a connected wallet, when user disconnects, then the wallet is soft-deleted and connection history is retained. |
| AC-WL-06 | Given a wallet connection rejection, then a user-friendly error with retry is shown. |
| AC-WL-07 | Given a wallet on an unsupported network, then an "Unsupported Network" warning with "Switch Network" button is shown. |
| AC-WL-08 | Given a successful connection, then a connection event is logged to wallet_connections. |
| AC-WL-09 | Given a successful connection, then an activity log entry is created with action='wallet_connect'. |
| AC-WL-10 | Given a connected wallet, then the wallet page shows the address (truncated + copyable), provider, network badge, and disconnect button. |
| AC-WL-11 | Given a user with no connected wallet, then the wallet page shows an empty state with "Connect Wallet" CTA. |
| AC-WL-12 | Given a wallet address, then it is validated with viem `isAddress()` before being saved. |
| AC-WL-13 | Given a failed connection, then a failed event is logged to wallet_connections with the error message. |
| AC-WL-14 | Given the wallet page, then a trust notice "We never ask for your recovery phrase or private keys" is visible. |
| AC-WL-15 | Given any wallet interaction, then the platform never signs or broadcasts a transaction on behalf of the user. |

---

## 33. Testing Checklist

### 33.1 Unit Tests (Vitest)

- [ ] `walletConnectionSchema` validates address format, provider, network, chain ID
- [ ] `disconnectWalletSchema` validates wallet ID
- [ ] `saveWalletConnection` upserts wallet + logs connection + logs activity
- [ ] `disconnectWallet` soft-deletes + logs disconnection + logs activity
- [ ] `logFailedConnection` inserts failed event
- [ ] Address validation with viem `isAddress()`
- [ ] Network validation against supported chain IDs

### 33.2 Integration Tests (Vitest + Supabase local)

- [ ] Wallet connection saves to wallets table
- [ ] Wallet connection logs to wallet_connections table
- [ ] Wallet connection logs to activity_logs table
- [ ] Wallet disconnect soft-deletes (sets deleted_at)
- [ ] Wallet disconnect logs to wallet_connections with action='disconnect'
- [ ] RLS: user can only see their own wallets
- [ ] RLS: user can only insert their own wallets
- [ ] Unique constraint: same address + chain_id upserts (doesn't duplicate)

### 33.3 E2E Tests (Playwright)

- [ ] User can navigate to /app/wallet
- [ ] User sees "Connect Wallet" button when not connected
- [ ] User can open wallet picker modal
- [ ] Wallet picker lists all supported wallets
- [ ] User can close modal with Esc
- [ ] Connected wallet shows address, provider, network
- [ ] User can copy wallet address
- [ ] User can disconnect wallet (with confirmation)
- [ ] Disconnect shows toast "Wallet disconnected"
- [ ] Unsupported network shows warning + switch button
- [ ] No field requests seed phrase or private key
- [ ] Trust notice is visible on wallet page and in modal
- [ ] Wallet page is keyboard navigable
- [ ] Recent connections list shows connection history

### 33.4 Accessibility Tests

- [ ] Axe DevTools passes on wallet page
- [ ] Keyboard-only walkthrough: open picker, select wallet, close, disconnect
- [ ] Screen reader announces connection status changes

---

## 34. OpenCode Prompt

```
Build a production-ready Wallet Integration module for TWallet Services using Next.js 15 (App Router), TypeScript (strict), wagmi + viem, WalletConnect v2, Tailwind CSS v4, and shadcn/ui (customized to Book 04 design tokens).

## Route to Build

/app/wallet — Wallet management page

## Requirements

### Architecture
- Use Server Components for page shell and data fetching (getUserWallet, getWalletConnections, getSupportedNetworks).
- Use Client Components for wagmi hooks (useAccount, useConnect, useDisconnect, useChainId).
- Use Server Actions for database operations (saveWalletConnection, disconnectWallet, logFailedConnection).
- Set up wagmi provider in src/lib/wagmi/provider.tsx with createConfig, injected + walletConnect connectors, and Alchemy RPC transports.
- Wrap root layout with WagmiProviders (WagmiProvider + QueryClientProvider).
- NEVER put SUPABASE_SERVICE_ROLE_KEY in a client bundle.

### Wagmi Configuration (src/lib/wagmi/provider.tsx)
- Chains: ethereum (1), bnbSmartChain (56), polygon (137), arbitrum (42161), optimism (10), base (8453), avalanche (43114)
- Connectors: injected() + walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, showQrModal: true })
- Transports: http() with Alchemy RPC URL for Ethereum, Polygon, Arbitrum, Optimism, Base; http() default for BNB, Avalanche

### Custom Hook (src/hooks/useWallet.ts)
- useAccount: address, isConnected, connector
- useConnect: connectAsync, connectors, isPending
- useDisconnect: disconnectAsync
- useChainId: current chain ID
- Export: address, isConnected, connector, chainId, connect, disconnect, isConnecting, isAddress

### Wallet Page (/app/wallet)
- Server Component shell: fetch user's wallet, connection history, supported networks
- Client Component (WalletContent): uses wagmi hooks for real-time wallet state
- States: Not Connected (empty + CTA + info panel), Connected (WalletCard), Connecting (spinner), Failed (error + retry)
- Trust notice: "We never ask for your recovery phrase or private keys."
- Info panel: explains standard protocol connection, no fund access

### Wallet Picker Modal
- Dialog (Radix UI) listing: MetaMask, Coinbase Wallet, WalletConnect, Trust Wallet, Rainbow Wallet
- Detected injected wallets show "Detected" badge
- WalletConnect wallets show "Via WalletConnect" badge
- Each option: logo, name, badge, click to connect
- Trust notice at bottom
- Esc / backdrop click closes modal

### Wallet Card (connected state)
- Provider logo (avatar) + name
- Badge: "Primary" if is_primary
- AddressDisplay: truncated address (0x1234...5678) + copy button + block explorer link
- NetworkBadge: network name + chain ID + logo
- Connection date + last used date
- "Disconnect" button (danger ghost variant) → opens confirm modal

### Disconnect Confirm Modal
- "Disconnect Wallet?" title
- "You'll need to reconnect to make payments. Your connection history will be retained." description
- "Cancel" + "Disconnect" (danger) buttons
- On confirm: wagmi disconnect() → server action disconnectWallet() → toast "Wallet disconnected"

### Network Switching
- If wallet on unsupported chain: show Alert (warning) + "Switch Network" button
- useSwitchChain from wagmi
- If switch fails (chain not added): show "Add Network" fallback

### Server Actions (src/app/wallet/actions.ts)
- saveWalletConnection: validate with Zod, upsert to wallets table, insert wallet_connections, insert activity_logs
- disconnectWallet: soft-delete wallet (set deleted_at), insert wallet_connections (action='disconnect'), insert activity_logs
- logFailedConnection: insert wallet_connections (action='failed', error_message)

### Validation (src/lib/validations/wallet.ts)
- walletConnectionSchema: wallet_address (0x + 40 hex), wallet_provider (enum), network (string), chain_id (positive int), wallet_name (optional, max 50)
- disconnectWalletSchema: walletId (UUID)

### Database (from Book 08)
- wallets: id, profile_id, wallet_provider, wallet_address, network, chain_id, wallet_name, is_primary, connected_at, last_used_at, created_at, updated_at, deleted_at
- wallet_connections: id, profile_id, wallet_id, wallet_provider, wallet_address, action, error_message, ip_address, user_agent, created_at
- RLS: users can only SELECT/INSERT/UPDATE their own wallets; wallet_connections INSERT only

### Design System (Book 04)
- App layout: sidebar + topbar (from Book 03)
- Card: --color-surface, --radius-card (20px), --shadow-md
- Button: primary, danger (ghost for disconnect), full-width on mobile
- Badge: success (Connected), warning (Unsupported Network), danger (Failed)
- Address: monospace font, truncated, copy button with icon swap (copy → check)
- Network badge: color-coded per network
- Loading: spinner in buttons, skeleton for initial page load
- Trust notice: subtle info badge with shield icon

### Security
- NEVER request/store/transmit private keys or seed phrases
- Read-only wallet address storage
- Validate address with viem isAddress()
- Validate chain ID against supported networks
- Log all connection events (connect/disconnect/failed)
- Platform never signs or broadcasts transactions
- Rate limit: 10 connection attempts / min / user

### Accessibility (WCAG 2.1 AA)
- Wallet picker: keyboard navigable, ARIA dialog, focus trapped, Esc closes
- Address: aria-label with full address, copy button announces "Address copied"
- Network badge: aria-label with network name + chain ID
- Status changes: announced via aria-live
- Focus indicators on all interactive elements

### SEO
- /app/wallet: noindex, nofollow
- Title: "Wallet | TWallet Services"

### File Structure
src/
├── app/
│   └── app/
│       └── wallet/
│           ├── page.tsx              (Server Component — fetch data)
│           ├── actions.ts            (Server Actions)
│           └── wallet-content.tsx    (Client Component — wagmi hooks)
├── lib/
│   ├── wagmi/
│   │   └── provider.tsx              (WagmiProvider + config)
│   └── validations/
│       └── wallet.ts                 (Zod schemas)
├── hooks/
│   └── useWallet.ts                  (Custom hook wrapping wagmi)
└── components/
    └── wallet/
        ├── WalletCard.tsx
        ├── WalletPicker.tsx
        ├── WalletOption.tsx
        ├── NetworkBadge.tsx
        ├── AddressDisplay.tsx
        ├── DisconnectConfirmModal.tsx
        └── TrustNotice.tsx

### Environment Variables
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-only)

Generate all files with full TypeScript types, strict mode, no `any`. Follow the TWallet Services Design System (Book 04) for all visual elements. Ensure all acceptance criteria (AC-WL-01 through AC-WL-15) are satisfied. NEVER request or store private keys or seed phrases in any field or component.
```

---

## 35. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| WalletConnect v2    | Protocol connecting wallets to apps without exposing keys.        |
| Injected provider   | Browser extension wallet (e.g., MetaMask) injecting ethereum provider. |
| wagmi               | React hooks library for EVM interactions.                        |
| viem                | TypeScript library for EVM actions (address validation, RPC).    |
| Chain ID            | Unique identifier for a blockchain network (e.g., 1 = Ethereum). |
| EVM                 | Ethereum Virtual Machine (compatible chains).                    |
| RPC                 | Remote Procedure Call endpoint for blockchain reads/writes.      |
| Connector           | wagmi abstraction for a wallet connection method.                 |
| `isAddress()`       | viem function validating Ethereum address format.                 |
| Soft delete         | Marking a row as deleted via `deleted_at` without removing it.    |

---

## 36. References

- Book 02 — Business Requirements (FR-03-001..008, §9.3)
- Book 04 — Design System (component APIs, tokens, states)
- Book 05 — Software Requirements Specification (SFR-03-001..005, §8.2; wallet state machine, §6.4)
- Book 06 — User Experience & User Flows (wallet connection flow, §11; page spec, §5.3.7)
- Book 08 — Database Schema (wallets, §5.1; wallet_connections, §5.2; supported_networks, §7.1)
- Book 03 — Information Architecture (wallet route, §9.6; access control, §13)
- Book 10A — Third-Party Integrations & API Registry (WalletConnect, Alchemy, wagmi, viem setup)
- `00-Project/TECH_STACK.md`
- `AGENTS.md`

---

## Next Book

**Book 10A — Third-Party Integrations & API Registry** (`01-Foundation/BOOK_10A_THIRD_PARTY_INTEGRATIONS.md`): every external service in one place — WalletConnect, wagmi, viem, Alchemy, Resend, Cloudflare Turnstile, Supabase, Vercel — with purpose, environment variables, pricing, rate limits, setup steps, security considerations, and where each is used in the application. The single reference for configuring the project.

**Book 11 — Crypto Payments** (`08-Payments/BOOK_11_CRYPTO_PAYMENTS.md`): the complete checkout, blockchain verification, and order confirmation flow — the most critical financial logic in the platform.

---

> End of Book 10 — Wallet Integration. This document is the complete, implementation-ready specification for the wallet module. Any change to supported wallets, networks, connection flows, or security rules requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
