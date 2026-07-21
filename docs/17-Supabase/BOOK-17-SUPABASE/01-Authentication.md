# Authentication

> Supabase Auth configuration for TWallet Services. Provider-managed authentication with JWT sessions.

---

## Provider

| Feature | Value |
|---------|-------|
| Provider | Supabase Auth |
| Method | Email + Password (primary) |
| Future | Google OAuth, GitHub OAuth, Wallet Sign-In (SIWE) |

---

## Configuration

### Settings (Supabase Dashboard → Authentication → Settings)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Email confirmations | ON | Require verified email to log in |
| Secure email change | ON | Require old email confirmation |
| Min password length | 8 | Security baseline |
| Password strength | Required: uppercase, number | Prevents weak passwords |
| Session duration | 24 hours (86400s) | Balance UX + security |
| Refresh token reuse interval | 3600s | Leak protection |

### Redirect URLs

| URL | Purpose |
|-----|---------|
| `https://twalletservices.com/auth/callback` | Auth callback |
| `https://twalletservices.com/auth/verify` | Email verification |
| `https://twalletservices.com/auth/reset-password` | Password reset |
| `http://localhost:3000/auth/callback` | Local development |

---

## Implementation

### Server Client

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options));
        },
      },
    }
  );
}
```

### Admin Client (Service Role)

```ts
// src/lib/supabase/admin.ts — SERVER ONLY
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

### Browser Client

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Middleware

```ts
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes
  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (user && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/app', request.url));
  }
  return supabaseResponse;
}
```

---

## User Registration Flow

```
1. User submits email + password → supabase.auth.signUp()
2. Supabase creates user + sends verification email (Resend template)
3. User clicks verify link → email_verified = true
4. Trigger: handle_new_user() creates profile row
5. User redirected to login
```

---

## Session Management

| Concept | Implementation |
|---------|---------------|
| Token storage | HTTP-only secure cookies (Supabase SSR) |
| Token refresh | Automatic via `@supabase/ssr` cookie management |
| Session check | `supabase.auth.getUser()` in middleware + server components |
| Logout | `supabase.auth.signOut()` → clears cookies |
| Multi-device | Each device has independent session |

---

## Future Auth Methods

| Method | Priority | Notes |
|--------|----------|-------|
| Google OAuth | Phase 2 | Supabase built-in provider |
| GitHub OAuth | Phase 2 | Developer-friendly |
| Wallet Sign-In (SIWE) | Phase 2 | Sign message with wallet → authenticate |
| Magic Link | Phase 3 | Passwordless email login |

---

## Email Templates (Resend)

| Template | Trigger | Variables |
|----------|---------|-----------|
| Welcome + Verify | Sign up | {{name}}, {{verify_url}} |
| Password Reset | Forgot password | {{name}}, {{reset_url}} |
| Login Alert | New device login | {{name}}, {{ip}}, {{time}} |
