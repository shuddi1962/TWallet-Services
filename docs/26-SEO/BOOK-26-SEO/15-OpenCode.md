# OpenCode: SEO & Marketing Architecture Build Instructions

## Requirements

- SEO-optimized pages with Next.js Metadata API
- Dynamic OG image generation (`@vercel/og`)
- JSON-LD structured data (Organization, Breadcrumb, FAQ, Article, Product)
- Auto-generated XML sitemap (`app/sitemap.ts`)
- Robots.txt with proper rules (`app/robots.ts`)
- Blog with pagination, categories, and ISR
- Conversion-optimized landing pages
- Marketing funnel tracking (PostHog)
- Transactional email templates (Resend)
- A/B testing framework
- Referral program infrastructure

## Implementation Files

```text
src/
├── app/
│   ├── layout.tsx              # Organization schema, default metadata
│   ├── robots.ts               # Dynamic robots.txt
│   ├── sitemap.ts              # Auto-generated XML sitemap
│   ├── api/og/route.tsx        # Dynamic OG image generation
│   ├── (marketing)/
│   │   ├── page.tsx            # Homepage
│   │   ├── pricing/page.tsx
│   │   ├── security/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── ...
│   └── (marketing)/layout.tsx  # Marketing layout with analytics
├── components/
│   ├── breadcrumb.tsx          # Breadcrumb + JSON-LD
│   └── providers/
│       └── analytics-provider.tsx
├── emails/
│   ├── welcome.tsx
│   ├── order-confirmation.tsx
│   └── ...
└── lib/
    ├── analytics.ts            # PostHog client
    └── email.ts                # Resend integration
```

## Verification Checklist

- [ ] Metadata API implemented on all public pages
- [ ] Canonical URLs on every page
- [ ] `noindex` on dashboard, admin, auth pages
- [ ] XML sitemap auto-generated and submitted
- [ ] Robots.txt blocking `/app/`, `/admin/`, `/auth/`, `/api/`
- [ ] Dynamic OG images generated via `@vercel/og`
- [ ] Organization schema on root layout
- [ ] Breadcrumb schema on all pages
- [ ] FAQ schema on FAQ page
- [ ] Article schema on blog posts
- [ ] Blog listing with pagination
- [ ] Blog posts use ISR with 1-hour revalidation
- [ ] Blog post URLs: `blog/[slug]`
- [ ] Landing pages follow conversion blueprint
- [ ] PostHog analytics integrated
- [ ] UTM parameter tracking implemented
- [ ] Transactional emails implemented (Resend)
- [ ] Lighthouse SEO score 100
- [ ] Zero structured data errors
- [ ] Mobile-friendly tested
- [ ] Marketing ready
