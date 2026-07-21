# 04 — Statistics Section

> Component ID: LP-003 | Status: Approved
> Trust bar with 4 key metrics displayed as premium glass cards with count-up animation.

## Purpose
Increase user trust using measurable platform statistics. Show scale and reliability immediately after the hero.

## Layout

| Breakpoint | Layout | Card Size |
|------------|--------|-----------|
| Desktop (1024+) | 4 columns (horizontal row) | 1/4 width |
| Tablet (768–1023) | 2x2 grid | 1/2 width |
| Mobile (320–767) | 2x2 grid | 1/2 width |

## Section Specs
- **Background:** `--color-surface` (#FFFFFF) or transparent overlapping hero bottom
- **Padding:** `--space-12` (48px) vertical, `--space-8` (32px) horizontal
- **Container:** `--container-max`, centered

## Statistics Cards (4)

| Stat | Value | Label | Icon |
|------|-------|-------|------|
| 1 | 10,000+ | Registered Users | Users |
| 2 | 50+ | Countries Supported | Globe |
| 3 | 25,000+ | Transactions | ArrowLeftRight |
| 4 | 7+ | Supported Networks | Network |

## Card Style

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) or glass (white/80% + backdrop-blur) |
| Border | 1px `--color-border` |
| Radius | `--radius-card` (20px) |
| Shadow (resting) | `--shadow-md` |
| Shadow (hover) | `--shadow-lg` + translateY(-2px) |
| Padding | `--space-6` (24px) |
| Text align | Center |

### Card Content
- **Number:** 32px (desktop) / 24px (mobile), 700 weight, `--color-primary`, tabular-nums
- **Label:** 14px, 500, `--color-body`
- **Icon:** 24px, `--color-primary`, top of card in a circle (primary-light bg, 48px)

## Counter Animation

```
0 → Real Number
```

- **Trigger:** When card scrolls into view (`viewport: { once: true }`)
- **Duration:** 800ms
- **Easing:** easeOut
- **Stagger:** 100ms between each card
- **Format:** Numbers animate from 0 to target; "10,000+" shows "+" after count completes
- **Implementation:**
```tsx
import { useCountUp } from '@/hooks/useCountUp';

function StatCard({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const { count } = useCountUp({
    end: value,
    duration: 800,
    easing: 'easeOut',
    startOnInView: true,
  });

  return (
    <div className="stat-card">
      <div className="stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
```

### prefers-reduced-motion
- Disable count-up; show final value instantly
- Cards still fade in (or show instantly if all motion disabled)

## Component Tree
```
Statistics (RSC + Client for count-up)
└── StatGrid (4 columns / 2x2)
    ├── StatCard (value=10000, suffix="+", label="Registered Users", icon=Users)
    ├── StatCard (value=50, suffix="+", label="Countries Supported", icon=Globe)
    ├── StatCard (value=25000, suffix="+", label="Transactions", icon=ArrowLeftRight)
    └── StatCard (value=7, suffix="+", label="Supported Networks", icon=Network)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Fade-in + slide-up | Cards | 300ms | Scroll into view (stagger 100ms) |
| Count-up | Numbers | 800ms | Card in view |
| Icon scale-in | Icon circles | 200ms (100ms delay) | Card in view |
| Hover lift | Cards | 150ms | Mouse enter |

## Accessibility
- `<section aria-label="Platform Statistics">`
- Each stat: `aria-label="10,000+ Registered Users"`
- Numbers: `tabular-nums` for alignment
- Semantic: `<dl>` with `<dt>` (label) and `<dd>` (value)
- Icons: `aria-hidden="true"` (decorative)

## Loading
- Skeleton: 4 gray blocks with shimmer, matching card shape

## Data (Optional)
For MVP, values are hardcoded. Post-MVP, can fetch real counts:
```ts
const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
```
