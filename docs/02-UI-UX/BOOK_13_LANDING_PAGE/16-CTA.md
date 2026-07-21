# 16 — CTA Banner

> Component ID: LP-015 | Status: Approved
> Final conversion push — the last call to action before the footer.

## Purpose

One final push to convert visitors who scrolled through the entire page but haven't clicked "Get Started" yet. Make it impossible to miss.

## Section Specs

| Property | Value |
|----------|-------|
| Background | Dark navy (`--color-hero` #020817) with radial gradient glow (primary at 15%) |
| Layout | Centered, full-width |
| Padding | `--space-30` (120px) vertical desktop, `--space-16` (64px) mobile |
| Text color | White |

## Content

| Element | Spec |
|---------|------|
| Heading | "Ready To Join The Future Of Digital Payments?" (`--text-section` 40px, 700, white, centered) |
| Subtitle | "Create your account today and experience secure crypto-powered card services." (`--text-hero-sub` 22px, #E2E8F0, centered) |

## Buttons

| Button | Text | Style | Route |
|--------|------|-------|-------|
| Primary | Create Account | Primary button, `lg`, white bg + primary text | `/auth/register` |
| Secondary | Explore Cards | Ghost button, white border + white text, `lg` | `/cards` |

- Layout: inline row (desktop), stacked full-width (mobile)
- `--space-4` (16px) gap between buttons

## Trust Text (Below Buttons)

- "No seed phrase needed · Non-custodial · 7+ networks" (14px, white/60%, centered)

## Component Tree

```
CTABanner (RSC)
├── CTABackground (dark navy + radial glow)
├── CTAContent (centered)
│   ├── Heading ("Ready To Join The Future Of Digital Payments?" — white)
│   ├── Subtitle ("Create your account today..." — #E2E8F0)
│   ├── CTAGroup
│   │   ├── PrimaryButton ("Create Account" → /auth/register, white bg)
│   │   └── SecondaryButton ("Explore Cards" → /cards, ghost white)
│   └── TrustText ("No seed phrase needed · Non-custodial · 7+ networks")
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Heading | 300ms easeOut | Scroll into view |
| Fade-in | Subtitle | 300ms (100ms delay) | Scroll into view |
| Fade-in | Buttons | 300ms (200ms delay) | Scroll into view |
| Glow pulse | Radial glow | 4s infinite (opacity 0.1→0.2→0.1) | After load |

### prefers-reduced-motion
- Disable: glow pulse
- Keep: fade-in (or disable)

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Call to Action">` |
| Heading | `<h2>` "Ready To Join The Future Of Digital Payments?" |
| Primary button | `aria-label="Create your TWallet account"` |
| Secondary button | `aria-label="Explore available cards"` |
| Color contrast | White on #020817 = 18:1 (AAA) |
| Keyboard | Buttons focusable with visible `:focus-visible` ring |

## Responsive

| Breakpoint | Layout | Buttons |
|------------|--------|---------|
| Desktop (1024+) | Centered, max-width 800px | Inline row |
| Tablet (768+) | Centered | Inline row |
| Mobile (320+) | Centered | Stacked, full-width |
