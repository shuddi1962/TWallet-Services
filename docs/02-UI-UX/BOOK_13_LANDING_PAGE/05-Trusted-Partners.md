# 05 — Trusted Partners

> Component ID: LP-005 | Status: Approved
> Infinite horizontal logo carousel showing the technologies and blockchain ecosystems that power TWallet Services.

## Purpose

Display the technologies and blockchain ecosystems that power TWallet Services. This section builds trust and demonstrates compatibility with well-known Web3 infrastructure.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Section Title | "Powered By Trusted Technologies" (`--text-section` 40px, 700, `--color-heading`) |
| Subtitle | "Built on secure, reliable, and industry-leading Web3 infrastructure." (`--text-body`, `--color-body`) |
| Padding | `--space-12` (48px) vertical |
| Height | 120px (logos at 80px height, centered) |

## Logos (10)

| # | Partner | Category | Logo Format |
|---|---------|----------|-------------|
| 1 | WalletConnect | Wallet protocol | SVG |
| 2 | MetaMask | Wallet | SVG |
| 3 | Coinbase Wallet | Wallet | SVG |
| 4 | Ethereum | Blockchain | SVG |
| 5 | BNB Smart Chain | Blockchain | SVG |
| 6 | Polygon | Blockchain | SVG |
| 7 | Arbitrum | Blockchain | SVG |
| 8 | Base | Blockchain | SVG |
| 9 | Supabase | Backend | SVG |
| 10 | Vercel | Hosting | SVG |

## Display

- **Infinite horizontal logo carousel** — logos scroll continuously left to right
- **No abrupt jumps** — duplicate the logo set for seamless loop
- **Pause animation on hover** — `animation-play-state: paused` on hover
- **Edge mask** — gradient fade (transparent → white → transparent) on left and right edges

## Style

| Property | Value |
|----------|-------|
| Logo height | 80px (desktop) / 48px (mobile) |
| Logo width | Auto (maintain aspect ratio) |
| Gap between logos | `--space-12` (48px) |
| Default filter | `grayscale(100%)` + `opacity(0.6)` |
| Hover filter | `grayscale(0%)` + `opacity(1)` (full color) |
| Hover transition | 200ms easeOut |

## Animation

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  animation: marquee 30s linear infinite;
  display: flex;
  gap: 48px;
}

.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
```

- **Duration:** 30-second loop
- **Easing:** linear (constant speed)
- **Iteration:** infinite
- **Implementation:** CSS animation (not Framer Motion — more performant for infinite scroll)
- **Seamless loop:** Duplicate the 10-logo set (20 total in track); translateX from 0 to -50%

## Responsive

| Breakpoint | Logos Visible | Logo Height | Speed |
|------------|---------------|-------------|-------|
| Desktop (1280+) | ~10 | 80px | 30s |
| Laptop (1024+) | ~8 | 64px | 30s |
| Tablet (768+) | ~6 | 56px | 35s |
| Mobile (320+) | ~3 | 48px | 40s |

## Component Tree

```
TrustedPartners (Client Component — CSS marquee)
├── SectionHeader
│   ├── Heading ("Powered By Trusted Technologies")
│   └── Subtext ("Built on secure, reliable, and industry-leading...")
└── MarqueeContainer (overflow hidden, edge mask)
    └── MarqueeTrack (flex, infinite scroll)
        ├── LogoItem (WalletConnect)
        ├── LogoItem (MetaMask)
        ├── LogoItem (Coinbase Wallet)
        ├── LogoItem (Ethereum)
        ├── LogoItem (BNB Smart Chain)
        ├── LogoItem (Polygon)
        ├── LogoItem (Arbitrum)
        ├── LogoItem (Base)
        ├── LogoItem (Supabase)
        ├── LogoItem (Vercel)
        └── [Duplicate set of 10 for seamless loop]
```

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Trusted Partners">` |
| Logo alt text | `alt="WalletConnect logo"`, `alt="Ethereum logo"`, etc. |
| Decorative | `aria-hidden="true"` on the marquee container if purely decorative |
| Keyboard | Logos are not focusable (decorative); section is informational |
| Pause | Animation pauses on hover (desktop); no keyboard interaction needed |
| Reduced motion | Stop marquee; show static grid of logos instead (2 rows of 5) |

## Loading

- No skeleton needed (logos are small SVGs, load instantly)
- If logos not yet loaded: show empty space (no CLS — height is reserved)

## Implementation Notes

- Use official SVG logos from each project (check brand guidelines)
- Store logos in `/public/logos/` directory
- Fallback: if SVG not available, use PNG with transparent background
- Edge mask: `mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent)`
- On mobile: consider 2-row static grid instead of marquee if performance is a concern
