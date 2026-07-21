# 16 — Security Center

> Component ID: DB-015 | Status: Approved
> Account security monitoring — password, wallets, login activity, trusted devices, alerts, and sessions.

## Purpose

Allow users to monitor and manage their account security from one central location.

## Route

`/app/security` — Hybrid: RSC shell + Client Component (forms)

## Security Cards (6)

### 1. Password Status
| Field | Display |
|-------|---------|
| Password set | "Yes" (success badge) |
| Last changed | "Jul 21, 2026" (14px, muted) |
| Strength | "Strong" (success) / "Weak" (warning) |
| Action | "Change Password" button → opens form |

### Change Password Form
| Field | Type | Validation |
|-------|------|------------|
| Current Password | Password (with toggle) | Required |
| New Password | Password (with toggle + strength meter) | Min 8, 1 upper, 1 lower, 1 number, 1 special |
| Confirm Password | Password | Must match |

- On success: sign out other sessions + toast "Password changed"
- On error: "Current password is incorrect"

### 2. Connected Wallets
| Field | Display |
|-------|---------|
| Wallet address | Truncated + copy + explorer |
| Provider | "MetaMask" (16px) |
| Network | NetworkBadge |
| Connected since | Date |
| Action | "Disconnect" (if connected) / "Connect" (if not) |
| Review note | "Review your wallet connections regularly" |

### 3. Recent Login Activity
| Field | Display |
|-------|---------|
| Date | "Jul 21, 2026 10:30 AM" |
| Device | "Chrome on Mac" |
| Location | "New York, USA" |
| Browser | "Chrome 126" |
| IP Address | "192.168.1.1" (monospace) |
| Status | Badge: Success (success) / Failed (danger) |

- Shows last 10 logins from `activity_logs` where action = 'login'

### 4. Trusted Devices
| Field | Display |
|-------|---------|
| Device | "Chrome on Mac" |
| Last active | "2 hours ago" |
| Location | "New York, USA" |
| Action | "Revoke" button (removes trust) |

- Future: device trust management (not MVP, but UI placeholder)

### 5. Security Alerts
| Alert | Display |
|-------|---------|
| Suspicious login | Warning: "Login from new device detected" |
| Password breach | Danger: "Your password may have been compromised" |
| Wallet change | Info: "New wallet connected" |

- Shows recent security-type notifications

### 6. Active Sessions
| Field | Display |
|-------|---------|
| Device | "Chrome on Mac" |
| Location | "New York, USA" |
| IP | "192.168.1.1" |
| Last active | "2 hours ago" |
| Current | "Current Session" badge (on current) |
| Action | "Revoke" button (non-current sessions) |

- "Logout All" button (danger) — signs out all sessions except current

## Actions

| Action | Implementation |
|--------|---------------|
| Change Password | `supabase.auth.updateUser({ password })` + log activity |
| Review Sessions | Display all active sessions |
| Disconnect Device | Revoke session |
| Review Wallet Connections | Show all connected wallets with disconnect option |
| Enable MFA | Future (disabled button with "Coming soon") |
| Logout All | Sign out all sessions except current |

## Component Tree

```
SecurityCenter (Server Component shell)
├── AppLayout
└── SecurityContent (Client Component)
    ├── PageHeader
    │   ├── Heading ("Security")
    │   └── Subtext ("Monitor and manage your account security.")
    ├── PasswordStatusCard
    │   ├── StatusRow ("Password set", "Yes" — success)
    │   ├── StatusRow ("Last changed", date)
    │   ├── StatusRow ("Strength", "Strong" — success)
    │   └── ChangePasswordForm (modal or inline)
    │       ├── FormField (Current Password + toggle)
    │       ├── FormField (New Password + strength meter)
    │       ├── FormField (Confirm Password)
    │       └── Button ("Change Password")
    ├── ConnectedWalletsCard
    │   ├── WalletInfo (address + provider + network + date)
    │   ├── Button ("Disconnect" — if connected)
    │   └── Note ("Review your wallet connections regularly")
    ├── RecentLoginActivityCard
    │   └── LoginItem[] (date, device, location, browser, IP, status)
    ├── TrustedDevicesCard
    │   └── DeviceItem[] (device, last active, location, revoke button)
    ├── SecurityAlertsCard
    │   └── AlertItem[] (type, message, timestamp)
    └── ActiveSessionsCard
        ├── SessionItem[] (device, location, IP, last active, current badge, revoke)
        └── Button ("Logout All" — danger)
```

## Database Tables

- `activity_logs` — login/logout/password events
- `wallets` — connected wallets
- `notifications` — security alerts (filtered by type = 'warning' or 'error')

## Supabase Queries

```ts
// Recent logins
const { data: logins } = await supabase
  .from('activity_logs')
  .select('*')
  .eq('profile_id', userId)
  .eq('action', 'login')
  .order('created_at', { ascending: false })
  .limit(10);

// Connected wallets
const { data: wallets } = await supabase
  .from('wallets')
  .select('*')
  .eq('profile_id', userId)
  .is('deleted_at', null);

// Security alerts
const { data: alerts } = await supabase
  .from('notifications')
  .select('*')
  .eq('profile_id', userId)
  .in('type', ['warning', 'error'])
  .is('deleted_at', null)
  .order('created_at', { ascending: false })
  .limit(5);

// Change password
const { error } = await supabase.auth.updateUser({ password: newPassword });
await supabaseAdmin.from('activity_logs').insert({ profile_id: userId, action: 'password_reset', metadata: { method: 'self' } });
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton cards |
| Ready | All 6 cards with data |
| Password changing | Button spinner + fields disabled |
| Password changed | Toast "Password changed" + form reset |
| Password error | Inline: "Current password is incorrect" |
| Session revoked | Toast "Session revoked" + row removed |
| Error | Error card + retry |

## Accessibility

- `<section aria-label="Security Center">`
- Password fields: `aria-label` + show/hide toggle
- Strength meter: `aria-label="Password strength: [level]"`
- Revoke buttons: `aria-label="Revoke session on [device]"`
- Error text: `aria-live="polite"`
- Keyboard: full navigation via Tab
