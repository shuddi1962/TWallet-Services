# 10 — How It Works

> Component ID: LP-009 | Status: Approved
> 4-step process timeline explaining the ordering process.

## Purpose

Explain the ordering process in four simple steps. Demystify the journey from signup to card delivery. Show that getting a TWallet Card is simple, fast, and secure.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-bg` (#F8FAFC) |
| Section heading | "How TWallet Services Works" (`--text-section`, 700, `--color-heading`) |
| Subtext | "From signup to spending in four simple steps." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## 4 Steps

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | User | Create an Account | Register with your email and password in seconds. |
| 2 | Wallet | Connect Your Wallet | Link MetaMask, Coinbase Wallet, or Trust Wallet securely. |
| 3 | CreditCard | Choose Your Card | Select a premium virtual or physical TWallet Card. |
| 4 | Package | Pay with Crypto & Track Your Order | Pay with cryptocurrency and track your card every step of the way. |

## Layout

| Breakpoint | Layout | Description |
|------------|--------|-------------|
| Desktop (1024+) | Horizontal timeline | 4 steps in a row, connected by a line |
| Tablet (768–1023) | 2x2 grid | 4 steps in a 2x2 grid with connectors |
| Mobile (320–767) | Vertical timeline | 4 steps stacked, connected by a vertical line |

### Desktop Timeline Layout
```
[1]──────[2]──────[3]──────[4]
Create    Connect   Choose    Pay & Track
Account   Wallet    Card      Order
```

### Mobile Timeline Layout
```
[1]
 │
 │
[2]
 │
 │
[3]
 │
 │
[4]
```

## Step Design

| Property | Value |
|----------|-------|
| Circle | 64px, `--color-primary` bg, white number (24px, 700) |
| Icon | 28px, white, inside circle (above number) |
| Title | 18px, 600, `--color-heading` |
| Description | 14px, `--color-body`, max-width 200px |
| Spacing | `--space-8` (32px) between steps (desktop) |
| Connector line | 2px, `--color-border` (inactive), `--color-primary` (active/completed) |

## CTA

- **Button:** "Get Started" — primary, `lg`, centered below timeline
- **Route:** `/auth/register`
- **Aria-label:** "Get Started — Create your TWallet account"

## Component Tree

```
HowItWorks (RSC)
├── SectionHeader
│   ├── Heading ("How TWallet Services Works")
│   └── Subtext ("From signup to spending in four simple steps.")
├── StepTimeline
│   ├── Step (1, User, "Create an Account", "Register with your email...")
│   ├── Step (2, Wallet, "Connect Your Wallet", "Link MetaMask, Coinbase...")
│   ├── Step (3, CreditCard, "Choose Your Card", "Select a premium virtual...")
│   └── Step (4, Package, "Pay with Crypto & Track Your Order", "Pay with cryptocurrency...")
├── TimelineLine (connects steps; fills with primary on scroll)
└── CTAButton ("Get Started" → /auth/register)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Steps | 300ms easeOut | Scroll into view (stagger 150ms per step) |
| Scale-in | Step circles | 200ms | Step enters viewport |
| Progress line draw | Timeline connector | 400ms per segment | As each step appears |
| Number count-up | Step numbers (1-4) | 200ms each | Step enters viewport |
| Hover scale | Step circles | 200ms | Mouse enter (scale 1.1) |

### Progress Line Animation
- Line starts as `--color-border` (inactive)
- As each step scrolls into view, the line segment before it fills with `--color-primary`
- Desktop: line draws left-to-right
- Mobile: line draws top-to-bottom
- Implementation: Framer Motion `pathLength` or CSS `width`/`height` animation

### prefers-reduced-motion
- Disable: all slide, scale, line draw animations
- Show: all steps instantly with full line in `--color-primary`
- No count-up; show final numbers

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="How It Works">` |
| Timeline | Semantic `<ol>` (ordered list — order matters) |
| Each step | `<li>` with `aria-label="Step 1: Create an Account"` |
| Icons | `aria-hidden="true"` (decorative; number + title convey meaning) |
| Numbers | Visible (not color-only); 24px, 700 |
| CTA | `aria-label="Get Started — Create your account"` |
| Heading | `<h2>` "How TWallet Services Works" |
| Step titles | `<h3>` for structure |
| Keyboard | CTA keyboard focusable; steps are informational (not interactive) |

## Responsive Details

### Desktop (1024+)
- 4 columns, equal width
- Horizontal connector line between circles
- Line at circle center height
- CTA centered below

### Tablet (768–1023)
- 2x2 grid
- Horizontal connector in each row + vertical connector between rows
- CTA centered below

### Mobile (320–767)
- Single column, stacked
- Vertical connector line on the left (aligned with circle centers)
- Each step: circle (left) + text (right)
- CTA full-width below
