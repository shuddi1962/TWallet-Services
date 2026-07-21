# OpenCode Testing Build Instructions

Build a comprehensive test suite for the TWallet Services platform.

## Requirements

| Area | Tool | Status |
|------|------|--------|
| Unit tests | Vitest | 90% coverage target |
| Integration tests | Vitest + MSW | RLS, API, Server Actions |
| E2E tests | Playwright | 13 critical user journeys |
| API tests | Vitest | All 65+ endpoints |
| Database tests | Vitest + Supabase local | RLS, triggers, functions |
| Security tests | Vitest + Playwright | Auth, XSS, RLS, CSRF |
| Performance tests | Lighthouse CI + k6 | LCP < 2.5s, budgets |
| Accessibility tests | axe-core + Playwright | WCAG 2.1 AA, 0 violations |
| Cross-browser | Playwright (3 engines) | Chrome + Firefox + Safari |
| Mobile | Playwright (device emulation) | Phone + tablet |

## File Structure

```
src/
├── __tests__/
│   ├── lib/           # Utility tests
│   ├── validators/    # Zod schema tests
│   ├── actions/       # Server Action tests
│   └── components/    # Component tests
├── mocks/
│   └── handlers.ts    # MSW handlers
e2e/
├── auth.spec.ts
├── orders.spec.ts
├── payments.spec.ts
├── wallet.spec.ts
├── admin.spec.ts
└── support.spec.ts

qa/
├── TEST_PLAN.md
├── TEST_CASES.md
├── SMOKE_TESTS.md
├── REGRESSION_CHECKLIST.md
├── BUG_TEMPLATE.md
├── RELEASE_SIGNOFF.md
├── PERFORMANCE_BUDGET.md
└── ACCESSIBILITY_CHECKLIST.md
```

## Verification Checklist

- Unit tests run with `npm run test:unit`
- Integration tests run with `npm run test:integration`
- E2E tests run with `npm run test:e2e`
- All tests pass in CI
- Coverage threshold met (90%)
- Accessibilty audit passes (0 violations)
- Performance budget met
- Security scan clean
- Database migration verified
- Rollback tested
- Release criteria documented
