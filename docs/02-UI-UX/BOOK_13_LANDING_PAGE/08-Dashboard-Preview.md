# 08 — Dashboard Preview

> Component ID: LP-007 | Status: Approved
> Laptop mockup showing the customer dashboard. Visual proof of the premium experience.

## Purpose

Show users what they will gain after creating an account. Give them a visual preview of the dashboard before they register.

## Layout

### Desktop (1024+)
```
┌─────────────────────────────────────────────────────┐
│  Left (40%)                  Right (60%)             │
│                                                        │
│  Everything In One         ┌─────────────────────┐   │
│  Dashboard                  │                     │   │
│                             │   Laptop Mockup     │   │
│  Manage your wallet,        │   (Dashboard        │   │
│  track your card orders,    │    Screenshot)      │   │
│  monitor crypto payments,   │                     │   │
│  and receive updates from   │                     │   │
│  one secure dashboard.      └─────────────────────┘   │
│                                                        │
│  [Create Account]            ← Floating (subtle)     │
│                              ← Glow effect behind     │
└─────────────────────────────────────────────────────┘
```

### Mobile (320–767)
- Stack: Text → Mockup
- Mockup full-width

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-bg` (#F8FAFC) or gradient (primary-light/30% to bg) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## Left Side (Text)

| Element | Spec |
|---------|------|
| Heading | "Everything In One Dashboard" (`--text-section` 40px, 700, `--color-heading`) |
| Description | "Manage your wallet, track your card orders, monitor crypto payments, and receive updates from one secure dashboard." (`--text-body` 16px, `--color-body`, line-height 1.6) |
| CTA | "Create Account" — primary button, `lg` → `/auth/register` |

## Right Side (Laptop Mockup)

### Laptop Frame
- **Bezel:** Dark gray (#1a1a2e), `--radius-card` top corners, 12px border
- **Screen:** Dashboard screenshot/mockup (next/image or CSS-built)
- **Shadow:** `--shadow-2xl` beneath laptop
- **Size:** 600x400px (desktop), full-width (mobile)
- **Float:** subtle translateY 0→-8px→0, 4s infinite
- **Glow:** radial gradient behind laptop (primary at 10% opacity)

### Dashboard Preview Includes

| Element | Position in Mockup |
|---------|-------------------|
| Sidebar | Left: icons for Overview, Cards, Orders, Transactions, Wallet |
| Topbar | Top: user avatar + notifications bell + search |
| Wallet Balance | Stat card: balance + network badge |
| Card Overview | Stat card: card image + status |
| Recent Transactions | Table: date, type, amount, status |
| Order Timeline | Timeline: pending → paid → shipped |
| Analytics Cards | Row: revenue, orders, growth |
| Notifications | Bell with badge (unread count) |
| Profile Menu | Avatar dropdown (profile, settings, logout) |

### Below Mockup
- Feature pills (row of badges): "Wallet Management" · "Order Tracking" · "Transaction History" · "Real-time Updates"

## Component Tree

```
DashboardPreview (RSC + Client for parallax)
├── SectionContainer (2 columns desktop / stacked mobile)
│   ├── LeftSide
│   │   ├── Heading ("Everything In One Dashboard")
│   │   ├── Description ("Manage your wallet, track your card orders...")
│   │   ├── CTAButton ("Create Account" → /auth/register)
│   │   └── FeaturePills
│   │       ├── Pill ("Wallet Management")
│   │       ├── Pill ("Order Tracking")
│   │       ├── Pill ("Transaction History")
│   │       └── Pill ("Real-time Updates")
│   └── RightSide
│       ├── GlowBackground (radial gradient)
│       └── LaptopMockup
│           ├── LaptopFrame (bezel)
│           │   └── DashboardScreenshot (next/image or CSS-built)
│           ├── LaptopBase (hinge)
│           └── LaptopShadow (shadow-2xl)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Slide-in from left | Left text | 400ms easeOut | Scroll into view |
| Fade-in + scale(0.95→1) | Laptop mockup | 500ms easeOut (200ms delay) | Scroll into view |
| Continuous float | Laptop mockup | 4s infinite (translateY 0→-8px→0) | After load |
| Glow pulse | Background glow | 4s infinite (opacity 0.08→0.15→0.08) | After load |
| Parallax | Laptop mockup | Real-time | Mouse move (desktop, ±15px range) |
| Stagger fade-in | Feature pills | 100ms each | Scroll into view (300ms delay) |

### prefers-reduced-motion
- Disable: continuous float, glow pulse, parallax
- Keep: slide-in + fade (or disable if all motion reduced)
- Mockup shows static

## Responsive

| Breakpoint | Layout | Mockup Size | Parallax |
|------------|--------|-------------|----------|
| Desktop (1280+) | 2 columns (40/60) | 600x400px | Enabled |
| Laptop (1024+) | 2 columns (40/60) | 500x330px | Enabled |
| Tablet (768+) | Stack (text → mockup) | 90% width | Disabled |
| Mobile (320+) | Stack (text → mockup) | 100% width | Disabled |

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Dashboard Preview">` |
| Screenshot alt | `alt="TWallet customer dashboard — manage cards, wallets, transactions, and orders"` |
| CTA | `aria-label="Create your TWallet account"` |
| Feature pills | `aria-label` if icon-only; text is sufficient |
| Heading | `<h2>` "Everything In One Dashboard" |
| Color contrast | `--color-heading` on `--color-bg` = 12:1 (AAA) |

## Implementation Notes

- Use a high-quality dashboard mockup image (Figma export or actual screenshot)
- Image format: WebP/AVIF via `next/image` with responsive `sizes`
- For MVP: static image; post-MVP can be an interactive demo
- Glow: CSS `radial-gradient` positioned behind mockup, `filter: blur(60px)`
- Float: CSS animation (not Framer Motion) for continuous loop
- Parallax: throttle to 60fps; desktop only; disabled on touch devices
