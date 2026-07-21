# Book 21 — Testing Strategy

> **TWallet Services · TWallet Card**
> Complete testing strategy — unit, integration, E2E, accessibility, performance, security.

---

## File Index

| File | Section |
|------|---------|
| `README.md` | Overview, test pyramid, CI pipeline |
| `01-Unit.md` | Unit tests (Vitest) |
| `02-Integration.md` | Integration tests (Supabase, API) |
| `03-E2E.md` | End-to-end tests (Playwright) |
| `04-Accessibility.md` | A11y tests (axe-core, VoiceOver) |
| `05-Performance.md` | Performance tests (Lighthouse, k6) |
| `06-Security.md` | Security tests (RLS, auth, OWASP) |
| `07-OpenCode.md` | Build prompt |

---

## Test Pyramid

```
       ╱╲
      ╱ E2E ╲         ← 10% — critical user flows
     ╱────────╲
    ╱ Integration ╲    ← 30% — API routes, DB queries, Edge Functions
   ╱────────────────╲
  ╱   Unit (Vitest)   ╲  ← 60% — components, utils, actions, schemas
 ╱──────────────────────╲
```

## Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:accessibility": "axe --config .axe.json",
    "test:performance": "lighthouse-ci https://staging.twalletservices.com",
    "test:api": "k6 run tests/k6/api-load-test.js",
    "test:security": "npm run test:rls && npm run test:auth"
  }
}
```
