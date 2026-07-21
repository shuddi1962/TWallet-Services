# Robots.txt

## Rules

```text
User-agent: *
Allow: /
Allow: /pricing
Allow: /security
Allow: /about
Allow: /contact
Allow: /help
Allow: /faq
Allow: /privacy
Allow: /terms
Allow: /blog
Allow: /blog/*
Allow: /partners
Allow: /developers

Disallow: /app/
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Disallow: /_next/

Sitemap: https://twallet.app/sitemap.xml
```

## Implementation

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/security', '/about', '/contact', '/help', '/faq', '/privacy', '/terms', '/blog', '/partners', '/developers'],
        disallow: ['/app/', '/admin/', '/auth/', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://twallet.app/sitemap.xml',
  };
}
```

## Exclusions Explained

| Path | Reason |
|------|--------|
| `/app/` | Customer dashboard — user-specific data |
| `/admin/` | Admin portal — internal operations |
| `/auth/` | Authentication pages — no content value |
| `/api/` | API endpoints — not user-facing |
| `/_next/` | Next.js internals — not user-facing |
