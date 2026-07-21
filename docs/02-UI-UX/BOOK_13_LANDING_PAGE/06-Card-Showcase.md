# 06 — Card Showcase

> Component ID: LP-004 | Status: Approved
> Large premium 3D card display with front/back rotation, light reflection, and color variants.

## Purpose
Display the flagship TWallet Card. Let visitors see the actual product with a premium 3D presentation that feels real and desirable.

## Design Philosophy
- **Premium:** Comparable to Apple Card and Revolut card presentations
- **Minimal:** No clutter; the card is the hero
- **Realistic:** CSS-only 3D with gradients, shadows, and layered effects
- **NO stock illustrations:** Build the card entirely in CSS with gradients and shadows

## Section Specs
- **Background:** `--color-bg` (#F8FAFC)
- **Section heading:** "Your Crypto Card, Reimagined" (`--text-section`, 700)
- **Subtext:** "Premium design. Crypto-funded. Non-custodial." (`--text-body`, `--color-body`)
- **Layout:** Centered card display
- **Padding:** `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile

## Card Design (CSS-Only — No Images)

### Card Size
- Desktop: 420x264px (standard card ratio 1.586:1)
- Mobile: 320x200px

### Card Visual Elements
| Element | Position | Style |
|---------|----------|-------|
| Background | Full card | Gradient (see color variants below) |
| TWallet Logo | Top-left | White, 24px, SVG |
| Chip | Top-right area | Gold gradient (#FFD700 → #DAA520), rounded rect, 40x30px |
| NFC Symbol | Next to chip | White, 16px, wave icon |
| Customer Name | Bottom-left | White/40%, monospace, 14px, "YOUR NAME" |
| Expiry Date | Bottom-left (below name) | White/40%, monospace, 12px, "12/30" |
| Card Number | Center | White/30%, monospace, 18px, "•••• •••• •••• ••••" |
| Mastercard/Visa | Bottom-right | White circles (placeholder), 32px |
| Background Pattern | Full card | Subtle geometric pattern (CSS gradient), 5% opacity |
| Metallic Edge | Card border | 1px gradient border (white/20% to white/5%) |
| Glass Finish | Full card | `backdrop-filter: blur(2px)` + subtle white/5% overlay |

### Card Color Variants

| Variant | Background Gradient | Edge Color | Availability |
|---------|---------------------|------------|--------------|
| Midnight Black | Linear(135deg, #1a1a2e → #0a0a1a) | white/15% | Default (Physical) |
| Royal Blue | Linear(135deg, #2563EB → #1D4ED8) | white/20% | Virtual |
| Silver | Linear(135deg, #C0C0C0 → #808080) | white/40% | Future |
| Future Themes | TBD | TBD | Post-MVP |

### 3D Rotation
- **Desktop:** Card rotates Y-axis on hover (0deg → 180deg, 600ms, easeInOut)
- **Mobile:** Card flips on tap (Enter/Space for keyboard)
- **Perspective:** `perspective(1000px)` on container
- **Transform:** `rotateY(0deg)` front-facing, `rotateY(180deg)` back-facing
- **Backface-visibility:** `hidden` on front and back faces

### Card Back (When Rotated)
| Element | Position | Style |
|---------|----------|-------|
| Magnetic strip | Top | Black bar, 100% width, 40px height |
| Signature line | Middle | White strip, 60% width, 30px height |
| CVV | Middle-right | White/40%, monospace, 12px, "•••" |
| TWallet Logo | Bottom-left | White/30%, 20px |

### Light Reflection
- Subtle gradient overlay that moves with rotation
- Simulates light hitting the card surface
- **Implementation:**
```css
.card-reflection {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  pointer-events: none;
}
/* Animate position based on rotation degree */
```

### Shadow
- `--shadow-2xl` beneath card
- Shadow softens and spreads slightly when card is hovered/rotated

## Interaction

| Action | Desktop | Mobile |
|--------|---------|--------|
| Hover/tap card | Rotate to back (180deg, 600ms) | Tap to flip |
| Leave hover | Rotate back to front (600ms) | Tap again to flip back |
| Keyboard focus | Enter/Space to flip | Enter/Space to flip |
| Variant toggle | Click variant pill | Click variant pill |

### Card Variant Toggle
- Pills below card: "Midnight Black" | "Royal Blue" | "Silver" (future)
- Active: `--color-primary` bg, white text
- Inactive: `--color-surface` bg, `--color-body` text, `--color-border` border
- On toggle: card gradient swaps (fade 200ms)

## Below Card

| Element | Style |
|--------|-------|
| Price | "$50 USDC" (Physical) / "$25 USDC" (Virtual) — monospace, 24px, `--color-heading` |
| CTA | "Order Now" → `/auth/register` (or `/app/order` if authed) — primary button, `lg` |
| Compare link | "Compare Cards" → `/cards` — ghost link |

## Component Tree
```
CardShowcase (Client Component — 3D rotation, variant toggle)
├── SectionHeader
│   ├── Heading ("Your Crypto Card, Reimagined")
│   └── Subtext ("Premium design. Crypto-funded. Non-custodial.")
├── Card3DContainer (perspective: 1000px)
│   └── Card3D (rotateY on hover/tap)
│       ├── CardFront
│       │   ├── CardBackground (gradient per variant)
│       │   ├── CardPattern (subtle geometric)
│       │   ├── CardLogo (TWallet, top-left)
│       │   ├── CardChip (gold gradient, top-right)
│       │   ├── CardNFC (wave icon, next to chip)
│       │   ├── CardNumber ("•••• •••• •••• ••••")
│       │   ├── CardName ("YOUR NAME")
│       │   ├── CardExpiry ("12/30")
│       │   ├── CardBrand (Mastercard/Visa placeholder)
│       │   ├── CardEdge (metallic border)
│       │   └── CardReflection (light gradient overlay)
│       └── CardBack
│           ├── MagneticStrip (black bar)
│           ├── SignatureLine (white strip)
│           ├── CVV ("•••")
│           └── CardLogo (small, white/30%)
├── CardShadow (shadow-2xl beneath)
├── VariantToggle
│   ├── VariantPill ("Midnight Black" — active)
│   ├── VariantPill ("Royal Blue")
│   └── VariantPill ("Silver" — future/disabled)
└── CardActions
    ├── Price ("$50 USDC")
    ├── Button ("Order Now" → /auth/register)
    └── Link ("Compare Cards" → /cards)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Rotation (flip) | Card3D | 600ms easeInOut | Hover (desktop) / tap (mobile) |
| Light reflection | CardReflection | Synced with rotation | Rotation progress |
| Continuous float | Card3D | 4s infinite | When not hovering |
| Variant swap | Card gradient | 200ms fade | Variant pill click |
| Shadow spread | CardShadow | 600ms | During rotation |
| Section fade-in | Whole section | 300ms | Scroll into view |

### prefers-reduced-motion
- Disable: continuous float, rotation animation (show front; back accessible via button)
- Keep: variant swap (instant), section fade-in (or disable)

## Responsive

| Breakpoint | Card Size | Interaction | Variants |
|------------|-----------|-------------|----------|
| Desktop (1024+) | 420x264px | Hover to flip | All visible |
| Tablet (768+) | 380x240px | Tap to flip | All visible |
| Mobile (320+) | 320x200px | Tap to flip | Scrollable row |

## Accessibility
- `<section aria-label="Card Showcase">`
- Card: `role="button"` with `aria-label="TWallet Card — click to flip"` and `aria-pressed` for flip state
- Keyboard: Enter/Space to flip; focus ring on card
- Variant pills: `role="tablist"` with `role="tab"` per pill; `aria-selected` on active
- Card elements (chip, number, etc.): `aria-hidden="true"` (decorative)
- "Order Now" button: `aria-label="Order [variant name] card"`
- Price: `aria-label="Price: 50 USDC"`

## OpenCode Notes
- **Do NOT use stock images for the card.** Build it entirely with CSS gradients, shadows, and layered divs.
- Use `transform-style: preserve-3d` on the card container for proper 3D flipping.
- Use `backface-visibility: hidden` on front and back faces.
- The chip is a simple CSS gradient (gold) with a rounded rectangle — not an image.
- The background pattern can be a CSS `repeating-linear-gradient` or `radial-gradient` at very low opacity.
- The light reflection is a semi-transparent gradient that animates based on the rotation value.
