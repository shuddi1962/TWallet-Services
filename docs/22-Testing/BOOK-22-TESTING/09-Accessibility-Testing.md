# Accessibility Testing

## Standard

**WCAG 2.1 Level AA** — minimum for all public and customer-facing pages.

## Automated Testing

### axe-core Integration

```ts
import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("landing page has no accessibility violations", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
})

test("auth pages pass a11y audit", async ({ page }) => {
  await page.goto("/auth/login")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
})
```

## Manual Testing Checklist

| Check | Method |
|-------|--------|
| Keyboard navigation | Tab through all interactive elements |
| Focus order | Logical tab order matches visual order |
| Focus indicator | Visible focus ring on all interactive elements |
| Screen reader | Navigate with NVDA / VoiceOver |
| Color contrast | Minimum 4.5:1 for normal text, 3:1 for large |
| Text scaling | Zoom to 200% — no content loss |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Alternative text | All images have meaningful alt text |
| ARIA labels | Custom interactive elements have proper labels |
| Form labels | All inputs have associated labels |
| Error messages | Errors are announced to screen readers |
| Headings | Proper h1–h6 hierarchy |
| Landmarks | Page has header, nav, main, footer regions |

## Accessibility Targets

| Page Type | Violations | Target |
|-----------|-----------|--------|
| Public pages | 0 critical, 0 serious | WCAG AA |
| Auth pages | 0 critical, 0 serious | WCAG AA |
| Customer dashboard | 0 critical, 0 serious | WCAG AA |
| Admin dashboard | 0 critical, ≤ 2 serious | WCAG AA |

## Tools

| Tool | Purpose |
|------|---------|
| axe-core (Playwright) | Automated audit |
| Lighthouse | Automated audit + scoring |
| NVDA (Windows) | Screen reader testing |
| VoiceOver (macOS) | Screen reader testing |
| WAVE browser extension | Manual inspection |
| Colour Contrast Analyser | Manual contrast check |
