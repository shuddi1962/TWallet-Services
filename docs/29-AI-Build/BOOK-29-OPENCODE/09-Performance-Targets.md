# Performance Targets

## Page Load Targets

| Page | Target | Measurement |
|------|--------|-------------|
| Homepage | < 2 seconds | Lighthouse |
| Dashboard | < 2 seconds | Lighthouse |
| Admin Dashboard | < 2 seconds | Lighthouse |
| Wallet Connect | < 3 seconds | Real-user |
| Crypto Payment Verification | < 5 seconds | Real-user |
| API Response (p50) | < 200ms | Sentry |
| API Response (p95) | < 500ms | Sentry |
| API Response (p99) | < 1 second | Sentry |

## Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 1.5s (good) / < 2.5s (acceptable) |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTFB (Time to First Byte) | < 800ms |
| First Contentful Paint (FCP) | < 1.5s |

## Lighthouse Scores

| Category | Target |
|----------|--------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Bundle Budgets

| Asset | Budget |
|-------|--------|
| JavaScript (initial load) | < 250 KB |
| CSS (initial) | < 100 KB |
| Largest image | < 200 KB |
| Fonts (total) | < 75 KB |
| Third-party scripts | < 50 KB |
| Homepage total page weight | < 2 MB |

## Performance Rules

| Rule | Impact |
|------|--------|
| Default to Server Components | Minimizes client JS |
| Use Server Actions | No client fetch overhead |
| Dynamic imports for heavy components | Deferred loading |
| Suspense for slow sections | Non-blocking rendering |
| Next/Image for all images | Automatic optimization |
| Next/Font for all fonts | Self-hosted, subsetted |
| Cursor pagination | No unbounded queries |
| Select only needed columns | Reduced data transfer |
| React.cache() for deduplication | Fewer DB calls |

## Performance Checklist Before Merge

- [ ] Component is Server Component by default
- [ ] Heavy components use `dynamic()` with `ssr: false`
- [ ] Slow sections wrapped in `<Suspense>` with skeleton
- [ ] Images use `next/image` with proper dimensions
- [ ] Images use `priority` only above the fold
- [ ] Fonts use `next/font` with `display: swap`
- [ ] Queries select only needed columns
- [ ] List endpoints use cursor pagination
- [ ] Bundle size impact reviewed
