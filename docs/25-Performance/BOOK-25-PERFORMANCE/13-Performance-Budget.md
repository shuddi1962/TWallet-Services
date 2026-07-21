# Performance Budget

## Budget Table

| Category | Budget | Measurement | Tool |
|----------|--------|-------------|------|
| Total JavaScript (initial) | < 250 KB | Uncompressed | Lighthouse + bundle analyzer |
| Total CSS (initial) | < 100 KB | Uncompressed | Lighthouse |
| Homepage total page weight | < 2 MB | Transfer size | Lighthouse |
| Largest image | < 200 KB | File size | Lighthouse |
| Fonts total | < 75 KB | Transfer size | Lighthouse |
| Third-party scripts | < 50 KB | Transfer size | Lighthouse |
| LCP | < 2.5s | Real-user | Vercel Analytics |
| INP | < 200ms | Real-user | Vercel Analytics |
| CLS | < 0.1 | Real-user | Vercel Analytics |
| TTFB | < 800ms | Lab + field | Vercel + Lighthouse |
| API response (p50) | < 200ms | Server-side | Sentry |
| API response (p95) | < 500ms | Server-side | Sentry |
| API response (p99) | < 1s | Server-side | Sentry |
| Lighthouse Performance score | 95+ | Lab | Lighthouse CI |
| Lighthouse Accessibility score | 95+ | Lab | Lighthouse CI |
| Lighthouse Best Practices score | 95+ | Lab | Lighthouse CI |

## Budget Enforcement

### Lighthouse CI

Configure Lighthouse CI to fail the build if budgets are exceeded:

```typescript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['https://twallet.app', 'https://twallet.app/app/dashboard'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 250 * 1024 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100 * 1024 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 2 * 1024 * 1024 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],
        'max-potential-fid': ['error', { maxNumericValue: 100 }],
        'unused-javascript': ['warn', { maxNumericValue: 50 * 1024 }],
        'uses-responsive-images': ['error', { minScore: 1 }],
        'modern-image-formats': ['error', { minScore: 1 }],
        'offscreen-images': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## Budget Review Cadence

| Review | Frequency | Owner |
|--------|-----------|-------|
| Automated Lighthouse CI | Every PR | CI pipeline |
| Bundle size review | Weekly | Tech Lead |
| CWV field data review | Weekly | Engineering team |
| Full performance audit | Monthly | Tech Lead |
| Budget recalibration | Quarterly | CTO + Engineering |

## Exceeding Budget

If any budget is exceeded:

1. PR is blocked from merging (if Lighthouse CI fails)
2. Engineer must identify the cause
3. Options:
   - Optimize the offending code/asset
   - Split the feature into deferred chunks
   - Request budget increase with justification
4. Tech Lead approves any budget increase
