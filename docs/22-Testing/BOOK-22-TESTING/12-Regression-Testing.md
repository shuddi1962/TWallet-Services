# Regression Testing

## When to Run

| Trigger | Scope | Responsibility |
|---------|-------|----------------|
| Every PR | Automated unit + integration tests | CI |
| Every PR with visual changes | Visual regression (Storybook) | CI |
| Before every release | Full regression suite | QA team |
| After critical fix | Related feature area | Developer |
| After major feature | All dependent features | QA team |
| After database migration | RLS, triggers, functions | CI + QA |
| After auth changes | All auth flows | CI + QA |

## Regression Test Suite

### Automated (CI)

```bash
npm run test:unit         # Vitest — all layers
npm run test:integration  # Vitest + MSW
npm run test:e2e          # Playwright — critical journeys
npm run test:security     # Security-specific tests
npm run test:accessibility # axe-core audits
npm run test:api          # API contract tests
```

### Manual (QA)

- Full E2E walkthrough of 13 critical user journeys
- Cross-browser visual inspection
- Mobile device testing
- Edge case validation
- Data integrity checks

## Regression Checklist

```
☐ All unit tests pass
☐ All integration tests pass
☐ All E2E tests pass
☐ Security tests pass
☐ Accessibility audit passes
☐ Performance budget met
☐ Cross-browser tests pass
☐ Mobile tests pass
☐ Database migration verified
☐ Rollback tested
☐ No new console errors
☐ No new Sentry issues
☐ API contracts valid
☐ Visual regression clean
```
