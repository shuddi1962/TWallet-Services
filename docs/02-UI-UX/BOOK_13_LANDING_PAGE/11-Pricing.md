# 11 — Pricing

> Component ID: LP-010 | Status: Approved
> Two pricing cards comparing Virtual and Physical TWallet Card options.

## Purpose

Provide a simple comparison between available card plans. The goal is to help customers quickly understand the available options without overwhelming them.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Section heading | "Choose Your TWallet Card" (`--text-section`, 700, `--color-heading`) |
| Subtitle | "Choose the card that best fits your digital lifestyle." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## Layout

| Breakpoint | Layout |
|------------|--------|
| Desktop (1024+) | 2 pricing cards side by side |
| Tablet (768–1023) | 2 cards side by side |
| Mobile (320–767) | Stacked (1 column) |

## Card 1 — Virtual Card

| Element | Value |
|---------|-------|
| Badge | "Most Popular" (primary pill badge, top center) |
| Card type | "Virtual Card" (h3, 24px, 600, `--color-heading`) |
| Price | "$25 USDC" (48px, 700, `--color-heading`, tabular-nums) |
| Period | "One-time payment" (14px, `--color-muted`) |
| Features | See below |
| CTA | "Order Virtual Card" → `/auth/register` (primary button, `lg`, full width) |

### Virtual Card Features
- ✓ Instant Delivery
- ✓ Crypto Payments
- ✓ Dashboard Access
- ✓ Multi-Network Support
- ✓ Secure Wallet Connection

## Card 2 — Physical Card

| Element | Value |
|---------|-------|
| Badge | "Premium" (info pill badge, top center) |
| Card type | "Physical Card" (h3, 24px, 600) |
| Price | "$50 USDC" (48px, 700) |
| Period | "One-time payment + shipping" (14px, `--color-muted`) |
| Features | See below |
| CTA | "Order Physical Card" → `/auth/register` (secondary button, `lg`, full width) |

### Physical Card Features
- ✓ Premium Physical Card
- ✓ Worldwide Shipping
- ✓ Crypto Payments
- ✓ Dashboard Access
- ✓ Order Tracking
- ✓ Premium Design

## Card Design

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` |
| Radius | 24px (per user spec) |
| Shadow (resting) | `--shadow-md` |
| Shadow (hover) | `--shadow-lg` |
| Padding | `--space-8` (32px) |
| Width | Equal (flex: 1 or grid 1fr 1fr) |
| Max width | 480px each |
| Hover effect | translateY(-4px) + `--shadow-lg` (150ms) |
| Blue accent | Primary color on badge, checkmarks, CTA |

### Feature List Style
- Each item: check icon (Lucide Check, 18px, `--color-primary`) + text (14px, `--color-body`)
- List: `<ul>` with `<li>`, `--space-3` (12px) gap
- Checkmarks in primary blue

## Below Cards

- "Compare Cards" link → `/cards` (ghost link, centered)
- "View Full Pricing" link → `/pricing` (secondary button, centered)

## Future Cards (Not Displayed in MVP)

| Card | Version |
|------|---------|
| Business Card | v2 |
| Metal Card | v2 |
| Premium Membership | v2 |

## Component Tree

```
Pricing (RSC)
├── SectionHeader
│   ├── Heading ("Choose Your TWallet Card")
│   └── Subtitle ("Choose the card that best fits your digital lifestyle.")
├── PricingGrid (2 columns / stacked)
│   ├── PricingCard (Virtual)
│   │   ├── Badge ("Most Popular")
│   │   ├── CardTitle ("Virtual Card")
│   │   ├── Price ("$25 USDC")
│   │   ├── Period ("One-time payment")
│   │   ├── FeatureList
│   │   │   ├── FeatureItem (Check + "Instant Delivery")
│   │   │   ├── FeatureItem (Check + "Crypto Payments")
│   │   │   ├── FeatureItem (Check + "Dashboard Access")
│   │   │   ├── FeatureItem (Check + "Multi-Network Support")
│   │   │   └── FeatureItem (Check + "Secure Wallet Connection")
│   │   └── Button ("Order Virtual Card" → /auth/register)
│   └── PricingCard (Physical)
│       ├── Badge ("Premium")
│       ├── CardTitle ("Physical Card")
│       ├── Price ("$50 USDC")
│       ├── Period ("One-time payment + shipping")
│       ├── FeatureList
│       │   ├── FeatureItem (Check + "Premium Physical Card")
│       │   ├── FeatureItem (Check + "Worldwide Shipping")
│       │   ├── FeatureItem (Check + "Crypto Payments")
│       │   ├── FeatureItem (Check + "Dashboard Access")
│       │   ├── FeatureItem (Check + "Order Tracking")
│       │   └── FeatureItem (Check + "Premium Design")
│       └── Button ("Order Physical Card" → /auth/register)
└── Links
    ├── Link ("Compare Cards" → /cards)
    └── Link ("View Full Pricing" → /pricing)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Pricing cards | 300ms (stagger 150ms) | Scroll into view |
| Hover lift | Cards | 150ms | Mouse enter |
| "Most Popular" pulse | Badge | 2s infinite (scale 1→1.05→1) | After load (optional) |

### prefers-reduced-motion
- Disable: hover lift, badge pulse
- Keep: simple fade-in (or disable)

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Pricing">` |
| Price | `aria-label="25 USDC one-time payment"` |
| Feature lists | `<ul>` with `<li>` |
| CTAs | `aria-label="Order Virtual Card"` / `"Order Physical Card"` |
| Badge | `aria-label="Most Popular"` / `"Premium"` |

## Database

- `card_products` — fetch price and features (Book 08 §6.1)

## Supabase Query

```ts
const { data: products } = await supabase
  .from('card_products')
  .select('*')
  .eq('is_active', true)
  .is('deleted_at', null)
  .order('type');
```
