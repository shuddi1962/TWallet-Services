# Technical SEO

## Framework

| Component | Implementation |
|-----------|----------------|
| Rendering | Next.js App Router (SSR + SSG) |
| Metadata | Next.js Metadata API |
| Canonical URLs | Auto-generated per route |
| Sitemap | `app/sitemap.ts` — auto-generated |
| Robots | `app/robots.ts` — dynamic rules |
| Structured Data | JSON-LD via `script` tags |
| Performance | Core Web Vitals (see Book 25) |
| Accessibility | WCAG 2.1 AA (see Book 04, Book 22) |
| Security | HTTPS enforced (Vercel default) |

## Core Requirements

### Server-Side Rendering

All public-facing pages MUST be server-rendered or statically generated. No client-side rendering for content that search engines need to index.

```typescript
// ✅ Server Component (default in App Router)
export default async function MarketingPage() {
  const content = await getContent();
  return <Article content={content} />;
}

// ❌ Never render public content in Client Components
// "use client" — bad for SEO
```

### Static Generation

Use `generateStaticParams` for predictable content pages (blog posts, landing pages):

```typescript
export async function generateStaticParams() {
  const posts = await getBlogPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### HTTPS Only

Vercel enforces HTTPS automatically. No additional configuration required. All HTTP requests are redirected to HTTPS with 301 status.

### Mobile-First

Google uses mobile-first indexing. All pages MUST be mobile-responsive. Test with:

```bash
npx lighthouse https://twallet.app --preset=desktop
npx lighthouse https://twallet.app --preset=desktop --screenEmulation.mobile
```

### Page Speed

See Book 25 for performance targets. Key SEO-relevant targets:

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FCP | < 1.5s |
| INP | < 200ms |
| TTFB | < 800ms |
| Mobile speed score | 90+ |

## Route Organization

```text
src/app/
├── (marketing)/          # SEO-indexed pages (server components)
│   ├── page.tsx            # Homepage
│   ├── pricing/page.tsx
│   ├── security/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── help/page.tsx
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Blog post
│   └── partners/page.tsx
├── (auth)/               # Auth pages (noindex)
├── app/                  # Customer dashboard (noindex)
└── admin/                # Admin portal (noindex)
```
