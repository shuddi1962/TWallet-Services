# 10 — Wallet Management

> Component ID: ADM-010 | Status: Approved
> Manage platform receiving wallet addresses — add, rotate, disable, monitor.

## Route

`/admin/wallets` — Server Component + Client

## Access

- Super Admin only (all actions)

## Purpose

The platform uses configured receiving wallets for customer payments. These are the addresses customers send crypto to. Managing them properly is critical for security.

## Features

### Table

| Column | Type | Sortable |
|--------|------|----------|
| Address | Truncated (full on hover) | Yes |
| Network | Network name + icon | Yes |
| Label | Admin-assigned label | Yes |
| Status | Active/Inactive/Rotated | Yes |
| Received (total) | USDC amount | Yes |
| TX Count | Count | Yes |
| Created | Date | Yes |
| Last Used | Date | Yes |
| Rotated To | Linked address (if rotated) | — |
| Actions | Dropdown menu | — |

### Actions (Dropdown per row)

| Action | Behavior |
|--------|----------|
| View | Opens detail drawer |
| Edit | Edit label |
| Rotate | Deactivate current, create new replacement, auto-link |
| Disable | Sets `active = false`, no new payments to this address |
| Enable | Sets `active = true` |
| View Transactions | Filters payment_transactions by this address |

### Add Wallet (Modal)

| Field | Type | Validation |
|-------|------|------------|
| Address | Text input | Required, valid blockchain address |
| Network | Select | Required |
| Label | Text input | Required, 3-50 chars |
| Private Key | File upload (encrypted) | Optional, for monitoring |
| Notes | Textarea | Optional, max 500 |

## Rotation Workflow

1. Admin clicks "Rotate" on current wallet
2. Modal: "Create new wallet for [network]"
3. Set new label + address
4. System: old address marked `rotated`, new address created with `rotated_from = old.id`
5. Active orders using old address continue to be monitored
6. New orders use the new address

### Wallet Detail (Drawer)

| Section | Data |
|---------|------|
| Wallet Info | Address (full, copyable), network, label, status, created |
| Usage | Total received, transaction count, last used date |
| Rotation History | If rotated: old → new chain |
| Active Orders | Orders pointing to this address |
| Recent Transactions | Last 10 payments to this address |

## Security

- Wallet addresses are stored in `supported_wallet_addresses` table
- Private keys: NEVER stored. Addresses only for receiving.
- Rotation: old addresses remain viewable for reconciliation
- All actions logged to `audit_logs`

## Component Tree

```
AdminWalletsPage (Server Component)
├── PageHeader ("Wallet Addresses" + Add Wallet button)
├── Filters (network, status)
├── WalletsTable (Client)
│   ├── TableHeader
│   └── WalletRow
│       ├── AddressCell (truncated + copy button)
│       ├── NetworkCell (icon + name)
│       ├── LabelCell
│       ├── StatusBadge (Active/Inactive/Rotated — color-coded)
│       ├── TotalReceivedCell
│       ├── TxCountCell
│       ├── CreatedCell
│       ├── LastUsedCell
│       ├── RotatedToCell (link if applicable)
│       └── ActionsDropdown
├── AddWalletModal
└── WalletDetailDrawer
```

## Server Actions

```ts
addWalletAddress(data: AddWalletInput): Promise<ActionResult>
updateWalletLabel(id: string, label: string): Promise<ActionResult>
rotateWalletAddress(id: string, newAddress: string, newLabel: string): Promise<ActionResult>
disableWalletAddress(id: string): Promise<ActionResult>
enableWalletAddress(id: string): Promise<ActionResult>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table |
| Empty | "No wallet addresses configured" + Add Wallet |
| Rotated | Old row dimmed, "Rotated → [link to new]" badge |
| Inactive | "Inactive" badge, row muted |
| Error | "Failed to load wallets" + Retry |

## Accessibility

- Address: `aria-label="Wallet address [label]"`
- Copy button: copy icon + "Copied!" tooltip on success
- Warning on add: "Ensure this address is correct. Funds sent to wrong addresses cannot be recovered."
