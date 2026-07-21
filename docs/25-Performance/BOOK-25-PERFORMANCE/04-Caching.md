# Caching Strategy

## Cache Layers

| Layer | Mechanism | TTL | Invalidation |
|-------|-----------|-----|--------------|
| CDN (Vercel Edge) | Full-page cache | Varies by route | On-demand revalidation |
| ISR | Static regeneration | 60s–1 hour | `revalidatePath()` |
| React Cache | Request memoization | Per request | Automatic |
| Browser | `Cache-Control` headers | Varies by asset | Versioned URLs |
| Supabase | Database cache (shared buffers) | Automatic | Automatic |

## Cacheable Content

| Content | Cache | TTL | Strategy |
|---------|-------|-----|----------|
| Landing pages | CDN + Browser | 1 hour | ISR with `revalidate: 3600` |
| Public assets | CDN + Browser | 1 year | Versioned filenames |
| Countries list | React Cache | Per request | Static data |
| Card catalog | CDN + React Cache | 1 hour | ISR + `revalidate: 3600` |
| Supported networks | React Cache | Per request | Static data |
| System settings | React Cache | 5 minutes | Selective revalidation |
| Pricing | CDN | 1 hour | ISR |

## Do NOT Cache

| Content | Reason |
|---------|--------|
| Authentication pages | Session-specific |
| Wallet data | User-specific, real-time |
| Payments | Freshness critical |
| Orders | User-specific |
| Admin operations | Security-sensitive |
| Audit logs | Append-only immutable |

## Implementation

### ISR for Public Pages

```typescript
// src/app/(marketing)/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const cards = await getCardCatalog(); // Cached
  const networks = await getSupportedNetworks(); // Cached
  return <MarketingPage cards={cards} networks={networks} />;
}
```

### On-Demand Revalidation

```typescript
// After updating card catalog in admin
'use server';
import { revalidatePath } from 'next/cache';

export async function updateCardCatalog(data: FormData) {
  // ... persistence
  revalidatePath('/'); // Revalidate marketing pages
  revalidatePath('/app/cards'); // Revalidate card listing
}
```

### React Cache for Request Memoization

```typescript
import { cache } from 'react';

export const getCardCatalog = cache(async () => {
  return db`SELECT * FROM card_products WHERE active = true ORDER BY price ASC`;
});

export const getSupportedNetworks = cache(async () => {
  return db`SELECT * FROM supported_networks WHERE active = true ORDER BY name ASC`;
});
```

### Cache Headers (Vercel)

```typescript
// vercel.json or next.config
// Vercel automatically optimizes cache headers
// For custom cache behavior on specific routes:
export async function GET() {
  const data = await getStaticData();
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
```
