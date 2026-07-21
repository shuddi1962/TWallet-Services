# BOOK-20 — DESIGN TOKENS & THEME SYSTEM

**Version:** 1.0.0 · **Status:** Production Ready · **Priority:** Critical

## Purpose

One centralized design language for the entire application. Every page, component, and animation must use these tokens — never hardcode values.

## Token Sources

| Source | Format | Purpose |
|--------|--------|---------|
| `design/` | Markdown | Human-readable documentation |
| `design-tokens/` | JSON | Machine-readable (Tailwind config, Figma sync, CSS vars) |
| `src/theme/` | TypeScript | Application imports |

## Folder Structure

```
design/                          # Human-readable docs
├── colors.md
├── typography.md
├── spacing.md
├── radius.md
├── shadow.md
├── animations.md
├── icons.md
├── breakpoints.md
├── z-index.md
└── theme.md

design-tokens/                   # Machine-readable JSON
├── tokens.json                  # Combined all tokens
├── colors.json
├── spacing.json
├── typography.json
├── shadows.json
├── radius.json
└── animations.json

src/theme/                       # TypeScript imports
├── colors.ts
├── spacing.ts
├── typography.ts
├── radius.ts
├── shadow.ts
├── animations.ts
├── tokens.ts                    # Combined barrel
└── tailwind.ts                  # Tailwind config partial
```

## Core Principles

| Principle | Rule |
|-----------|------|
| No hardcoded values | Every color, space, radius, shadow via token |
| CSS variables | All tokens exposed as `--*` custom properties |
| Tailwind only | Use Tailwind utility classes, never raw CSS |
| TypeScript | All tokens typed and exported for imports |
| Theme-aware | Light theme defined; Dark/High Contrast prepared |
| Responsive | Breakpoints enforced; no magic number media queries |
| Accessible | WCAG 2.1 AA minimum contrast (4.5:1) |

## Theme Support

| Theme | Status |
|-------|--------|
| Light | Active (app default) |
| Dark | Planned (CSS variables ready) |
| High Contrast | Planned (WCAG AAA) |

## Tailwind Config

The `tailwind.ts` file extends the Tailwind theme. Apply in `tailwind.config.ts`:

```ts
import { tailwindConfig } from "@/theme/tailwind"
export default { theme: { extend: tailwindConfig } }
```

## CSS Variables

All tokens are available as CSS custom properties on `:root`:

```css
--color-primary: #2563eb;
--color-background: #f8fafc;
--radius-md: 12px;
--shadow-card: 0 4px 12px rgba(0,0,0,0.05);
--duration-fast: 200ms;
```

## Senior Architect Recommendation

Keep `design-tokens/` as the single source of truth. Generate both `src/theme/` and Tailwind config from these JSON files. This prevents design drift between documentation, code, and design tools.

## Files

- `design/` (10 markdown files) — human-readable token reference
- `src/theme/` (8 TypeScript files) — application-ready typed tokens
- `design-tokens/` (7 JSON files) — machine-readable source of truth
