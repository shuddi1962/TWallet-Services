# Performance Rules

## Golden Rules

| Rule | Description |
|------|-------------|
| Default to Server Components | Minimize client-side JS |
| Use Server Actions for mutations | Avoid client-side fetch chains |
| Use Suspense for slow sections | Don't block page render |
| Use dynamic() for heavy components | Defer loading non-critical code |
| Use next/image for all images | Automatic optimization |
| Use next/font for all fonts | Self-hosted, subsetted |
| Prefer cursor pagination | No unbounded queries |
| Select only needed columns | Never `SELECT *` |
| Use React.cache() for duplicate calls | Deduplicate within a request |

## What to Avoid

| Anti-pattern | Impact | Solution |
|-------------|--------|----------|
| Large client bundles | Slow page load | Dynamic imports, code splitting |
| Unnecessary re-renders | Janky UI | React.memo, useMemo, useCallback |
| Duplicate API calls | Wasted bandwidth | React.cache(), deduplication |
| Blocking UI during data fetch | Poor INP | Suspense, streaming |
| Unoptimized images | High LCP, bandwidth | Next/Image, WebP, responsive sizes |
| No pagination | Slow page, high memory | Cursor-based pagination |
| N+1 queries | Slow API response | Batched queries, joins |

## Performance Checklist

### Before Merging

- [ ] Component is a Server Component by default (no unnecessary `"use client"`)
- [ ] Heavy components use `dynamic()` with `ssr: false`
- [ ] Slow sections wrapped in `<Suspense>` with skeleton
- [ ] Images use `next/image` with proper `width`/`height`
- [ ] Images have `loading="lazy"` (default) or `priority` for above-fold
- [ ] Images use WebP/AVIF format
- [ ] Fonts use `next/font` with `display: swap`
- [ ] Queries select only needed columns
- [ ] List endpoints use cursor pagination
- [ ] No `console.log` (costly in serverless)
- [ ] Bundle size impact reviewed (use `ANALYZE=true`)

## Monitoring

- Performance is monitored in CI via Lighthouse CI
- Production performance monitored via Vercel Analytics (Web Vitals) and Sentry
- Performance regressions block PRs from merging
- Weekly performance review for trends

## Reference

See **Book 25 — Performance Optimization** for the complete performance strategy.
