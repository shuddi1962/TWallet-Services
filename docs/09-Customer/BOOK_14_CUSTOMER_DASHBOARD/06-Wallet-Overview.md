# 06 — Wallet Overview

> Component ID: DB-006 | Status: Approved
> Dashboard widget showing connected wallet status, address, network, and recent activity.

## Purpose

Give users a quick view of their connected wallet without navigating to the full wallet page.

## Layout

- **Dashboard widget:** 8 columns (desktop), 12 (tablet/mobile)
- **Card:** `--color-surface`, 24px radius, `--shadow-md`, `--space-6` padding

## Content (When Connected)

| Element | Spec |
|---------|------|
| Card header | "Wallet Overview" (18px, 600, `--color-heading`) + "View All" link (→ `/app/wallet`) |
| Wallet provider | Logo (32px) + name (e.g., "MetaMask") (16px, 600) |
| Wallet address | Truncated (0x1234...5678) + copy button (monospace, 14px) |
| Network | NetworkBadge (e.g., "Ethereum" with logo, chain ID) |
| Connection status | Badge: "Connected" (success) with check icon |
| Primary badge | "Primary" badge if `is_primary = true` |
| Connected date | "Connected Jul 21, 2026" (12px, `--color-muted`) |
| Last used | "Last used Jul 21, 2026" (12px, `--color-muted`) |
| Disconnect button | Ghost danger variant (→ opens confirm modal) |
| Explorer link | External link: "View on Etherscan" (opens new tab) |

## Content (When Not Connected)

| Element | Spec |
|---------|------|
| Illustration | Wallet icon (64px, `--color-muted`) |
| Message | "No wallet connected" (16px, `--color-body`) |
| Subtext | "Connect your wallet to start ordering cards and making payments." (14px, `--color-muted`) |
| CTA | "Connect Wallet" button (primary, → `/app/wallet`) |
| Trust notice | "We never ask for your seed phrase or private keys." (12px, `--color-muted`, shield icon) |

## Component Tree

```
WalletOverview (RSC + Client for wagmi state)
├── CardHeader
│   ├── Heading ("Wallet Overview")
│   └── Link ("View All" → /app/wallet)
├── [if connected]
│   ├── WalletInfo
│   │   ├── ProviderLogo + ProviderName
│   │   ├── AddressDisplay (truncated + copy)
│   │   ├── NetworkBadge
│   │   └── StatusBadge ("Connected" — success)
│   ├── WalletMeta
│   │   ├── KeyValue ("Connected", connectedAt)
│   │   ├── KeyValue ("Last used", lastUsedAt)
│   │   └── Badge ("Primary" — if is_primary)
│   └── WalletActions
│       ├── Link ("View on Etherscan" → external)
│       └── Button ("Disconnect" — ghost danger, → confirm modal)
└── [if not connected]
    ├── EmptyState
    │   ├── WalletIcon (64px, muted)
    │   ├── Text ("No wallet connected")
    │   ├── Subtext ("Connect your wallet to start...")
    │   └── Button ("Connect Wallet" → /app/wallet, primary)
    └── TrustNotice (shield + "We never ask for your seed phrase...")
```

## Component Props

```ts
interface WalletOverviewProps {
  wallet: {
    wallet_provider: string;
    wallet_address: string;
    network: string;
    chain_id: number;
    is_primary: boolean;
    connected_at: string;
    last_used_at: string | null;
  } | null;
  isLoading?: boolean;
}
```

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton: card with gray blocks for address, badges, buttons |
| Connected | Full wallet info as described above |
| Not connected | Empty state with "Connect Wallet" CTA |
| Error | Error card: "Failed to load wallet" + retry |
| Disconnecting | Button shows spinner; "Disconnecting..." |

## Supabase Query

```ts
const { data: wallet } = await supabase
  .from('wallets')
  .select(`
    *,
    supported_networks:wallet_connections(
      supported_networks(name, chain_id, explorer_url, logo)
    )
  `)
  .eq('profile_id', userId)
  .is('deleted_at', null)
  .order('connected_at', { ascending: false })
  .limit(1)
  .single();
```

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Fade-in | Card | 300ms on load |
| Copy success | Copy button icon swap (copy → check) | 200ms |
| Hover | "View All" link | 150ms (color shift) |

## Accessibility

- `<section aria-label="Wallet Overview">`
- Address: `aria-label="Wallet address: [full address]"`
- Copy button: `aria-label="Copy wallet address"`, announces "Address copied" via aria-live
- Explorer link: `aria-label="View wallet on [explorer name]"`, `rel="noopener noreferrer"`
- Disconnect: `aria-label="Disconnect wallet"`
- Trust notice: `aria-label="We never ask for your recovery phrase or private keys"`
