# Security

> Security measures for the TWallet Services platform. Every layer from database to browser.

---

## Security Layers

```
Browser → CSP → HTTPS → WAF (Vercel) → Next.js → Supabase → RLS → Encryption
```

---

## Row Level Security

- RLS enabled on **every** table (see 03-RLS.md)
- No table has a public SELECT policy unless explicitly required
- Service role key is **never** exposed to the client
- RLS policies use `auth.uid()` for user identification

---

## Parameterized Queries

All queries through Supabase client are automatically parameterized:

```ts
// SAFE: Supabase client auto-parameterizes
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);  // userId is a parameter, not interpolated

// NEVER: Raw SQL interpolation
await supabase.rpc('raw_sql', { query: `SELECT * FROM profiles WHERE id = '${userId}'` });  // DANGEROUS
```

---

## HTTPS Only

- All traffic over HTTPS (enforced by Vercel + Supabase)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- HTTP → HTTPS redirect in Vercel config (`vercel.json`)

---

## Secure Cookies

| Cookie | Attribute | Value |
|--------|-----------|-------|
| Supabase session | `HttpOnly` | true |
| | `Secure` | true (production) |
| | `SameSite` | `Lax` |
| | `Path` | `/` |
| | `Max-Age` | 86400 (24h) |

Managed automatically by `@supabase/ssr`.

---

## JWT Validation

- JWT issued by Supabase Auth
- Validated on every request via `supabase.auth.getUser()`
- Expired tokens rejected with 401
- Refresh token rotates automatically
- Token contains: `sub` (user ID), `email`, `aud`, `exp`, `iat`, `role`

---

## Rate Limiting

| Scope | Limit | Window | Enforced At |
|-------|-------|--------|-------------|
| Global API | 60 req | 1 min | Next.js middleware |
| Auth endpoints | 10 req | 1 min | Next.js middleware |
| Payment verification | 5 req | 1 min | Edge Function |
| File uploads | 10 req | 1 min | Server Action |
| Admin API | 120 req | 1 min | Next.js middleware |

---

## CSRF Protection

- Supabase tokens are sent via cookies (not URL parameters)
- `SameSite=Lax` prevents CSRF for GET requests
- For mutations: `SameSite` strict + custom header checks
- Next.js Server Actions have built-in CSRF protection

---

## CSP Headers

```ts
// next.config.js or middleware
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://*.walletconnect.org'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https://*.supabase.co'],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'https://*.walletconnect.org',
    'https://*.alchemy.com',
    'wss://*.supabase.co',
    'wss://*.walletconnect.org',
  ],
  'frame-src': ["'self'", 'https://*.walletconnect.org'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
};
```

---

## Audit Logging

- Every admin action logged to `audit_logs` (append-only)
- Audit log has no UPDATE or DELETE policies
- Fields: admin_id, action, target_type, target_id, details (JSONB), ip_address, created_at
- Immutable by design: once written, cannot be modified or deleted

---

## Encryption

| Layer | Method |
|-------|--------|
| At rest (database) | AES-256 (Supabase managed) |
| At rest (storage) | AES-256 (Supabase managed) |
| In transit | TLS 1.3 |
| Passwords | bcrypt (Supabase Auth) |
| JWT | HS256 |
| API keys | Stored as Supabase secrets |

---

## Data Privacy

- No PII in logs; user IDs used instead of emails
- Soft deletes only (no hard data removal)
- GDPR data export: `SELECT * FROM ... WHERE user_id = ?` (admin)
- GDPR erasure: anonymize profile data, soft delete
- 30-day recovery window before permanent deletion

---

## Security Monitoring

| Tool | Purpose |
|------|---------|
| Supabase advisors | Automated security checks after DDL |
| Sentry | Error tracking + performance monitoring |
| Supabase logs | API, Auth, Postgres query logs |
| Vercel analytics | Traffic monitoring, DDoS detection |
