# Page Rules

## Every Page MUST Include

| Requirement | Description |
|-------------|-------------|
| Metadata | `metadata` export (or `generateMetadata`) for SEO |
| Loading state | `loading.tsx` or `<Suspense>` with skeleton |
| Error boundary | `error.tsx` or error handling in Server Actions |
| Empty state | Meaningful message when no data |
| Responsive | Mobile-first, tested at all breakpoints |
| SEO ready | Public pages: metadata, OG, structured data |
| Accessible | WCAG 2.1 AA, keyboard navigation, landmarks |
| Optimized images | Next/Image with WebP, sizes, lazy loading |
| Server Component | Default — only client when necessary |

## Page File Structure

```text
src/app/{route}/
├── page.tsx           # Main page (Server Component)
├── loading.tsx        # Loading skeleton
├── error.tsx          # Error boundary
├── layout.tsx         # Route-specific layout (optional)
└── not-found.tsx      # 404 for dynamic routes (optional)
```

## Page Patterns

### Public Pages (SEO-indexed)

```typescript
// Server Component with full metadata
export const metadata: Metadata = {
  title: 'Page Title — TWallet Card',
  description: 'Page description for SEO',
  openGraph: { ... },
  twitter: { ... },
};

export default async function PublicPage() {
  const data = await getData();
  return <PageComponent data={data} />;
}
```

### Dashboard Pages (Authenticated)

```typescript
export default async function DashboardPage() {
  const user = await getCurrentUser(); // Server-side auth check

  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <TransactionHistory userId={user.id} />
      </Suspense>
    </div>
  );
}
```

### Admin Pages (Admin role)

```typescript
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    redirect('/app/dashboard');
  }

  return <AdminDashboard />;
}
```

## Loading States

Every page that fetches data MUST have a loading state:

```typescript
// loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-200 rounded-xl" />
      <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
  );
}
```

## Error Boundaries

Every page MUST handle errors gracefully:

```typescript
// error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-500 mb-6">Please try again or contact support.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```
