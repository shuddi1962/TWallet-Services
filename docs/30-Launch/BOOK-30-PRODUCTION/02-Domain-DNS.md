# Domain & DNS

## Production Domain

| Field | Value |
|-------|-------|
| Primary domain | `twalletservices.com` |
| WWW redirect | `www.twalletservices.com` → `twalletservices.com` |

## Subdomains

| Subdomain | Purpose | Target |
|-----------|---------|--------|
| `twalletservices.com` | Main application | Vercel |
| `www.twalletservices.com` | WWW redirect | CNAME to Vercel |
| `admin.twalletservices.com` (future) | Admin portal | Vercel |
| `api.twalletservices.com` (future) | API | Vercel |
| `status.twalletservices.com` (future) | Status page | Better Stack |

## DNS Configuration

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `twalletservices.com` | A | `76.76.21.21` (Vercel) | 300 |
| `www.twalletservices.com` | CNAME | `cname.vercel-dns.com` | 300 |
| `_vercel.twalletservices.com` | TXT | `vc-domain-verify=...` | 300 |

## SSL

| Setting | Value |
|---------|-------|
| SSL provider | Automatic via Vercel (Let's Encrypt) |
| HSTS | Enabled, `max-age=63072000; includeSubDomains; preload` |
| TLS version | TLS 1.2+ |

## DNS Provider

| Field | Value |
|-------|-------|
| DNS provider | Cloudflare (recommended) |
| Proxy | Cloudflare proxied (orange cloud) for DDoS protection |
| CDN | Cloudflare global edge |

## Verification Steps

```bash
# DNS propagation check
nslookup twalletservices.com

# SSL certificate check
curl -I https://twallet services.com

# HSTS header check
curl -s -D- https://twalletservices.com | grep -i strict-transport-security

# Vercel deployment check
curl -I https://twalletservices.com/api/health
```
