# Performance Budget — TWallet Services

## Core Web Vitals (Desktop)

| Metric | Target | Warning | Fail |
|--------|--------|---------|------|
| LCP | < 1.5s | < 2.5s | ≥ 2.5s |
| INP | < 100ms | < 200ms | ≥ 200ms |
| CLS | < 0.05 | < 0.1 | ≥ 0.1 |
| FCP | < 1.0s | < 1.8s | ≥ 1.8s |
| TTFB | < 400ms | < 800ms | ≥ 800ms |
| Speed Index | < 2.0s | < 3.4s | ≥ 3.4s |

## Core Web Vitals (Mobile 4G)

| Metric | Target | Warning | Fail |
|--------|--------|---------|------|
| LCP | < 2.0s | < 3.0s | ≥ 3.0s |
| INP | < 150ms | < 250ms | ≥ 250ms |
| CLS | < 0.05 | < 0.1 | ≥ 0.1 |
| FCP | < 1.5s | < 2.5s | ≥ 2.5s |
| TTFB | < 800ms | < 1200ms | ≥ 1200ms |

## Lighthouse Scores

| Category | Target | Minimum |
|----------|--------|---------|
| Performance | 95 | 90 |
| Accessibility | 95 | 90 |
| Best Practices | 95 | 90 |
| SEO | 95 | 90 |

## Bundle Budgets

| Resource | Budget |
|----------|--------|
| Initial JS (all pages) | < 200KB |
| Initial CSS | < 50KB |
| Largest component JS | < 50KB |
| Fonts (Inter + JetBrains Mono) | < 40KB |
| Total page weight | < 500KB |

## API Budgets

| Metric | Target |
|--------|--------|
| API response (p50) | < 200ms |
| API response (p95) | < 500ms |
| API response (p99) | < 2000ms |
| Error rate | < 0.1% |
| Edge Function execution | < 5s |
| Database query (p95) | < 100ms |

## Images

| Format | Max Size |
|--------|----------|
| JPEG quality | 80 |
| WebP preferred | Yes |
| Card art | < 200KB |
| Avatar | < 100KB |
| Marketing images | < 300KB |
