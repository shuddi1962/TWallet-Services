# Security Rules

## Non-Negotiable Rules

| Rule | Description |
|------|-------------|
| Never store private keys | The platform never holds user private keys |
| Never request seed phrases | No input field anywhere requests recovery phrases |
| RLS on every table | Every database table has Row Level Security |
| Never trust client validation | Server validates all input (Zod) |
| Never expose secrets | Service role keys, API secrets are server-side only |
| Validate all input | Every user input is validated with Zod |
| Always use HTTPS | Enforced by Vercel |
| Always use secure cookies | `httpOnly`, `secure`, `sameSite: 'lax'` |
| Use CSP headers | Content Security Policy with WalletConnect allowlist |
| Verify authorization | Every action checks user role and ownership |

## Security Checklist

### Before Merging

| Check | Description |
|-------|-------------|
| Input validation | Is all input validated with Zod? |
| SQL injection | Are queries using parameterized queries? |
| RLS bypass | Can a user access data they shouldn't? |
| Authentication | Is the user authenticated for protected routes? |
| Authorization | Does the user have the correct role? |
| Secrets exposure | Are any secrets exposed to the client? |
| CSP compatibility | Does the code work with the Content Security Policy? |
| XSS prevention | Is user content properly escaped? |
| CSRF protection | Are mutations protected against CSRF? |
| Rate limiting | Are endpoints rate-limited appropriately? |

## Common Vulnerabilities to Avoid

### SQL Injection

```typescript
// ❌ Vulnerable — string interpolation
await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Safe — parameterized query
await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

### XSS

```typescript
// ❌ Vulnerable — dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: user.bio }} />

// ✅ Safe — React escapes by default
<div>{user.bio}</div>

// ✅ Safe for markdown — use a sanitized renderer
<MarkdownRenderer content={sanitize(user.bio)} />
```

### Insecure Direct Object Reference (IDOR)

```typescript
// ❌ Vulnerable — no ownership check
export async function getOrder(orderId: string) {
  return db`SELECT * FROM orders WHERE id = ${orderId}`;
}

// ✅ Safe — ownership check via RLS
export async function getOrder(orderId: string, userId: string) {
  return db`SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${userId}`;
}
```

## Environment Variables

```typescript
// ✅ Client-safe env vars (prefixed with NEXT_PUBLIC_)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ✅ Server-only env vars
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ❌ Never expose server-only keys to client
// Do not: process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY
```

## Security Resources

- **Book 21 — Security & Compliance:** Complete security architecture
- **Book 21 — Threat Model:** STRIDE analysis
- **Book 21 — Incident Response:** Security incident runbook
- **security/:** Enterprise security documents
