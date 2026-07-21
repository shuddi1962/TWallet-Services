# Metadata Strategy

## Required Metadata

Every public page MUST include:

| Field | Requirement | Example |
|-------|-------------|---------|
| `title` | Required, unique per page | "TWallet Card — Premium Virtual Card Platform" |
| `description` | Required, 150–160 chars | "Order a virtual crypto-funded card in minutes. Connect your wallet, pay with crypto, and spend anywhere." |
| `keywords` | Recommended | "crypto card, virtual card, web3 payments, bitcoin debit card" |
| `canonical` | Auto-generated | `https://twallet.app/pricing` |
| `robots` | Required | `index, follow` or `noindex, nofollow` |
| `openGraph` | Required | See `03-OpenGraph.md` |
| `twitter` | Required | See `03-OpenGraph.md` |

## Metadata Implementation

```typescript
// src/app/(marketing)/pricing/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — TWallet Card',
  description:
    'Choose the perfect card plan. No hidden fees, transparent pricing, and instant crypto conversion.',
  keywords: ['crypto card pricing', 'virtual card fees', 'web3 card plans'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://twallet.app/pricing' },
  openGraph: {
    title: 'Pricing — TWallet Card',
    description: 'Choose the perfect card plan. No hidden fees.',
    url: 'https://twallet.app/pricing',
    siteName: 'TWallet Services',
    images: [{ url: '/og/pricing.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — TWallet Card',
    description: 'Choose the perfect card plan. No hidden fees.',
    images: ['/og/pricing.png'],
  },
};
```

## Default Metadata (Root Layout)

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'TWallet Card — Crypto-Funded Virtual Cards',
    template: '%s — TWallet Card',
  },
  description:
    'The non-custodial crypto card platform. Connect your wallet, pay with crypto, spend anywhere.',
  metadataBase: new URL('https://twallet.app'),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};
```

## Noindex Pages

```typescript
// src/app/app/layout.tsx — Customer dashboard
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// src/app/admin/layout.tsx — Admin portal
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// src/app/(auth)/layout.tsx — Auth pages
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

## Dynamic Metadata

```typescript
// src/app/(marketing)/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  return {
    title: `${post.title} — TWallet Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://twallet.app/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.ogImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}
```
