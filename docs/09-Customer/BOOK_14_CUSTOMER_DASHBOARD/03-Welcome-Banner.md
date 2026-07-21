# 03 — Welcome Banner

> Component ID: DB-003 | Status: Approved
> Personalized greeting with card illustration.

## Purpose

Personalize the dashboard experience. Make the user feel welcomed and oriented.

## Layout

- **Full width** (12 columns)
- **Card:** `--color-surface`, 24px radius, `--shadow-md`
- **Layout:** Left text (70%) + right illustration (30%) on desktop; stacked on mobile
- **Padding:** `--space-8` (32px)

## Content

### Left Side
| Element | Spec |
|---------|------|
| Greeting | "Good Morning, {{ First Name }}" or "Good Afternoon..." or "Good Evening..." based on time of day |
| Subtitle | "Welcome back to your TWallet Services dashboard. Manage your crypto cards, wallet connections, and transactions from one secure place." |
| Text color | Greeting: `--color-heading` (24px, 700); Subtitle: `--color-body` (16px, 400) |

### Right Side (Desktop)
| Element | Spec |
|---------|------|
| Illustration | Mini TWallet card illustration (CSS or SVG), `--shadow-lg`, slight rotation (-5deg) |
| Size | 180x113px (card ratio) |

## Greeting Logic

```ts
function getGreeting(hour: number): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const greeting = getGreeting(new Date().getHours());
// "Good Morning, John"
```

## Component Tree

```
WelcomeBanner (RSC)
├── BannerContent (split layout)
│   ├── BannerLeft (70%)
│   │   ├── Greeting ("Good Morning, {{ firstName }}" — 24px, 700)
│   │   └── Subtitle ("Welcome back to your TWallet Services dashboard..." — 16px, body)
│   └── BannerRight (30%, desktop only)
│       └── CardIllustration (mini card, rotated, shadow-lg)
```

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Fade-in + slide-up | Banner | 300ms on load |
| Card float | Illustration | 4s infinite (translateY 0→-6px→0) |

### prefers-reduced-motion
- Disable: card float
- Keep: fade-in (or disable)

## Accessibility

- `<section aria-label="Welcome">`
- Greeting is `<h1>` (only one on dashboard page) — visually prominent
- Card illustration: `alt="TWallet Card"` or `aria-hidden="true"` if CSS-only
