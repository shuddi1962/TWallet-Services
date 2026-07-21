# CI/CD

## Pipeline Overview

```
Push / PR
  │
  ├── lint (ESLint)
  ├── typecheck (tsc --noEmit)
  ├── test:unit (Vitest)
  ├── test:integration (Vitest + MSW)
  ├── build (next build)
  │
  ├── [PR] → test:e2e (Playwright) → Deploy Preview
  │
  └── [main] → Deploy Preview → test:e2e → Production Approval → Deploy Production
```

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, "feature/*", "fix/*"]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit -- --coverage
      - run: npm run build

  e2e:
    needs: quality
    if: github.event_name == 'pull_request'
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

  deploy-preview:
    needs: e2e
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Pipeline Stages

| Stage | Tools | Time | Failure Action |
|-------|-------|------|----------------|
| Lint | ESLint | 30s | Block PR |
| TypeCheck | tsc | 60s | Block PR |
| Unit Tests | Vitest | 2min | Block PR |
| Integration Tests | Vitest + MSW | 3min | Block PR |
| Build | Next.js | 2min | Block PR |
| E2E Tests | Playwright | 10min | Block merge |
| Preview Deploy | Vercel CLI | 3min | Block PR |
| Production Deploy | Vercel CLI | 5min | Rollback |

## Quality Gates

| Gate | Threshold |
|------|-----------|
| Test coverage | ≥ 90% |
| Lint errors | 0 |
| TypeScript errors | 0 |
| Build errors | 0 |
| E2E test failures | 0 |
| Performance regression | < 10% |

## Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: { interval: "weekly" }
    open-pull-requests-limit: 10
    labels: ["dependencies"]
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "monthly" }
```
