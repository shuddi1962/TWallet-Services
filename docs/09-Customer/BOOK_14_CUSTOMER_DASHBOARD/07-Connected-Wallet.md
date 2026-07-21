# 07 — Connected Wallet

> Component ID: DB-007 | Status: Approved
> Full wallet management page with connect, disconnect, switch network, and copy actions.

## Purpose

Allow users to manage their wallet connection — connect a new wallet, disconnect, switch networks, copy address, and view on block explorer.

## Route

`/app/wallet` — Hybrid: RSC shell + Client Component (wagmi hooks)

## Layout

- Full page within app layout (sidebar + topbar)
- Sections stacked vertically, max-width 800px, centered

## Sections

### 1. Page Header
- Heading: "Wallet" (h1, 32px, 700, `--color-heading`)
- Subtext: "Manage your connected crypto wallet." (14px, `--color-body`)

### 2. Wallet Status Card
- When connected: shows full wallet details (see below)
- When not connected: empty state with "Connect Wallet" CTA

### 3. Trust Notice
- "We never ask for your recovery phrase or private keys. We only see your public wallet address." (14px, `--color-muted`, shield icon, in an info alert)

### 4. Connection History
- List of recent connection events from `wallet_connections` table
- Each row: provider, address (truncated), action (connect/disconnect/failed badge), timestamp

## Connected Wallet Card

| Element | Spec |
|---------|------|
| Provider logo + name | 40px logo + "MetaMask" (20px, 600) |
| Primary badge | "Primary" badge if `is_primary` (success variant) |
| Address | Full address (monospace, 16px) + copy button + explorer link |
| Network badge | Network name + logo + chain ID |
| Connected date | "Connected on Jul 21, 2026 at 10:30 AM" (14px, `--color-muted`) |
| Last used | "Last used Jul 21, 2026" (14px, `--color-muted`) |

### Actions

| Action | Button | Behavior |
|--------|--------|----------|
| Disconnect | Ghost danger, "Disconnect" | Opens confirm modal → soft-delete wallet + log event |
| Switch Network | Secondary, "Switch Network" | Opens network selector (if wallet supports it) |
| Reconnect | Primary, "Reconnect" | If disconnected (soft-deleted), reconnect same wallet |
| Copy Address | Icon button | Copies full address to clipboard; shows "Copied!" tooltip |
| View Explorer | Ghost link | Opens block explorer for address in new tab |

## Component Tree

```
WalletPage (Server Component shell)
├── AppLayout
└── WalletContent (Client Component — wagmi hooks)
    ├── PageHeader
    │   ├── Heading ("Wallet")
    │   └── Subtext ("Manage your connected crypto wallet.")
    ├── [if connected]
    │   ├── WalletCard
    │   │   ├── CardHeader (logo + name + primary badge)
    │   │   ├── CardContent
    │   │   │   ├── AddressDisplay (full address + copy + explorer)
    │   │   │   ├── NetworkBadge
    │   │   │   ├── KeyValue ("Connected on", date)
    │   │   │   └── KeyValue ("Last used", date)
    │   │   └── CardFooter
    │   │       ├── Button ("Switch Network" — secondary)
    │   │       └── Button ("Disconnect" — ghost danger)
    │   ├── DisconnectConfirmModal
    │   └── ConnectionHistory
    │       ├── Heading ("Connection History")
    │       └── ConnectionItem[] (provider, address, action badge, timestamp)
    ├── [if not connected]
    │   ├── EmptyState
    │   │   ├── WalletIcon (64px)
    │   │   ├── Text ("No wallet connected")
    │   │   ├── Subtext ("Connect your wallet to get started.")
    │   │   └── Button ("Connect Wallet" → opens WalletPicker)
    │   └── WalletPicker (modal — from Book 10)
    └── TrustNotice (info alert)
```

## Database Tables

- `wallets` — connected wallet info
- `wallet_connections` — connection event history
- `supported_networks` — network config
- `activity_logs` — logs wallet connect/disconnect

## Supabase Queries

See Book 10 §11 for full query implementations (saveWalletConnection, disconnectWallet, getWalletConnections).

## States

| State | UI |
|------|-----|
| Loading | Skeleton wallet card |
| Connected | Full card with address, network, actions |
| Not connected | Empty state + "Connect Wallet" CTA + wallet picker |
| Connecting | Spinner in picker modal + "Connecting to [wallet]..." |
| Disconnecting | Spinner in disconnect button |
| Connection failed | Error in picker + "Connection rejected. Try again." |
| Network unsupported | Warning alert + "Switch Network" button |

## Accessibility

- `<section aria-label="Wallet Management">`
- All buttons have descriptive `aria-label`
- Address: `aria-label` with full address
- Copy: announces "Address copied" via aria-live
- Explorer link: `rel="noopener noreferrer"`, `aria-label="View on [explorer]"`
- Wallet picker: ARIA dialog (from Book 10)
- Trust notice: visible and announced

## References

- Book 10 — Wallet Integration (full wallet connection spec, wagmi config, server actions)
- Book 06 — User Experience & User Flows (wallet page spec, §5.3.7)
