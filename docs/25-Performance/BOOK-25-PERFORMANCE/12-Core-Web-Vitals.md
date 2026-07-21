# Core Web Vitals

## Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 2.5s | Vercel Analytics + Lighthouse |
| Interaction to Next Paint (INP) | < 200ms | Vercel Analytics + Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Vercel Analytics + Lighthouse |
| Time to First Byte (TTFB) | < 800ms | Vercel Analytics + Lighthouse |
| Performance Score | 95+ | Lighthouse |

## LCP Optimization

### Largest Contentful Paint

The LCP element is typically the hero image or a large heading. Optimize:

1. **Serve optimized images** — Use WebP/AVIF via Next/Image with `priority` and `sizes`
2. **Preload critical resources** — Preload hero image and font files
3. **Minimize render-blocking resources** — Inline critical CSS, defer non-critical
4. **Use SSR/SSG** — Server-render LCP content instead of client-rendering

```typescript
// Preload hero image
<link rel="preload" href="/images/hero.webp" as="image" />

// Server Component for LCP content
export default async function HeroSection() {
  const data = await getHeroContent(); // Fast server fetch
  return <Hero image="/images/hero.webp" headline={data.headline} />;
}
```

### Good LCP Practices

```typescript
// ✅ Priority image (above the fold)
<Image src="/images/hero.webp" alt="Hero" priority width={1200} height={600} />

// ✅ Avoid client-side rendering LCP elements
// ❌ <ClientHero /> — LCP blocked on JS
// ✅ <ServerHero /> — LCP from server HTML

// ✅ Preload critical font
<link rel="preload" href="/fonts/inter-var.woff2" as="font" crossOrigin="anonymous" />
```

## INP Optimization

### Interaction to Next Paint

INP measures responsiveness to user interactions. Optimize:

1. **Avoid long tasks** — Break up heavy JS > 50ms
2. **Defer non-critical scripts** — Use `strategy="lazyOnload"` for analytics
3. **Optimize event handlers** — Debounce scroll/resize, throttle input
4. **Use `requestIdleCallback`** — Schedule non-urgent work during idle time

### Good INP Practices

```typescript
// ✅ Debounce search input
const debouncedSearch = useMemo(
  () => debounce((term: string) => performSearch(term), 300),
  [],
);

// ✅ Defer analytics
useEffect(() => {
  const id = requestIdleCallback(() => {
    import('@/lib/analytics').then((mod) => mod.init());
  });
  return () => cancelIdleCallback(id);
}, []);
```

## CLS Optimization

### Cumulative Layout Shift

CLS measures visual stability. Optimize:

1. **Set explicit dimensions** — Always provide `width` + `height` for images and embeds
2. **Reserve space for dynamic content** — Use skeleton loaders with fixed dimensions
3. **Avoid injecting content above existing content** — Insert new UI elements below or with reserved space
4. **Use `aspect-ratio` CSS** — Maintain space for images while loading

### Good CLS Practices

```typescript
// ✅ Explicit dimensions on all images
<Image src="/images/card.png" alt="Card" width={400} height={250} />

// ✅ Skeleton with same dimensions as content
<Suspense fallback={<div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse" />}>
  <TransactionHistory />
</Suspense>

// ✅ CSS aspect-ratio for dynamic content
<div className="aspect-video bg-gray-100 rounded-lg" />
```

## Monitoring Core Web Vitals

Vercel Analytics automatically captures real-user CWV data. View in Vercel Dashboard under Analytics → Web Vitals. Correlate with Sentry for performance regression detection.

| Tool | What It Measures | When |
|------|-----------------|------|
| Vercel Analytics | Real-user CWV (field data) | Always in production |
| Lighthouse CI | Lab CWV (synthetic) | Every deploy |
| Sentry Performance | Frontend spans, slow interactions | Always in production |
