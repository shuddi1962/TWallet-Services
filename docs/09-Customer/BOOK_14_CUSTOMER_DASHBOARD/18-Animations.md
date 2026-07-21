# 18 — Animations

> Framer Motion specification for the entire customer dashboard.

## Motion Tokens (from Book 04 §20)

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-fast` | 150ms | easeOut | Hover, switch toggle |
| `--motion-base` | 300ms | easeOut | Default transitions |
| `--motion-slow` | 500ms | easeInOut | Page reveals, large sections |

## Dashboard-Specific Animations

### Page Load (Dashboard Overview)
```tsx
const pageLoad = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' },
};
```
Applied to each widget in the dashboard grid with stagger.

### Stat Count-Up
```tsx
// useCountUp hook
const { count } = useCountUp({ end: value, duration: 0.8, easing: 'easeOut', startOnInView: true });
```

### Card Hover Lift
```tsx
const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
};
```

### Tab Switch (Underline)
```tsx
const tabIndicator = {
  layoutId: 'tab-indicator',
  transition: { duration: 0.2, ease: 'easeOut' },
};
```

### Notification Slide-In (Realtime)
```tsx
const notifSlideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};
```

### Notification Dismiss
```tsx
const notifDismiss = {
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};
```

### Modal Open
```tsx
const modalOpen = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: 'easeOut' },
};
```

### Toast Slide-Up
```tsx
const toastSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};
```

### Timeline Progress (Order Tracking)
```tsx
const timelineProgress = {
  initial: { width: '0%' },
  whileInView: { width: `${progress}%` },
  viewport: { once: true },
  transition: { duration: 0.4, ease: 'easeOut' },
};
```

### Switch Toggle
```tsx
// CSS transition (not Framer Motion — simpler for switches)
.switch-thumb {
  transition: transform 0.2s ease-out;
}
.switch[data-checked] .switch-thumb {
  transform: translateX(20px);
}
```

### Dropdown Open
```tsx
const dropdownOpen = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15, ease: 'easeOut' },
};
```

### Bottom Tab Bar (Mobile)
```tsx
const tabSlide = {
  layoutId: 'mobile-tab-indicator',
  transition: { duration: 0.2, ease: 'easeOut' },
};
```

## prefers-reduced-motion

| Animation | When Reduced |
|-----------|-------------|
| Page load fade | Disable (show instantly) |
| Count-up | Disable (show final value) |
| Card hover | Disable (no lift) |
| Tab indicator | Instant (no slide) |
| Notification slide | Disable (show instantly) |
| Modal open | Instant (no scale) |
| Toast | Disable (show instantly) |
| Timeline progress | Instant (show full line) |
| Switch toggle | Instant (no slide) |
| Dropdown | Instant (no slide) |

**Implementation:**
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
// Pass to all motion components or conditionally disable animations
```

## Performance Rules

| Rule | Detail |
|------|--------|
| Use `viewport: { once: true }` | Don't re-animate on scroll back |
| Only animate `transform` + `opacity` | Avoid layout thrash |
| CSS for switches | Simpler than Framer Motion for toggles |
| Limit simultaneous animations | Max 8 staggered items |
| Lazy-load client islands | Wallet, notifications, forms are client components |
| Skeletons during load | Prevent CLS (reserve space) |
