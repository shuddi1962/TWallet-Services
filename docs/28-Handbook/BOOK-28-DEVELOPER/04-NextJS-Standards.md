# Next.js Standards

## App Router

All routes MUST use the App Router (`src/app/`). No Pages Router.

```typescript
// ✅ App Router
// src/app/dashboard/page.tsx
export default function DashboardPage() { ... }

// ❌ Never use Pages Router
// src/pages/dashboard.tsx — DO NOT USE
```

## Server Actions

All mutations MUST use Server Actions. No client-side fetch to API routes for mutations.

```typescript
// ✅ Server Action
'use server';
export async function createOrder(formData: FormData) {
  const data = validateFormData(formData);
  await db.insert(orders).values(data);
  revalidatePath('/app/orders');
}

// ✅ Used in a Client Component
'use client';
export function OrderForm() {
  return (
    <form action={createOrder}>
      <input name="cardType" />
      <button type="submit">Order</button>
    </form>
  );
}
```

## Metadata API

Every public page MUST export metadata. Use `generateMetadata` for dynamic metadata.

```typescript
// ✅ Static metadata
export const metadata: Metadata = {
  title: 'Pricing — TWallet Card',
  description: 'Choose the perfect card plan.',
};

// ✅ Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return { title: `${post.title} — TWallet Blog`, description: post.excerpt };
}
```

## Streaming & Suspense

Wrap slow data-fetching sections in `<Suspense>` with skeleton fallbacks.

```typescript
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

## Dynamic Imports

Import heavy components dynamically, especially those that should not be server-rendered.

```typescript
const Chart = dynamic(() => import('@/components/ui/chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-80" />,
});
```

## Image Component

Always use `next/image` for images. Never use `<img>` directly.

```typescript
import Image from 'next/image';

// ✅ Correct
<Image src="/hero.webp" alt="Hero" width={1200} height={600} priority />

// ❌ Wrong
<img src="/hero.webp" alt="Hero" />
```

## Font Optimization

Use `next/font` for all fonts.

```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
```

## Route Groups

Use route groups to organize routes without affecting URL structure.

```typescript
src/app/
├── (marketing)/     # URL: /, /pricing, /blog
├── (auth)/          # URL: /login, /signup
├── app/             # URL: /app/dashboard
└── admin/           # URL: /admin/dashboard
```

## Middleware

Use middleware for authentication checks and redirects only. Keep it lightweight.

```typescript
export async function middleware(req: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}
```
