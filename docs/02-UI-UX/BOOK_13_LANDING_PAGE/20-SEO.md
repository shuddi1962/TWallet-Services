# 20 — SEO

> Complete SEO specification for the landing page.

## Purpose

Ensure the landing page ranks well in search engines and looks great when shared on social media.

## Meta Tags

```ts
// src/app/(public)/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TWallet Services | Secure Crypto Card Platform',
  description: 'Order premium crypto-powered virtual and physical cards, connect your wallet securely, pay with cryptocurrency, and manage everything through your dashboard.',
  keywords: [
    'crypto card',
    'bitcoin card',
    'crypto debit card',
    'non-custodial card',
    'TWallet',
    'crypto payment',
    'wallet card',
    'virtual crypto card',
    'physical crypto card',
    'Web3 card',
  ],
  authors: [{ name: 'TWallet Services' }],
  creator: 'TWallet Services',
  publisher: 'TWallet Services',
  metadataBase: new URL('https://twalletservices.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://twalletservices.com/',
    siteName: 'TWallet Services',
    title: 'TWallet Services | Secure Crypto Card Platform',
    description: 'Order premium crypto-powered virtual and physical cards, connect your wallet securely, pay with cryptocurrency, and manage everything through your dashboard.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TWallet Services — Secure Crypto Card Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TWallet Services | Secure Crypto Card Platform',
    description: 'Order premium crypto-powered cards, connect your wallet, pay with crypto.',
    images: ['/og-image.png'],
    creator: '@twalletservices',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};
```

## JSON-LD Structured Data

### Organization Schema
```ts
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TWallet Services',
  url: 'https://twalletservices.com',
  logo: 'https://twalletservices.com/logo.png',
  description: 'Non-custodial crypto card platform. Connect your wallet, order a card, pay with crypto.',
  sameAs: [
    'https://twitter.com/twalletservices',
    'https://github.com/twalletservices',
    'https://linkedin.com/company/twalletservices',
  ],
};
```

### WebSite Schema
```ts
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TWallet Services',
  url: 'https://twalletservices.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://twalletservices.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};
```

### FAQPage Schema
```ts
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
```

### Implementation
```tsx
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Page content */}
    </>
  );
}
```

## Sitemap

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://twalletservices.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://twalletservices.com/how-it-works', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://twalletservices.com/cards', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://twalletservices.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://twalletservices.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://twalletservices.com/security', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://twalletservices.com/faq', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://twalletservices.com/support', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://twalletservices.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
```

## Robots.txt

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/app/', '/admin/', '/api/'],
    },
    sitemap: 'https://twalletservices.com/sitemap.xml',
  };
}
```

## Canonical URL

```html
<link rel="canonical" href="https://twalletservices.com/" />
```

Set via `alternates.canonical` in metadata (see above).

## Image SEO

| Image | Alt Text | Purpose |
|-------|----------|---------|
| Hero card | "TWallet Card — premium crypto-funded card" | Product visual |
| Dashboard preview | "TWallet customer dashboard — manage cards, wallets, and transactions" | Product preview |
| OG image | "TWallet Services — Secure Crypto Card Platform" (1200x630) | Social sharing |
| Network logos | "[Network name] logo" | Supported networks |
| Partner logos | "[Partner name] logo" | Trusted partners |

## Performance for SEO

| Factor | Target | Impact |
|--------|--------|--------|
| LCP | < 2.5s | Core Web Vital |
| CLS | < 0.1 | Core Web Vital |
| INP | < 200ms | Core Web Vital |
| TTFB | < 200ms | Crawl efficiency |
| Mobile-friendly | Yes | Mobile-first indexing |
| HTTPS | Yes | Ranking signal |
| Sitemap | Yes | Crawl coverage |
| Robots | Yes | Crawl guidance |
| Lighthouse | 95+ | Overall quality |

## Noindex Pages (NOT the landing page)

These pages must have `noindex` (they are NOT the landing page):
- `/auth/*` — noindex, nofollow
- `/app/*` — noindex, nofollow
- `/admin/*` — noindex, nofollow
- `/api/*` — noindex, nofollow

The landing page (`/`) and all public pages are `index, follow`.
