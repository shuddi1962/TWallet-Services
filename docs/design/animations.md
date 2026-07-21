# Animations

## Duration

| Token | MS | Usage |
|-------|-----|-------|
| `--duration-fast` | 150 | Micro-interactions (hover, active) |
| `--duration-normal` | 200 | Standard transitions (color, background) |
| `--duration-slow` | 300 | Layout transitions, panel slides |
| `--duration-slower` | 500 | Page transitions, hero animations |
| `--duration-slowest` | 800 | Marketing animations, reveal |

## Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements entering screen |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements leaving screen |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |

## Motion Presets

| Token | CSS | Usage |
|-------|-----|-------|
| `--transition-fast` | `all 150ms ease-out` | Button hover |
| `--transition-normal` | `all 200ms ease-out` | Card hover, input focus |
| `--transition-slow` | `all 300ms ease-out` | Drawer, modal |
| `--transition-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy entrance |

## Framer Motion Variants

```ts
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export const slideRight = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
}
```

## Accessibility

| Requirement | Token |
|-------------|-------|
| Reduced motion | `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }` |
| No auto-play | No auto-playing animations longer than 5 seconds |
