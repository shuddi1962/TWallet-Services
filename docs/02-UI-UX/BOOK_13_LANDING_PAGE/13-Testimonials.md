# 13 — Testimonials

> Component ID: LP-012 | Status: Approved
> Customer feedback carousel with avatars, ratings, and touch swipe support.

## Purpose

Increase trust using customer feedback. Show real users (or beta testers) endorsing the product.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-hero` (#020817, dark navy) |
| Section heading | "Trusted by Crypto Users" (`--text-section`, 700, white) |
| Subtext | "Join thousands of users spending crypto with TWallet." (`--text-body`, #E2E8F0) |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Container | `--container-max`, centered |

## Layout

| Breakpoint | Cards Visible | Layout |
|------------|---------------|--------|
| Desktop (1024+) | 3 | Carousel row |
| Tablet (768–1023) | 2 | Carousel row |
| Mobile (320–767) | 1 | Single card |

## Testimonial Cards (5)

| # | Name | Country | Rating | Quote |
|---|------|---------|--------|-------|
| 1 | Maya R. | USA | ★★★★★ | "Finally, a crypto card that doesn't ask for my seed phrase. The on-chain verification gives me peace of mind." |
| 2 | Daniel K. | UK | ★★★★★ | "Ordered my virtual card in under 2 minutes. Paid with USDC on Polygon. So smooth." |
| 3 | Aisha M. | UAE | ★★★★★ | "The non-custodial approach is exactly what the crypto space needs. TWallet gets it right." |
| 4 | Sam T. | Singapore | ★★★★★ | "The dashboard is beautiful. Tracking my order and seeing the payment verified on-chain was satisfying." |
| 5 | Lina P. | Germany | ★★★★★ | "I've tried other crypto cards. TWallet is the first one that feels premium and secure." |

## Card Design

| Property | Value |
|----------|-------|
| Background | white/5% with backdrop-blur(12px) (glass on dark) |
| Border | 1px white/10% |
| Radius | `--radius-card` (20px) |
| Padding | `--space-6` (24px) |
| Shadow | `--shadow-lg` |

### Card Content
- **Quote icon:** Lucide Quote, primary color, 24px, top
- **Comment text:** 16px, italic, white, line-height 1.5
- **Divider:** 1px white/10%, full width
- **Avatar:** 40px circle, initials (e.g., "MR" for Maya R.) or photo
- **Customer name:** 14px, 600, white
- **Country:** 12px, white/60%, with flag emoji or Globe icon
- **Rating:** 5 star icons (Lucide Star, 16px, primary color, filled)

## Carousel Behavior

| Feature | Implementation |
|---------|---------------|
| Auto slide | Advances every 5 seconds |
| Pause | On hover (desktop) and focus (keyboard) |
| Manual navigation | Prev/next arrow buttons |
| Touch swipe | Swipe left/right on mobile and tablet |
| Dots | Below carousel; click to jump to slide |
| Loop | Infinite (wraps from last to first) |
| Transition | Slide (translateX), 300ms easeOut |

### Carousel Controls
- **Prev/next:** White arrows in white/10% circle buttons (40px), positioned left/right
- **Dots:** 5 dots below; white/30% inactive, white active; `aria-label="Go to testimonial N"`
- **Touch:** `onTouchStart` / `onTouchMove` / `onTouchEnd` handlers for swipe

## Component Tree

```
Testimonials (Client Component — carousel)
├── SectionHeader
│   ├── Heading ("Trusted by Crypto Users" — white)
│   └── Subtext ("Join thousands of users..." — #E2E8F0)
├── CarouselContainer (overflow hidden)
│   ├── CarouselTrack (flex, translateX animation)
│   │   ├── TestimonialCard (Maya R., USA, 5★)
│   │   ├── TestimonialCard (Daniel K., UK, 5★)
│   │   ├── TestimonialCard (Aisha M., UAE, 5★)
│   │   ├── TestimonialCard (Sam T., Singapore, 5★)
│   │   └── TestimonialCard (Lina P., Germany, 5★)
│   ├── PrevButton (← white/10% circle)
│   └── NextButton (→ white/10% circle)
└── CarouselDots (5 dots)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Slide transition | Carousel track | 300ms easeOut | Auto-advance / arrow / swipe |
| Auto-advance | Every 5s | — | Timer (pauses on hover/focus) |
| Card fade-in | Cards | 300ms | Scroll into view |
| Dot transition | Active dot | 200ms | Slide change |
| Arrow hover | Buttons | 150ms | Mouse enter (bg white/20%) |

### prefers-reduced-motion
- Disable: auto-advance (show static grid instead)
- Keep: manual navigation (arrows/dots) with instant transition
- No slide animation; cards show in a grid

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Testimonials">` |
| Carousel | `role="region"` with `aria-roledescription="carousel"` |
| Each card | `aria-label="[Name] from [Country] — [Quote]"` |
| Prev/next | `aria-label="Previous testimonial"` / `"Next testimonial"` |
| Dots | `aria-label="Go to testimonial 1"` etc.; `aria-current="true"` on active |
| Keyboard | Left/Right arrows navigate; focus moves to active card |
| Auto-advance | Pauses on focus and hover |
| Color contrast | White on #020817 = 18:1 (AAA) |

## Note

Testimonials are placeholder for MVP. Replace with real testimonials after launch. Use initials for avatars if photos not available.
