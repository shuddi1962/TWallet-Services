# 09 — Supported Networks

> Component ID: LP-008 | Status: Approved
> Grid of supported blockchain networks with hover effects and future network placeholders.

## Purpose

Show blockchain compatibility. Let users verify that their preferred network is supported before registering.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Section heading | "Pay on Your Favorite Network" (`--text-section`, 700) |
| Subtext | "7 EVM-compatible chains supported. More coming soon." (`--text-body`, `--color-body`) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## Networks (7 Supported + 3 Future)

### Supported (7)

| Network | Symbol | Chain ID | Logo Color | Logo |
|---------|--------|----------|------------|------|
| Ethereum | ETH | 1 | #627EEA | Ethereum logo (SVG) |
| BNB Smart Chain | BNB | 56 | #F0B90B | BNB logo (SVG) |
| Polygon | MATIC | 137 | #8247E5 | Polygon logo (SVG) |
| Arbitrum | ETH | 42161 | #28A0F0 | Arbitrum logo (SVG) |
| Optimism | ETH | 10 | #FF0420 | Optimism logo (SVG) |
| Base | ETH | 8453 | #0052FF | Base logo (SVG) |
| Avalanche | AVAX | 43114 | #E84142 | Avalanche logo (SVG) |

### Future (3 — displayed as "Coming Soon")

| Network | Symbol | Status |
|---------|--------|--------|
| Bitcoin | BTC | Coming Soon |
| Solana | SOL | Coming Soon |
| Tron | TRX | Coming Soon |

## Layout

| Breakpoint | Layout | Columns |
|------------|--------|---------|
| Desktop (1024+) | Grid | 4 columns |
| Tablet (768–1023) | Grid | 2 columns |
| Mobile (320–767) | Grid | 1 column (stacked) |

## Card Design

### Supported Network Card

| Property | Value |
|----------|-------|
| Size | 200x160px (desktop), full-width (mobile) |
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` |
| Radius | `--radius-card` (20px) |
| Shadow (resting) | `--shadow-sm` |
| Shadow (hover) | `--shadow-md` |
| Padding | `--space-6` (24px) |
| Content alignment | Center |

### Card Content
- **Network logo:** 48px, centered top
- **Network name:** 16px, 600, `--color-heading`, centered
- **Symbol:** 12px, `--color-muted`, centered
- **Status badge:** "Supported" — success badge (green), pill, 10px

### Future Network Card

| Property | Value |
|----------|-------|
| Border | 1px dashed `--color-border` |
| Background | `--color-bg` (#F8FAFC) |
| Opacity | 50% |
| Status badge | "Coming Soon" — muted badge (gray), pill, 10px |
| Logo | Grayscale, 40% opacity |
| Hover | No lift, no glow (non-interactive feel) |

## Hover Effects (Supported Cards Only)

| Effect | Implementation |
|--------|---------------|
| Glow border | `border-color: [network color]` + `box-shadow: 0 0 20px [network color at 20%]` |
| Lift | `translateY(-4px)` + `--shadow-md` (150ms) |
| Logo scale | `scale(1.1)` (200ms) |
| Logo color | Full color (remove any grayscale if applied) |

## Component Tree

```
SupportedNetworks (RSC + Client for hover)
├── SectionHeader
│   ├── Heading ("Pay on Your Favorite Network")
│   └── Subtext ("7 EVM-compatible chains supported. More coming soon.")
├── NetworkGrid (4 columns / 2 / 1)
│   ├── NetworkCard (Ethereum, "ETH", "Supported")
│   ├── NetworkCard (BNB Smart Chain, "BNB", "Supported")
│   ├── NetworkCard (Polygon, "MATIC", "Supported")
│   ├── NetworkCard (Arbitrum, "ETH", "Supported")
│   ├── NetworkCard (Optimism, "ETH", "Supported")
│   ├── NetworkCard (Base, "ETH", "Supported")
│   ├── NetworkCard (Avalanche, "AVAX", "Supported")
│   ├── FutureCard (Bitcoin, "BTC", "Coming Soon")
│   ├── FutureCard (Solana, "SOL", "Coming Soon")
│   └── FutureCard (Tron, "TRX", "Coming Soon")
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Cards | 300ms (stagger 80ms, max 10) | Scroll into view |
| Icon scale-in | Logos | 200ms (100ms delay) | Card in view |
| Hover lift | Supported cards | 150ms | Mouse enter |
| Hover glow | Supported cards | 200ms | Mouse enter |
| Logo hover scale | Logos | 200ms | Mouse enter |

### prefers-reduced-motion
- Disable: hover lift, logo scale, all slide animations
- Keep: simple fade (or disable)
- Cards show instantly in grid

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Supported Networks">` |
| Card label | `aria-label="[Network name] — Supported"` |
| Future card label | `aria-label="[Network name] — Coming Soon"` |
| Logos | `alt="[Network name] logo"` + `aria-hidden="true"` (name visible as text) |
| Status badge | Text + icon (not color alone): "Supported" with check icon |
| Grid | CSS grid, responsive |

## Database

- `supported_networks` — fetch active networks (Book 08 §7.1)

## Supabase Query

```ts
const { data: networks } = await supabase
  .from('supported_networks')
  .select('name, symbol, chain_id, logo, explorer_url')
  .eq('is_active', true)
  .order('name');
```

## Implementation Notes

- Store network logos in `/public/networks/` directory (SVG format)
- Use official brand logos (check each project's brand guidelines)
- Future cards: use the same logo but grayscale + 40% opacity
- Network colors: used for hover glow border (match brand color)
- Grid: CSS grid with `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` for responsive
