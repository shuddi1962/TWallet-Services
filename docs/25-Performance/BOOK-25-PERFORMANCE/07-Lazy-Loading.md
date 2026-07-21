# Lazy Loading

## What to Lazy Load

| Component | Trigger | Method |
|-----------|---------|--------|
| Charts | Scroll into view / Tab switch | `dynamic()` + `ssr: false` |
| Admin pages | Role-based access | Route-level code splitting |
| Support modules | User opens support section | `dynamic()` + `ssr: false` |
| Large modals/dialogs | Button click | `dynamic()` |
| Documentation | User clicks help/tutorial | `dynamic()` |
| Analytics scripts | After initial page load | `requestIdleCallback` |
| Images below fold | Intersection Observer | `loading="lazy"` |
| Heavy animations | Intersection Observer | Scroll-triggered |
| Third-party widgets | After interaction | Deferred load |

## Implementation

### Component Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Charts — defer until needed
const MonthlyChart = dynamic(
  () => import('@/components/charts/monthly-chart'),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> },
);

// Admin-only components
const UserImpersonationPanel = dynamic(
  () => import('@/components/admin/impersonation-panel'),
  { ssr: false },
);

// Large third-party dependencies
const QRCode = dynamic(
  () => import('@/components/ui/qr-code'),
  { loading: () => <div className="h-48 w-48 bg-gray-100 rounded" /> },
);
```

### Route-Level Lazy Loading

Next.js App Router automatically lazy-loads routes. Admin routes are loaded only when accessing `/admin/*`:

```typescript
// src/app/admin/layout.tsx — only loaded for admin users
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    redirect('/app/dashboard');
  }
  return <>{children}</>;
}
```

### Image Lazy Loading

```typescript
// Next/Image uses loading="lazy" by default
<Image
  src="/images/card-showcase.png"
  alt="Card showcase"
  width={600}
  height={400}
  loading="lazy" // Default for images without priority
/>
```

### Script Lazy Loading

```typescript
// Defer third-party scripts
<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload" // Load after page becomes interactive
/>

// Or use requestIdleCallback
if (typeof window !== 'undefined') {
  requestIdleCallback(() => {
    import('@/lib/analytics').then((mod) => mod.init());
  });
}
```

## Benefits

- Faster initial page loads (less JS to parse/execute)
- Reduced bandwidth usage
- Better Core Web Vitals (lower LCP, lower INP)
- Improved user experience on slow connections
