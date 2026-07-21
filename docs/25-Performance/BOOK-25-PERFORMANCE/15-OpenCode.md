# OpenCode: Performance Optimization Build Instructions

## Requirements

- React Server Components for all data-fetching pages
- Streaming + Suspense boundaries for slow sections
- Server Actions for all mutations
- Next/Image with WebP/AVIF, responsive sizes, lazy loading
- Dynamic imports for heavy components (charts, admin, modals)
- Bundle splitting with route-based code splitting
- Database query optimization (indexes, pagination, batched queries)
- Core Web Vitals target 95+ (Lighthouse)
- Caching strategy (ISR for pages, React Cache for data, CDN for assets)
- Performance budget configured in Lighthouse CI
- Benchmark baseline captured at launch

## Implementation Files

```text
src/app/api/health/route.ts
src/app/api/ready/route.ts
src/app/api/version/route.ts
src/lib/logger.ts
src/lib/logger.ts
src/lib/monitor.ts
src/lib/sentry.ts
```

## Performance Checklist

- [ ] React Server Components used by default
- [ ] Server Actions for all mutations
- [ ] Next/Image with WebP + AVIF formats
- [ ] Dynamic imports for heavy components
- [ ] Lazy loading for images below the fold
- [ ] Optimized database queries (EXPLAIN ANALYZE)
- [ ] Database indexes on all query predicates
- [ ] Cursor-based pagination on all list endpoints
- [ ] Brotli compression enabled (Vercel default)
- [ ] CDN caching configured (Vercel Edge)
- [ ] Image optimization (max 200 KB largest image)
- [ ] Bundle analysis run and reviewed
- [ ] Caching strategy documented and implemented
- [ ] Core Web Vitals target 95+
- [ ] Lighthouse CI configured with budgets
- [ ] Benchmark baseline captured
- [ ] Scaling strategy documented
- [ ] Production ready
