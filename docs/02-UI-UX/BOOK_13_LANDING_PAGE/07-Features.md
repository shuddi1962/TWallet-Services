# 07 — Features

> Component ID: LP-006 | Status: Approved
> 3x2 feature grid explaining why customers should choose TWallet Services.

## Purpose

Explain why customers should choose TWallet Services. Highlight the platform's key differentiators and benefits in a scannable grid.

## Layout

| Breakpoint | Layout | Cards Per Row |
|------------|--------|---------------|
| Desktop (1024+) | 3 columns, 2 rows | 3 |
| Tablet (768–1023) | 2 columns, 3 rows | 2 |
| Mobile (320–767) | 1 column, 6 rows | 1 |

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Section heading | "Why Choose TWallet" (`--text-section`, 700, `--color-heading`) |
| Subtext | "Premium crypto card platform built for trust and speed." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max` (1280px), centered |

## Feature Cards (6)

### 1. Secure Wallet Connection
- **Icon:** ShieldCheck (Lucide, 48px, `--color-primary`)
- **Title:** "Secure Wallet Connection" (h3, 18px, 600, `--color-heading`)
- **Description:** "Connect your wallet safely without exposing private keys." (14px, `--color-body`)

### 2. Multi-Chain Support
- **Icon:** Network (Lucide, 48px)
- **Title:** "Multi-Chain Support"
- **Description:** "Compatible with Ethereum, Polygon, BNB Chain, Arbitrum, Base, and more."

### 3. Fast Order Processing
- **Icon:** Zap (Lucide, 48px)
- **Title:** "Fast Order Processing"
- **Description:** "Card requests are processed quickly with transparent status updates."

### 4. Crypto Payments
- **Icon:** Coins (Lucide, 48px)
- **Title:** "Crypto Payments"
- **Description:** "Pay securely using supported cryptocurrencies."

### 5. Real-Time Dashboard
- **Icon:** LayoutDashboard (Lucide, 48px)
- **Title:** "Real-Time Dashboard"
- **Description:** "Monitor orders, wallet status, and transactions in one place."

### 6. Enterprise Security
- **Icon:** Lock (Lucide, 48px)
- **Title:** "Enterprise Security"
- **Description:** "Built with secure authentication, encrypted communication, and blockchain verification."

## Card Style

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` |
| Radius | `--radius-card` (20px) — per user spec: 24px |
| Shadow (resting) | `--shadow-md` (soft shadow) |
| Shadow (hover) | `--shadow-lg` |
| Padding | `--space-6` (24px) |
| Icon container | Circle, 64px, `--color-primary-light` bg, `--color-primary` icon |
| Icon size | 48px (Lucide outline) |
| Hover effect | translateY(-4px) + `--shadow-lg` (lift animation) |

## Component Tree

```
Features (RSC)
├── SectionHeader
│   ├── Heading ("Why Choose TWallet")
│   └── Subtext ("Premium crypto card platform built for trust and speed.")
└── FeatureGrid (3 columns / 2 / 1)
    ├── FeatureCard (ShieldCheck, "Secure Wallet Connection", "Connect your wallet safely...")
    ├── FeatureCard (Network, "Multi-Chain Support", "Compatible with Ethereum, Polygon...")
    ├── FeatureCard (Zap, "Fast Order Processing", "Card requests are processed quickly...")
    ├── FeatureCard (Coins, "Crypto Payments", "Pay securely using supported cryptocurrencies.")
    ├── FeatureCard (LayoutDashboard, "Real-Time Dashboard", "Monitor orders, wallet status...")
    └── FeatureCard (Lock, "Enterprise Security", "Built with secure authentication...")
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-up + slide | Feature cards | 300ms easeOut | Scroll into view (stagger 100ms, max 6) |
| Scale-in | Icon circles | 200ms (100ms delay) | Card in view |
| Hover lift | Feature cards | 150ms | Mouse enter (translateY -4px) |
| Hover scale | Icon | 200ms | Mouse enter (scale 1.1) |
| Shadow transition | Cards | 150ms | Mouse enter |

### prefers-reduced-motion
- Disable: fade-up, scale-in, hover lift
- Keep: simple fade (or disable entirely)
- Cards show instantly in grid

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Features">` |
| Icons | `aria-hidden="true"` (decorative; title conveys meaning) |
| Feature titles | `<h3>` (heading hierarchy: h2 section → h3 card) |
| Grid | CSS grid (responsive auto-fit) |
| Card hover | Also triggers on focus for keyboard users |
| Focus ring | `:focus-visible` on card if card is interactive |

## Acceptance Criteria

- ✓ Six feature cards displayed
- ✓ Responsive (3 → 2 → 1 columns)
- ✓ Accessible (ARIA, keyboard, semantic HTML)
- ✓ Smooth animations with reduced-motion support
- ✓ Blue icons (primary color) in all cards
- ✓ Hover lift effect on all cards
