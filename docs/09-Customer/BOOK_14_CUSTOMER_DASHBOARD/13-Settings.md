# 13 — Settings

> Component ID: DB-013 | Status: Approved
> User settings across 8 categories — general, security, wallet, notifications, appearance, language, privacy, and sessions.

## Purpose

Let users configure every aspect of their dashboard experience and account security.

## Route

`/app/settings` — Hybrid: RSC shell + Client Component (forms + switches)

## Categories (8)

### 1. General
| Setting | Control | Default |
|---------|---------|---------|
| Date format | Select | MMM D, YYYY |
| Number format | Select | 1,234.56 |
| Timezone | Select | UTC (from profile) |

### 2. Security
| Setting | Control | Default |
|---------|---------|---------|
| Change Password | Button | → opens password change form |
| View Active Sessions | Button | → /app/security |
| Logout Other Devices | Button (danger) | Signs out all other sessions |
| Enable MFA | Switch (disabled) | "Coming soon" |

### 3. Wallet
| Setting | Control | Default |
|---------|---------|---------|
| Auto-reconnect wallet | Switch | On |
| Default network | Select | Ethereum |
| Show wallet balance | Switch | Off (future) |

### 4. Notifications
| Setting | Control | Default |
|---------|---------|---------|
| Email notifications | Switch | On |
| Browser notifications | Switch | Off (requests permission) |
| Push notifications | Switch (disabled) | "Coming soon" |
| Marketing emails | Switch | Off |
| Order updates | Switch | On |
| Payment alerts | Switch | On |
| Security alerts | Switch | On (disabled — always on) |
| Support replies | Switch | On |

### 5. Appearance
| Setting | Control | Default |
|---------|---------|---------|
| Theme | Radio (Light / Dark / System) | Light |
| Note | "Dark mode coming soon" | — |
| Sidebar collapsed | Switch | Off (desktop only) |

### 6. Language
| Setting | Control | Default |
|---------|---------|---------|
| Language | Select | English |
| Note | "More languages coming soon" | — |

### 7. Privacy
| Setting | Control | Default |
|---------|---------|---------|
| Show transaction history | Switch | On |
| Activity tracking | Switch | On |
| Data export | Button | "Export My Data" (GDPR — future) |
| Delete account | Button (danger) | "Request Account Deletion" (future) |

### 8. Sessions
| Setting | Control | Default |
|---------|---------|---------|
| Active sessions list | Display | Shows all active sessions |
| Revoke session | Button per session | Signs out that session |
| Logout all | Button (danger) | Signs out everywhere |

## Component Tree

```
SettingsPage (Server Component shell)
├── AppLayout
└── SettingsContent (Client Component)
    ├── PageHeader
    │   ├── Heading ("Settings")
    │   └── Subtext ("Manage your preferences and security.")
    ├── SettingsCategory ("General")
    │   ├── SelectRow ("Date format")
    │   ├── SelectRow ("Number format")
    │   └── SelectRow ("Timezone")
    ├── SettingsCategory ("Security")
    │   ├── ButtonRow ("Change Password" → form)
    │   ├── ButtonRow ("View Active Sessions" → /app/security)
    │   ├── ButtonRow ("Logout Other Devices" — danger)
    │   └── SwitchRow ("Enable MFA" — disabled, "Coming soon")
    ├── SettingsCategory ("Wallet")
    │   ├── SwitchRow ("Auto-reconnect wallet", on)
    │   ├── SelectRow ("Default network")
    │   └── SwitchRow ("Show wallet balance" — disabled, future)
    ├── SettingsCategory ("Notifications")
    │   ├── SwitchRow ("Email notifications", on)
    │   ├── SwitchRow ("Browser notifications", off)
    │   ├── SwitchRow ("Push notifications" — disabled)
    │   ├── SwitchRow ("Marketing emails", off)
    │   ├── SwitchRow ("Order updates", on)
    │   ├── SwitchRow ("Payment alerts", on)
    │   ├── SwitchRow ("Security alerts", on — disabled)
    │   └── SwitchRow ("Support replies", on)
    ├── SettingsCategory ("Appearance")
    │   ├── ThemeSelector (Light / Dark / System — radio)
    │   ├── Note ("Dark mode coming soon")
    │   └── SwitchRow ("Sidebar collapsed" — desktop)
    ├── SettingsCategory ("Language")
    │   ├── Select ("English")
    │   └── Note ("More languages coming soon")
    ├── SettingsCategory ("Privacy")
    │   ├── SwitchRow ("Show transaction history", on)
    │   ├── SwitchRow ("Activity tracking", on)
    │   ├── Button ("Export My Data" — future)
    │   └── Button ("Request Account Deletion" — danger, future)
    └── SettingsCategory ("Sessions")
        ├── SessionList (active sessions with device, location, IP, last active)
        ├── Button ("Revoke" per session)
        └── Button ("Logout All" — danger)
```

## Behavior

- Switches: optimistic update (UI updates immediately; revert on error)
- Auto-save: switches save on toggle (no save button)
- Selects: save on change
- Success: subtle toast "Settings saved" (3s)
- Error: revert + toast "Failed to save setting"
- "Logout Other Devices": confirm dialog → signs out all sessions except current
- "Change Password": opens form (same as Security Center §16)

## Accessibility

- `<section aria-label="Settings">`
- Switches: `role="switch"`, `aria-checked`, `aria-label="[setting name]"`
- Disabled switches: `aria-disabled="true"` + note
- Selects: `aria-label="[setting name]"`
- Buttons: `aria-label="[action]"`
- Keyboard: Tab to navigate, Enter/Space to toggle/activate
