# Open Graph & Social Sharing

## Required Cards

| Platform | Card Type | Size | Notes |
|----------|-----------|------|-------|
| Open Graph | `og:image` | 1200×630 | Used by Facebook, LinkedIn, Discord |
| Twitter Card | `summary_large_image` | 1200×600 | Used by X/Twitter |
| Telegram | Inline preview | 1200×630 | Uses Open Graph |
| Discord | Link preview | 1200×630 | Uses Open Graph |

## Social Preview Image Template

All social preview images follow this layout:

```
┌──────────────────────────────────────┐
│                                      │
│   [Logo]        [Tagline]            │
│                                      │
│         ┌──────────────────┐         │
│         │   Card Mockup    │         │
│         └──────────────────┘         │
│                                      │
│   Main Headline                      │
│   CTA Text                           │
│                                      │
└──────────────────────────────────────┘
  1200 × 630 px
```

## Generating OG Images

Use `@vercel/og` (Satori) for dynamic OG image generation:

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'TWallet Card';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: 'white',
          fontFamily: 'Inter',
        }}
      >
        <img
          src="https://twallet.app/logo-white.svg"
          width={120}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <h1 style={{ fontSize: 60, textAlign: 'center', margin: '0 40px' }}>{title}</h1>
        <p style={{ fontSize: 24, opacity: 0.8, marginTop: 20 }}>twallet.app</p>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

## Route-Specific OG Images

Each major route has a dedicated OG image template:

| Route | OG Endpoint | Dynamic Fields |
|-------|-------------|----------------|
| Homepage | `/api/og?title=...` | Title, tagline |
| Pricing | `/api/og/pricing` | Plan name, price |
| Blog | `/api/og/blog?slug=...` | Title, author, date |
| Features | `/api/og/features` | Feature name |
| Default | `/api/og` | Generic brand image |

## Implementing OG Metadata

```typescript
// src/app/(marketing)/page.tsx
export const metadata: Metadata = {
  openGraph: {
    title: 'TWallet Card — Crypto-Funded Virtual Cards',
    description: 'The non-custodial crypto card platform.',
    url: 'https://twallet.app',
    siteName: 'TWallet Services',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TWallet Card — Crypto-Funded Virtual Cards',
    description: 'The non-custodial crypto card platform.',
    images: ['/api/og'],
  },
};
```
