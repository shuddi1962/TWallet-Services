# Security Headers

## Header Catalog

All headers applied via Vercel `vercel.json` or Next.js `next.config.js` middleware.

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | See below | Prevent XSS, data injection |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Enforce HTTPS |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict APIs |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |

## Content-Security-Policy

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.walletconnect.org wss://*.walletconnect.org https://*.alchemy.com;
frame-src 'self' https://*.walletconnect.org;
object-src 'none';
base-uri 'self';
form-action 'self';
```

## Vercel Configuration

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "..." },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## Security Headers Checklist

| Header | Status |
|--------|--------|
| Content-Security-Policy | Implemented |
| Strict-Transport-Security | Implemented |
| X-Frame-Options | Implemented |
| X-Content-Type-Options | Implemented |
| Referrer-Policy | Implemented |
| Permissions-Policy | Implemented |
