# Authentication

## Provider

Supabase Auth (GoTrue) — built-in support for email/password, magic links, OAuth, and future MFA.

## Requirements

| Requirement | Implementation |
|-------------|----------------|
| Email verification | Required before accessing protected routes |
| Strong password policy | Min 8 chars, uppercase + lowercase + number + special |
| JWT sessions | Access token (1h) + Refresh token (30d) rotation |
| Secure cookies | HttpOnly, Secure, SameSite=Lax for auth cookies |
| Session expiration | Auto-logout after 24h inactivity |
| Password reset | Token-based reset link, expires in 1h |
| Rate limiting | 5 attempts per email per 15 min (Supabase Auth) |
| MFA (future) | TOTP via authenticator app |
| Passkeys (future) | WebAuthn for passwordless auth |
| Wallet sign-in (future) | SIWE (Sign-In with Ethereum) |

## Flow

```
1. User submits email + password
2. Supabase Auth validates credentials (rate-limited)
3. Server creates session: access token (1h) + refresh token
4. @supabase/ssr middleware refreshes tokens on each request
5. Logout clears both cookies and invalidates session
```

## Supabase Auth Configuration

| Setting | Value |
|---------|-------|
| SITE_URL | Production URL |
| Redirect URLs | Whitelist of valid callback URLs |
| Email confirmations | Enabled |
| Password min length | 8 |
| Password requirements | Upper + Lower + Number + Special |
| Session duration | 24 hours |
| Token refresh | Every request (auto via middleware) |

## Implementation

Auth routes: `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/forgot-password`, `/auth/reset-password`

Middleware: `src/middleware.ts` — route protection with `@supabase/ssr`
