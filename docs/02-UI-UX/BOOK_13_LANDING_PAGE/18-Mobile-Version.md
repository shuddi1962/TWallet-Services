# 18 — Mobile Version

> Responsive specifications for all landing page sections at 320px–767px.

## Purpose
Ensure the landing page is fully functional and beautiful on mobile devices — the primary device for crypto users.

## Global Mobile Rules

| Rule | Spec |
|------|------|
| Container width | 100% with 16px horizontal padding |
| Section padding | `--space-16` (64px) vertical |
| Font sizes | Use clamp() values (hero: 40px, section: 28px) |
| Touch targets | Min 44x44px |
| Nav | Hamburger → full-width drawer |
| Images | `next/image` with responsive `sizes` attribute |
| Layout | Single column (stacked) unless noted |

## Section-by-Section Mobile Specs

### Announcement Bar
- Text: truncate if > 40 chars; "Beta is live →" as fallback
- Close button: 44x44px tap target
- Height: 44px

### Header
- Hamburger button (right, 44x44px)
- Logo (left, 32px height)
- No center nav links (hidden on mobile)
- Drawer: full-width, slide-in from right, white bg
  - Nav links: stacked, full-width, 56px height each
  - Login: ghost link, full-width
  - Register: primary button, full-width
  - Close: X at top-right
  - Esc to close; tap outside to close

### Hero
- Height: auto (min-height 90vh) — not 100vh on mobile (avoid URL bar issues)
- Layout: stacked — content top, 3D card below (if shown)
- 3D Card: show static front (no rotation on mobile — use tap to flip)
- Floating coins: hide on mobile (performance + clutter)
- Glass stat cards: 2x2 grid
- CTAs: full-width, stacked
- Trust indicators: wrap, 12px gap

### Statistics
- 2x2 grid
- Stat cards: full width of grid cell
- Numbers: 24px (not 32px)

### Trusted Partners
- Marquee: slower speed (40s instead of 30s)
- Logos: 32px height (smaller)
- 5 visible at a time (approx)

### Card Showcase
- Card: 320x200px (fits mobile width)
- Rotation: tap to flip (not hover)
- Variant toggle: full-width pills
- CTA: full-width

### Features
- 1 column (stacked)
- Cards: full-width
- Icon: 40px circle

### Dashboard Preview
- Laptop mockup: full-width (minus padding)
- Parallax: disabled on mobile
- Feature pills: wrap, 2 per row

### Supported Networks
- 2-column grid
- Cards: 140x120px
- Logo: 36px

### How It Works
- Vertical timeline (top to bottom)
- Steps: full-width, stacked
- Timeline line: vertical, left-aligned
- CTA: full-width

### Pricing Preview
- 1 column (stacked)
- Cards: full-width
- "Most Popular" badge: same
- CTAs: full-width

### Security
- 1 column (stacked)
- Pillars: full-width cards
- Trust statement: 16px (not 18px)

### Testimonials
- 1 card visible
- Carousel: swipe to navigate (touch)
- Auto-advance: 5s (same)
- Dots: below carousel

### FAQ
- Full-width accordion
- Category labels: 16px (not 18px)
- Questions: 14px (not 16px) for compactness

### Newsletter
- Full-width form
- Input + button: stacked (input full-width, button full-width below) OR inline if fits
- Heading: 28px (not 40px)

### CTA Banner
- Full-width
- Heading: 28px
- Buttons: full-width, stacked
- Trust text: wrap

### Footer
- Brand section: stacked, centered
- Columns: 2-column grid for links
- Newsletter mini: full-width
- Bottom bar: stacked, centered
- Copyright: 12px

## Performance (Mobile-Specific)

| Concern | Mitigation |
|---------|-----------|
| Image size | next/image with `sizes="(max-width: 768px) 100vw, 50vw"` |
| JS bundle | Lazy-load carousel, accordion, 3D card (client components) |
| Animations | Reduce on mobile (fewer floating elements, no parallax) |
| Marquee | CSS animation (not JS) for performance |
| Fonts | Geist via next/font (self-hosted, no external request) |
| 3D transforms | Use `will-change: transform` on 3D card; disable on low-end |

## Testing

- Test on real devices: iPhone SE (320px), iPhone 14 (390px), Android (360px)
- Chrome DevTools: responsive mode at 320px, 375px, 390px, 414px
- Lighthouse mobile: score 95+
- Touch targets: verify all buttons ≥ 44x44px
- No horizontal scroll at any width
