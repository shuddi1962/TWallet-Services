# 19 — Animations

> Complete Framer Motion specification for the entire landing page.

## Purpose
Define every animation on the landing page in one place for consistency and `prefers-reduced-motion` compliance.

## Motion Tokens (from Book 04 §20)

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-fast` | 150ms | easeOut | Hover, tap feedback |
| `--motion-base` | 300ms | easeOut | Default transitions |
| `--motion-slow` | 500ms | easeInOut | Page reveals, large sections |

## Animation Patterns

### Fade-In + Slide-Up
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.3, ease: "easeOut" },
};
```
**Used by:** Section headers, feature cards, security pillars, how-it-works steps, pricing cards, network cards, CTA content.

### Fade-In (No Slide)
```tsx
const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.3 },
};
```
**Used by:** Newsletter section, FAQ section, trust statements.

### Scale-In
```tsx
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.2, ease: "easeOut" },
};
```
**Used by:** Icon circles in features, shield icon in security, 3D card in showcase.

### Stagger (Container + Children)
```tsx
const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};
```
**Used by:** Feature grid, security pillars, statistics, how-it-works steps, network cards.
**Max stagger:** 8 items (cap to avoid long reveals).

### Count-Up (Statistics)
```tsx
// Use a custom hook or library like 'count-up'
const { countUp } = useCountUp({ end: value, duration: 800, easing: easeOut });
```
**Used by:** Statistics numbers (10K+, 25K+, 50+, 7+).

### Hover Lift
```tsx
const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
};
```
**Used by:** Feature cards, pricing cards, network cards, card showcase.

### Continuous Float (3D Card / Coins)
```tsx
const float = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};
```
**Used by:** Floating coins in hero, 3D card gentle float (when not hovering).

### Glow Pulse
```tsx
const glowPulse = {
  animate: { opacity: [0.15, 0.25, 0.15] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};
```
**Used by:** Hero radial glow, CTA banner radial glow.

### Carousel Slide
```tsx
const carouselSlide = {
  animate: { x: `-${currentSlide * 100}%` },
  transition: { duration: 0.3, ease: "easeOut" },
};
```
**Used by:** Testimonials carousel.

### Accordion Expand
```tsx
// Radix UI Accordion handles this internally
// CSS: height transition + chevron rotate
```
**Used by:** FAQ accordion.

### Marquee Scroll
```css
/* CSS animation (not Framer Motion — more performant) */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee 30s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
```
**Used by:** Trusted partners marquee.

### Drawer Slide
```tsx
const drawerSlide = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
  transition: { duration: 0.25, ease: "easeOut" },
};
```
**Used by:** Mobile header drawer.

### Announcement Bar Slide
```tsx
const barSlide = {
  initial: { y: "-100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
  transition: { duration: 0.2, ease: "easeOut" },
};
```
**Used by:** Announcement bar show/dismiss.

## prefers-reduced-motion

**Global rule:** When `prefers-reduced-motion: reduce`:
- Disable all continuous animations (float, glow pulse, marquee, count-up)
- Disable all slide animations (drawer, carousel, announcement bar) → instant
- Keep essential fade-in only (or disable entirely if user prefers)
- Show final state immediately for all animations

**Implementation:**
```tsx
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{/* static content, no animation */}</div>;
  }

  return <motion.div {...fadeInUp}>{/* animated content */}</motion.div>;
}
```

**CSS approach:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Rules

| Rule | Detail |
|------|--------|
| Use `viewport: { once: true }` | Animations trigger once; don't re-animate on scroll back |
| Use `will-change: transform` | On 3D card and carousel for GPU acceleration |
| Limit simultaneous animations | Max 8 staggered items; don't animate everything at once |
| CSS for infinite animations | Marquee and glow use CSS, not Framer Motion (less JS overhead) |
| Lazy-load client components | Carousel, accordion, 3D card, newsletter form are client components |
| Avoid layout thrash | Only animate `transform` and `opacity` (not width, height, top, left) |
