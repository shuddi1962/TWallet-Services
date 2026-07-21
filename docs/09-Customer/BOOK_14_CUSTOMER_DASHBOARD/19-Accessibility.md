# 19 — Accessibility

> WCAG 2.1 AA checklist for the entire customer dashboard.

## Global Requirements

| Requirement | Implementation |
|-------------|---------------|
| Skip-to-content link | At top of every dashboard page, before sidebar |
| Landmarks | `<header>`, `<nav>`, `<main>`, `<section>` per page |
| Heading hierarchy | h1 per page (page title), h2 per section, h3 per card |
| Focus indicators | `:focus-visible` ring on all interactive elements |
| Keyboard navigation | All actions reachable via Tab; Enter/Space to activate |
| Color contrast | `--color-body` on `--color-surface` = 9.7:1 (AAA); `--color-muted` on surface = 3.9:1 (AA-large only) |
| Color not alone | Status conveyed with icon + text, not color alone |
| Reduced motion | All animations respect `prefers-reduced-motion` |
| Screen reader | Semantic HTML; ARIA where needed; no aria-overload |
| No tab traps | Except in modals (focus trap is correct behavior) |

## Per-Page Checklist

### Dashboard Overview
- [ ] Skip link present
- [ ] `<main aria-label="Dashboard">`
- [ ] One h1 (welcome banner greeting)
- [ ] Each widget has `aria-label`
- [ ] Stats: `aria-label="[label]: [value]"`
- [ ] Quick actions: `aria-label="[action]"`
- [ ] Keyboard: Tab through all widgets

### Top Navigation
- [ ] `<header>` landmark
- [ ] `<nav aria-label="Dashboard navigation">` on sidebar
- [ ] Search: `aria-label="Search dashboard"`, results in `role="listbox"`
- [ ] Notifications: `aria-label="Notifications, [N] unread"`
- [ ] Profile dropdown: ARIA menu, keyboard navigable, Esc closes
- [ ] Active nav item: `aria-current="page"`
- [ ] `/` keyboard shortcut for search focus

### Wallet Overview
- [ ] `<section aria-label="Wallet Overview">`
- [ ] Address: `aria-label` with full address
- [ ] Copy button: `aria-label="Copy wallet address"`, announces "Copied"
- [ ] Explorer link: `rel="noopener noreferrer"`, `aria-label="View on [explorer]"`
- [ ] Disconnect: `aria-label="Disconnect wallet"`
- [ ] Trust notice: visible and announced

### Card Management
- [ ] `<section aria-label="Card Management">`
- [ ] Each card: `aria-label="[type] card, status: [status]"`
- [ ] Status badges: text + icon
- [ ] "Order New Card": `aria-label="Order a new card"`

### Order Management
- [ ] `<section aria-label="Order Management">`
- [ ] Filter tabs: ARIA tabs (`role="tablist"`, `role="tab"`)
- [ ] Table: `<th scope>` on headers
- [ ] Tracking timeline: `aria-label="Order tracking: [completed] of [total]"`
- [ ] "View" button: `aria-label="View order [ID]"`

### Transaction History
- [ ] `<section aria-label="Transaction History">`
- [ ] Table: `<th scope>` on headers
- [ ] Tx hash: `aria-label` with full hash
- [ ] Copy button: announces "Copied"
- [ ] Explorer link: `rel="noopener noreferrer"`
- [ ] Amounts: right-aligned, tabular-nums

### Notifications
- [ ] `<section aria-label="Notifications">`
- [ ] Each notification: `aria-label="[Title]: [Message]"`
- [ ] Unread indicator: `aria-label="Unread"`
- [ ] New notifications: `aria-live="polite"`
- [ ] "Mark All as Read": `aria-label`
- [ ] Dismiss: `aria-label="Dismiss notification"`

### Profile
- [ ] `<section aria-label="Profile">`
- [ ] Labels above inputs (htmlFor associated)
- [ ] Email field: `aria-readonly="true"`
- [ ] Avatar upload: `aria-label="Upload avatar image"`
- [ ] Error text: `aria-live="polite"`
- [ ] Full keyboard navigation

### Settings
- [ ] `<section aria-label="Settings">`
- [ ] Switches: `role="switch"`, `aria-checked`, `aria-label`
- [ ] Disabled switches: `aria-disabled="true"` + explanation
- [ ] Keyboard: Tab to switch, Enter/Space to toggle

### Support
- [ ] `<section aria-label="Support">`
- [ ] Ticket list: table or list with `aria-label`
- [ ] New ticket modal: ARIA dialog, focus trapped, Esc closes
- [ ] Reply form: `aria-label="Reply to ticket"`
- [ ] Message thread: `aria-live="polite"` for new messages

### Activity Timeline
- [ ] `<section aria-label="Activity Timeline">`
- [ ] Timeline: semantic `<ol>`
- [ ] Each item: `aria-label="[Action] at [timestamp]"`
- [ ] Icons: `aria-hidden="true"`

### Security Center
- [ ] `<section aria-label="Security Center">`
- [ ] Password fields: `aria-label` + show/hide toggle
- [ ] Strength meter: `aria-label="Password strength: [level]"`
- [ ] Revoke button: `aria-label="Revoke session on [device]"`
- [ ] Error text: `aria-live="polite"`

## Testing

- Axe DevTools: run on every dashboard page
- Keyboard-only walkthrough: navigate entire dashboard without mouse
- Screen reader (NVDA/VoiceOver): verify all content announced correctly
- Focus order: logical Tab order through all interactive elements
- Contrast: verify all text meets WCAG AA
