# Vercel

## Configuration

```json
{
  "vercel.json"
}
```

## Key Features

| Feature | Usage |
|---------|-------|
| Edge Network | Global CDN — static assets + API responses at edge |
| Image Optimization | Automatic WebP, resize, lazy loading via next/image |
| Serverless Functions | API routes + Server Actions auto-scaled |
| Edge Functions | Middleware (session, headers) at edge locations |
| Analytics | Web Vitals, traffic, function duration (built-in) |
| Preview Deployments | Every PR gets unique URL with branch Supabase |
| Automatic SSL | Let's Encrypt certificates, auto-renewal |
| Compression | Brotli + Gzip (automatic) |
| Automatic Caching | Static pages cached at edge, ISR for dynamic |

## Vercel Configuration

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1", "hkg1", "lhr1"],
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
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Environment Variables in Vercel

| Scope | Where Set |
|-------|-----------|
| Production | Vercel Dashboard → Project → Environment Variables |
| Preview | Same (with different values) |
| Development | `.env.local` (not committed) |

## Performance Monitoring

- **Web Vitals:** Built-in Vercel Analytics
- **Edge Function Logs:** Vercel Functions dashboard
- **Error Tracking:** Integrates with Sentry
