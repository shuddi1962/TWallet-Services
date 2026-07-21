# Security Headers — TWallet Services

> Full specification in `21-Security/BOOK-21-SECURITY/10-Security-Headers.md`

## Production Headers

| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.walletconnect.org wss://*.walletconnect.org https://*.alchemy.com; frame-src 'self' https://*.walletconnect.org; object-src 'none'; base-uri 'self'; form-action 'self';` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |

## Verification

```bash
curl -I https://twalletservices.com | grep -i "security\|csp\|hsts"
```

## Policy Review

Headers reviewed quarterly. CSP updated when new third-party integrations are added.
