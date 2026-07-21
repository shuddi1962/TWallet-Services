# 12 — Security

> Component ID: LP-011 | Status: Approved
> 6 security cards in a 3x2 grid building customer trust through platform security explanation.

## Purpose

Build customer trust by explaining platform security. Address the #1 concern of crypto users: "Is my money safe?"

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-bg` (#F8FAFC) |
| Section heading | "Security First" (`--text-section`, 700, `--color-heading`) |
| Subtext | "Your keys. Your crypto. Your control." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## Layout

3x2 grid (6 cards):
- Desktop (1024+): 3 columns, 2 rows
- Tablet (768–1023): 2 columns, 3 rows
- Mobile (320–767): 1 column, 6 rows (stacked)

## Security Cards (6)

| # | Icon | Title | Description |
|---|------|-------|-------------|
| 1 | Shield | Wallet Security | Your wallet remains under your control. |
| 2 | Lock | Encrypted Connections | All communications use HTTPS and modern encryption. |
| 3 | CheckCircle | Blockchain Verification | Payments are independently verified on-chain. |
| 4 | Fingerprint | Privacy Protection | We never request or store recovery phrases or private keys. |
| 5 | Server | Fraud Protection | Multiple validation checks before confirming payments. |
| 6 | MailCheck | Account Protection | Email verification and secure authentication. |

## Card Style

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` |
| Radius | `--radius-card` (20px) |
| Shadow (resting) | `--shadow-sm` |
| Shadow (hover) | `--shadow-md` |
| Padding | `--space-6` (24px) |
| Content | Icon (top) + Title (h3) + Description (body) |

### Icon Style
- Size: 48px (Lucide outline)
- Container: 64px circle, `--color-primary-light` bg, `--color-primary` icon
- Icons: Shield, Lock, CheckCircle, Fingerprint, Server, MailCheck

## Trust Statement (Below Grid)

- **Text:** "We never ask for your recovery phrase or private keys."
- **Style:** 18px, 600, `--color-heading`, centered, with ShieldCheck icon (primary, 24px)
- **Purpose:** Reinforce the #1 non-negotiable rule

## CTA

- "Learn More" link → `/security` (secondary button, centered below trust statement)

## Component Tree

```
Security (RSC)
├── SectionHeader
│   ├── Heading ("Security First")
│   └── Subtext ("Your keys. Your crypto. Your control.")
├── SecurityGrid (3 columns / 2 / 1)
│   ├── SecurityCard (Shield, "Wallet Security", "Your wallet remains under your control.")
│   ├── SecurityCard (Lock, "Encrypted Connections", "All communications use HTTPS...")
│   ├── SecurityCard (CheckCircle, "Blockchain Verification", "Payments are independently verified on-chain.")
│   ├── SecurityCard (Fingerprint, "Privacy Protection", "We never request or store recovery phrases...")
│   ├── SecurityCard (Server, "Fraud Protection", "Multiple validation checks before confirming payments.")
│   └── SecurityCard (MailCheck, "Account Protection", "Email verification and secure authentication.")
├── TrustStatement (ShieldCheck + "We never ask for your recovery phrase or private keys.")
└── LinkButton ("Learn More" → /security)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Security cards | 300ms (stagger 100ms, max 6) | Scroll into view |
| Scale-in | Icon circles | 200ms (100ms delay) | Card in view |
| Hover lift | Cards | 150ms | Mouse enter (translateY -2px) |
| Fade-in | Trust statement | 300ms | After cards (200ms delay) |

### prefers-reduced-motion
- Disable: all slide, scale, hover animations
- Show: cards instantly in grid; trust statement visible

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Security">` |
| Icons | `aria-hidden="true"` (decorative; title conveys meaning) |
| Card titles | `<h3>` |
| Trust statement | `aria-label="We never ask for your recovery phrase or private keys"` |
| "Learn More" | `aria-label="Learn more about our security practices"` |
| Grid | CSS grid, responsive |
