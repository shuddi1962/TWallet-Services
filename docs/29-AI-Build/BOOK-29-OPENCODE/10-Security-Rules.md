# Security Rules

## Non-Negotiable Rules

| Rule | Enforcement |
|------|-------------|
| Never store private keys | Platform never holds user private keys |
| Never request recovery phrases | No input field anywhere requests seed phrases |
| Never trust client input | Server validates everything via Zod |
| RLS on every table | Every database table MUST have Row Level Security |
| Never expose stack traces | User-facing errors are friendly messages |
| Never expose service_role key | Server-side only |
| Never disable CSP | Content Security Policy with WalletConnect allowlist |

## Security Checklist (Every Feature)

| Check | Description |
|-------|-------------|
| Input validation | All input validated with Zod schema |
| SQL injection | Parameterized queries only |
| RLS bypass test | Can user access data they shouldn't? |
| Authentication | Is the user authenticated? |
| Authorization | Does the user have the correct role? |
| Secrets exposure | Are any secrets exposed to client? |
| XSS prevention | User content properly escaped |
| CSRF protection | Mutations use Server Actions |
| Rate limiting | Endpoints rate-limited |
| HTTPS | Enforced by Vercel |
| Secure cookies | `httpOnly`, `secure`, `sameSite: lax` |

## Common Vulnerabilities

### SQL Injection

```typescript
// ❌ Vulnerable
await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Safe — parameterized
await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

### XSS

```typescript
// ❌ Vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe — React escapes by default
<div>{userInput}</div>
```

### IDOR (Insecure Direct Object Reference)

```typescript
// ❌ Vulnerable — no ownership check
const order = await db`SELECT * FROM orders WHERE id = ${orderId}`;

// ✅ Safe — RLS enforces ownership
const order = await supabase.from('orders').select().eq('id', orderId).single();
// RLS policy: user_id = auth.uid()
```

### Secrets Exposure

```typescript
// ❌ Never expose server keys to client
process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = '...';

// ✅ Only anon key is public
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '...';
// Service role key stays server-side
process.env.SUPABASE_SERVICE_ROLE_KEY = '...';
```

## Environment Variables

```typescript
// ✅ Client-safe (NEXT_PUBLIC_ prefix)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ✅ Server-only (no prefix)
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
```

## Security Headers

Implemented via Vercel or `next.config.ts`:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restrict scripts, allow WalletConnect |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=()` |
