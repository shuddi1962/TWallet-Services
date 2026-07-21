# 01 — Hero Section

> Component ID: LP-001 | Status: Approved | Priority: Critical
> The first impression. 100vh dark navy section with 3D card, floating elements, glass stat cards, and mouse parallax.

## Purpose

The Hero Section is the first impression users have of TWallet Services. Its primary goal is to immediately establish trust, communicate the value proposition, and encourage users to create an account or explore the available card products.

The design should feel premium, modern, and comparable to leading fintech platforms (Stripe, Coinbase, Revolut, Wise, Apple).

## User Goals

- Understand what TWallet Services offers
- See the flagship TWallet Card
- Start registration
- Explore available cards
- Build confidence in the platform

## Layout

### Desktop (1280px+)
```
┌─────────────────────────────────────────────────────────┐
│  Left Side (45%)              Right Side (55%)           │
│                                                              │
│  [NEW — Trusted Web3         ┌──────────────┐             │
│   Payment Platform] badge    │              │             │
│                              │  Premium 3D  │             │
│  Modern Crypto Cards          │  TWallet     │  ← Mouse    │
│  For The Next Generation.    │  Card        │    Parallax │
│                              │              │             │
│  Connect your wallet...      └──────────────┘             │
│                               ⬡ ETH  ⬡ USDT               │
│  [Get Started] [Explore      ⬡ BNB  ⬡ POLYGON             │
│   Cards]                      ⬡ WalletConnect              │
│                               ┌────┐ ┌────┐               │
│  ✔ Secure Wallet Connection  │Stat│ │Stat│  ← Glass       │
│  ✔ Crypto Payments           │Card│ │Card│    Cards       │
│  ✔ Global Availability       └────┘ └────┘               │
│  ✔ Enterprise Security         Soft Glow (radial)          │
└─────────────────────────────────────────────────────────┘
```

### Tablet (768–1023px)
- Stack: Text → Card → Buttons
- Card centered, 80% width

### Mobile (320–767px)
- Stack: Text → Buttons → Card (static front only)
- Buttons full-width
- Floating elements hidden (performance)
- Glass stat cards: 2x2 grid

## Section Height
- Desktop: 100vh
- Tablet: auto (min-height 80vh)
- Mobile: auto (min-height 90vh — not 100vh to avoid URL bar issues)

## Background
- **Base:** Dark navy (`--color-hero` #020817)
- **Gradient:** Subtle radial gradient from #020817 (top) to #0a0a1a (bottom)
- **Noise texture:** SVG noise overlay at 3% opacity (fractalNoise filter) — adds premium film grain
- **Soft glow:** Radial gradient behind card area (primary #2563EB at 15-25% opacity, pulsing)

## Content

### Badge
- Text: "NEW — Trusted Web3 Payment Platform"
- Style: pill badge, white/10% bg, white text, primary border, 12px, 600
- Animation: fade-in + slide-down (300ms, on load, first element)

### Heading
- Text: "Modern Crypto Cards For The Next Generation."
- Style: `--text-hero` (clamp 2.5rem–4rem), white, 700, line-height 1.05
- "The Next Generation." can be styled with a gradient text (primary to primary-light) for emphasis

### Subtitle
- Text: "Connect your wallet securely, order premium virtual or physical cards, pay with cryptocurrency, and manage everything from one beautiful dashboard."
- Style: `--text-hero-sub` (22px), #E2E8F0, 400, line-height 1.5

### CTA Buttons
| Button | Text | Style | Route |
|--------|------|-------|-------|
| Primary | Get Started | Button primary, `lg`, white bg + primary text | `/auth/register` |
| Secondary | Explore Cards | Button ghost, white border + white text, `lg` | `/cards` |

- Layout: inline row on desktop, stacked full-width on mobile
- Animation: fade-in (300ms, 200ms delay)

### Trust Indicators
| Indicator | Icon |
|-----------|------|
| Secure Wallet Connection | ShieldCheck |
| Crypto Payments | Coins |
| Global Availability | Globe |
| Enterprise Security | Lock |

- Layout: 2x2 grid on desktop (left side), inline row on tablet, 2x2 on mobile
- Style: check icon (primary, 16px) + text (14px, white/70%)
- Animation: stagger fade-in (100ms each, 400ms start)

## Right Section (Desktop Only)

### Premium 3D Card
- **Size:** 380x240px
- **Perspective:** `perspective(1000px)` on container
- **Rotation:** `rotateY(-8deg) rotateX(4deg)` — slight 3D tilt
- **Shadow:** `--shadow-2xl`
- **Design:** CSS gradients + shadows (NOT stock illustration)
  - Dark gradient (navy to black) with subtle primary glow on edges
  - TWallet logo (white, centered or top-left)
  - Cardholder name placeholder (white/40%, monospace)
  - Card number dots (•••• •••• •••• ••••)
  - Mastercard/Visa placeholder (bottom right)
- **Animation:** float (translateY 0→-8px→0, 4s infinite), mouse parallax (±5deg based on mouse position)

### Floating Dashboard (Glass)
- 2 small glass cards floating at card edges
- Glass effect: white/5% bg, white/10% border, backdrop-blur(12px)
- Content: mini stat (e.g., "Orders: 1,247" or "Verified: ✓")
- Position: top-right and bottom-left of card area
- Animation: float (staggered, 3s and 4s offsets)

### Floating Coins / Token Icons
| Token | Position | Size | Float Duration |
|-------|----------|------|----------------|
| Ethereum (ETH) | Top-right of card | 32px | 3s |
| USDT | Right of card | 28px | 3.5s |
| BNB | Bottom-right | 30px | 4s |
| Polygon (MATIC) | Left of card | 26px | 3.2s |
| WalletConnect | Top-left | 28px | 4.5s |

- Style: token logo (SVG/PNG), subtle glow behind each
- Animation: continuous float (translateY 0→-12px→0), staggered start times
- Mouse parallax: tokens move slightly based on mouse position (±10px range, opposite direction of card)

### Soft Glow
- Radial gradient behind card: primary #2563EB at 15-25% opacity
- Size: 600x600px, blurred
- Animation: subtle pulse (opacity 0.15→0.25→0.15, 4s infinite)
- Purpose: draws eye to the card, adds depth

## Animations (Complete List)

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Heading | 300ms | On load |
| Fade-in + slide-up | Subtitle | 300ms (100ms delay) | On load |
| Fade-in | CTAs | 300ms (200ms delay) | On load |
| Fade-in + scale(0.9→1) + rotateY | 3D Card | 600ms (300ms delay) | On load |
| Continuous float | 3D Card | 4s infinite | After load |
| Continuous float | Token icons | 3-4.5s infinite (staggered) | After load |
| Continuous float | Glass stat cards | 3s/4s infinite | After load |
| Glow pulse | Radial glow | 4s infinite | After load |
| Mouse parallax | Card + tokens + glass cards | Real-time | Mouse move (desktop) |
| Stagger fade-in | Trust indicators | 100ms each | On load (400ms start) |
| Stagger fade-in | Glass stat cards | 100ms each | On load (500ms start) |

### Mouse Parallax Implementation
```tsx
// Track mouse position relative to hero center
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  setMousePos({
    x: (e.clientX - centerX) / centerX,  // -1 to 1
    y: (e.clientY - centerY) / centerY,
  });
};

// Apply to card: rotateY(-8deg + mousePos.x * 5deg) rotateX(4deg - mousePos.y * 5deg)
// Apply to tokens: translate(mousePos.x * 10px, mousePos.y * 10px) — opposite direction
```

### prefers-reduced-motion
- Disable: float, glow pulse, mouse parallax, card rotation
- Keep: simple fade-in (or disable entirely)
- Show: static card with front facing, tokens in fixed positions

## Responsive Rules

| Breakpoint | Layout | Card | Floating Elements | Glass Cards |
|------------|--------|------|-------------------|-------------|
| Desktop (1280+) | 2 columns (45/55) | 3D with rotation | All visible | Visible |
| Laptop (1024+) | 2 columns (45/55) | 3D with rotation | All visible | Visible |
| Tablet (768+) | Stack (text → card → buttons) | Static front, tap to flip | Hidden | 2x2 below |
| Mobile (320+) | Stack (text → buttons → card) | Static front only | Hidden | 2x2 grid below |

## Performance

| Concern | Mitigation |
|---------|-----------|
| 3D transforms | Use `will-change: transform` on card |
| Mouse parallax | Throttle to 60fps; disable on mobile and reduced-motion |
| Floating animations | CSS animations (not Framer Motion) for continuous loops |
| Token images | SVG format (tiny file size) |
| Noise texture | SVG data URI (no external request) |
| Glass blur | `backdrop-filter: blur(12px)` — GPU accelerated |

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Heading | `<h1>` — only one on page: "Modern Crypto Cards For The Next Generation." |
| CTAs | `aria-label="Get Started — Create your TWallet account"` |
| 3D Card | `alt="TWallet Card — premium crypto-funded card"` if image; `aria-hidden="true"` if CSS-only decorative |
| Trust indicators | `aria-label` with full text: "Secure Wallet Connection" |
| Glass stat cards | `aria-label="10K Active Users"` etc. |
| Floating tokens | `aria-hidden="true"` (decorative) |
| Color contrast | White on #020817 = 18:1 (AAA) |
| Keyboard | All CTAs keyboard focusable; card flip via Enter/Space on mobile |

## Loading State
- Skeleton: dark navy block with shimmer placeholder for 3D card and glass cards
- No layout shift (CLS = 0): reserve space for all elements

## OpenCode Notes

- **Do NOT use stock illustrations.** Create a premium 3D-inspired card using CSS gradients, shadows, and layered effects.
- Avoid excessive animations. Keep interactions smooth and professional.
- Use CSS for continuous animations (float, glow) — more performant than JS.
- Mouse parallax: desktop only; disabled on touch devices and reduced-motion.
- Noise texture: SVG fractalNoise data URI (inline, no external request).
