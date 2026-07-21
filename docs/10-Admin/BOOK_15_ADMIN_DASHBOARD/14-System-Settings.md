# 14 — System Settings

> Component ID: ADM-014 | Status: Approved
> Platform configuration — general, payments, security.

## Route

`/admin/settings` — Server + Client

## Access

- Super Admin only (all actions)
- All other roles: no access (redirect)

## Settings Sections

### 1. General

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Platform Name | Text | "TWallet Card" | Used in emails, meta |
| Support Email | Email | — | Customer support email |
| Support Phone | Phone | — | Optional |
| Platform URL | URL | — | Production URL |
| Maintenance Mode | Toggle | false | Disables customer-facing pages |
| Maintenance Message | Textarea | — | Shown when maintenance = on |

### 2. Payments

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Default Network | Select | "ethereum" | Primary payment network |
| Min Confirmations | Number | 12 | Block confirmations for verified |
| USDC Contract Address | Text | — | Per network (stored in supported_tokens) |
| Allowed Tokens | Multi-select | all | Which tokens are accepted |
| Allowed Networks | Multi-select | all | Which networks are accepted |
| Max Payment Amount | Number | 100000 | Max USDC per transaction (0 = unlimited) |
| Min Payment Amount | Number | 10 | Min USDC per transaction |
| Payment Timeout (hrs) | Number | 48 | Hours before pending payment expires |
| Platform Fee (%) | Number (0-100) | 2.5 | Fee charged on each transaction |
| Fee Wallet Address | Text | — | Where fees are sent |
| Fee Wallet Network | Select | — | Network of fee wallet |

### 3. Security

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Max Login Attempts | Number | 5 | Before temporary lockout |
| Lockout Duration (min) | Number | 15 | How long account is locked |
| Session Duration (hrs) | Number | 24 | Before session expires |
| Require MFA | Toggle | false | Enforce MFA for all users |
| Admin Session Duration (hrs) | Number | 8 | Admin session length |
| Rate Limit (req/min) | Number | 60 | Global API rate limit |
| IP Whitelist (admin) | Textarea | — | Comma-separated IPs (optional) |

### 4. Notifications

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Order Confirmation Email | Toggle | true | Sent to customer |
| Payment Confirmation Email | Toggle | true | Sent to customer |
| Shipping Update Email | Toggle | true | Sent to customer |
| Admin New Order Alert | Toggle | true | Notification to admins |
| Admin Failed Payment Alert | Toggle | true | Notification to admins |
| Admin New Ticket Alert | Toggle | true | Notification to admins |

### 5. KYC

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Require KYC | Toggle | false | Require KYC for card ordering |
| KYC Tier 1 Limit | Number | 1000 | Max spend without tier 2 |
| KYC Tier 2 Limit | Number | 100000 | Max spend with tier 2 |
| KYC Provider | Select | — | Integration (future) |

## Edit Behavior

- Click setting → inline edit (text becomes input, toggle flips)
- Save button per section
- Cancel reverts unsaved changes
- Unsaved changes: prompt on navigation away

## Component Tree

```
AdminSettingsPage (Server Component)
├── PageHeader ("System Settings" — Super Admin badge)
├── SettingsNav (tab bar — General, Payments, Security, Notifications, KYC)
└── SettingsTab (active section)
    ├── SettingsGroup (section heading + description)
    │   ├── SettingRow (label + description + input/toggle)
    │   └── SettingRow (...)
    └── SaveButton per section
```

## Server Actions

```ts
getSettings(): Promise<SystemSettings>
updateSettings(category: string, settings: Record<string, any>): Promise<ActionResult>
batchUpdateSettings(settings: Record<string, any>): Promise<ActionResult>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton settings |
| Saved | Toast: "Settings saved" |
| Error | Toast: "Failed to save" + specific field errors |
| Unsaved | Warning when navigating away |
