# Task 009: Framer Motion Setup

## Goal
Configure Framer Motion with shared animation variants for the entire application.

## Requirements
- Framer Motion installed and configured
- Shared animation variants (fade, slide, scale, stagger)
- Reduced motion support (prefers-reduced-motion)
- Page transition animations
- Stagger children pattern for lists

## Dependencies
- Task 005 (design tokens for animation durations/easing)

## Files
```
src/lib/
└── animations.ts        # Shared animation variants

src/components/
└── motion/              # Motion wrapper components (optional)
```

## References
- `docs/BOOK-04/BOOK_04_DESIGN_SYSTEM.md` (motion specs section)
- `docs/design/animations.md`

## Acceptance Criteria
- [ ] Framer Motion v11 installed
- [ ] Shared variants exported from animations.ts
- [ ] Respects prefers-reduced-motion
- [ ] Page transitions smooth on route change

## Testing
- Visual: Animations play correctly
- A11y: No motion without user consent (if reduced motion)
- No layout shift from animated elements
