# Task 005: Design Tokens

## Goal
Implement the design token system in TypeScript, synchronized with design specs.

## Requirements
- Colors (brand, semantic, neutral, chart — light + dark)
- Typography (font families, 9 sizes, weights)
- Spacing (14-step scale)
- Radius (5 steps)
- Shadows (4 levels)
- Animations (duration + easing)
- Tailwind CSS config partial

## Dependencies
- Task 004 (Tailwind config)

## Files
```
src/theme/
├── colors.ts        # Brand, semantic, neutral, chart + dark variants
├── typography.ts    # Font families, sizes, weights, line heights
├── spacing.ts       # 14-step scale (0.25rem increments)
├── radius.ts        # 5-level radius
├── shadow.ts        # 4-level shadow
├── animations.ts    # Duration + easing tokens
├── tokens.ts        # Barrel export
└── tailwind.ts      # Tailwind CSS config partial
```

## References
- `docs/BOOK-20/BOOK-20-DESIGN-TOKENS/`
- `docs/design-tokens/` (JSON tokens)
- `docs/design/` (human-readable tokens)

## Acceptance Criteria
- [ ] All tokens match design specs
- [ ] Light + dark variants for colors
- [ ] WCAG AA contrast ratios maintained
- [ ] All tokens exported from barrel (tokens.ts)
- [ ] Tailwind config partial merges with base config

## Testing
- Token values match design-tokens JSON reference

## Notes
- Never hardcode raw values in components
- Always import from theme/tokens
