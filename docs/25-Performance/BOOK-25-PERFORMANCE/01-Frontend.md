# Frontend Performance

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Interaction to Next Paint (INP) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to First Byte (TTFB) | < 800ms |

## Optimization Techniques

### React Server Components (RSC)

Use Server Components by default for all public and data-fetching pages. Only use Client Components (`"use client"`) when interactivity, browser APIs, or React hooks are required.

**Rule of thumb:** If a component doesn't need `useState`, `useEffect`, `onClick`, or browser APIs, keep it a Server Component.

### Streaming & Suspense

Wrap slow data-fetching sections with `<Suspense>` and streaming boundaries:

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { TransactionHistory } from './transaction-history';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <TransactionHistory />
      </Suspense>
    </div>
  );
}
```

### Server Actions

Use Server Actions for mutations (form submissions, button clicks that modify data). This avoids client-side JavaScript bundles for API calls and reduces round-trips.

```typescript
// Server Action (always server-side)
'use server';

export async function createOrder(formData: FormData) {
  // Validate, persist, return result
}
```

### Route Groups

Organize routes to enable efficient layout sharing and code splitting:

```text
src/app/
├── (marketing)/     # Static landing pages
├── (auth)/          # Login, signup, callbacks
├── app/             # Customer dashboard (requires auth)
└── admin/           # Admin portal (requires admin role)
```

### Dynamic Imports

Import heavy components on demand:

```typescript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/ui/chart'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200 rounded" />,
});
```

### Memoization

Use `React.memo`, `useMemo`, and `useCallback` judiciously — only when profiling shows a performance benefit. Premature memoization adds complexity without measurable gain.

```typescript
import { memo } from 'react';

export const WalletCard = memo(function WalletCard({ address, balance }: Props) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-gray-500">{address}</p>
      <p className="text-2xl font-bold">{balance} ETH</p>
    </div>
  );
});
```

### Font Optimization

Load fonts via `next/font` to ensure self-hosted, optimized font delivery with automatic subsetting:

```typescript
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });
```

### Image Optimization

See `05-Images.md` for full image optimization strategy.

## Key Rules

- Default to Server Components; only use Client Components when necessary
- Wrap slow sections in `<Suspense>` with skeleton fallbacks
- Use Server Actions for all mutations
- Prefer `next/link` for client-side navigation (prefetches on viewport)
- Keep Client Component bundles small by hoisting Server Components as children
