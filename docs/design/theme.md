# Theme System

## Supported Themes

| Theme | Status | Notes |
|-------|--------|-------|
| Light | Active | Default application theme |
| Dark | Planned | CSS variable override; no redesign needed |
| High Contrast | Planned | WCAG AAA compliance; larger focus rings |

## Implementation Strategy

The theme system uses **CSS custom properties** on `:root` with Tailwind CSS. Dark mode will use a `[data-theme="dark"]` selector that overrides the same CSS variables.

```css
:root {
  --color-primary: #2563eb;
  --color-background: #f8fafc;
  --color-card: #ffffff;
  --color-border: #e2e8f0;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-background: #0f172a;
  --color-card: #1e293b;
  --color-border: #334155;
}
```

## Tailwind Configuration

```ts
// tailwind.config.ts
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        // ... all other tokens
      },
    },
  },
}
```

## CSS Variable Catalog

```css
/* Brand */
--color-primary
--color-primary-hover
--color-primary-light
--color-primary-dark

/* Semantic */
--color-success
--color-warning
--color-danger
--color-info

/* Neutral */
--color-background
--color-card
--color-border
--color-input
--color-gray-50 through --color-gray-900

/* Typography */
--font-sans
--font-mono
--text-xs through --text-6xl
--weight-normal through --weight-extrabold

/* Spacing */
--space-0 through --space-24

/* Radius */
--radius-sm through --radius-full

/* Shadows */
--shadow-sm through --shadow-xl

/* Animation */
--duration-fast through --duration-slowest
--ease-default through --ease-in-out

/* Z-Index */
--z-dropdown through --z-loader

/* Breakpoints */
--bp-sm through --bp-2xl
```

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Minimum contrast | WCAG 2.1 AA (4.5:1) |
| Focus ring | 2px offset, high contrast color |
| Reduced motion | `prefers-reduced-motion` media query |
| Font scaling | `rem` units, no fixed px for text |
