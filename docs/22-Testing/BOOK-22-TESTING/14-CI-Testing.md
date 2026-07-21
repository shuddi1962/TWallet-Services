# CI Testing

## Pipeline Overview

```
Commit → GitHub → CI (GitHub Actions)
                      │
           ┌──────────┴──────────┐
           │    lint             │
           │    typecheck        │
           │    unit             │
           │    build            │
           │    integration      │
           │    e2e              │
           └──────────┬──────────┘
                      │
               ┌──────┴──────┐
               │  Preview    │
               │  Deploy     │
               └──────┬──────┘
                      │
               ┌──────┴──────┐
               │  Release    │
               │  (manual)   │
               └─────────────┘
```

## GitHub Actions Configuration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: supabase
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  e2e:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

## CI Test Commands

| Command | Stage | Purpose |
|---------|-------|---------|
| `npm run lint` | lint | ESLint |
| `npm run typecheck` | lint | TypeScript strict check |
| `npm run test:unit` | test | Vitest unit tests |
| `npm run test:integration` | test | Vitest integration tests |
| `npm run test:e2e` | e2e | Playwright E2E tests |
| `npm run test:security` | test | Security-specific tests |
| `npm run test:a11y` | test | Accessibility audits |
| `npm run build` | build | Next.js production build |

## Failing Criteria

A PR is blocked if:

- Any lint error
- TypeScript compilation error
- Test failure (any layer)
- Build failure
- Coverage below threshold
