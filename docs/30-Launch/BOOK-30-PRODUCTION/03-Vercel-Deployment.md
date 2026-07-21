# Vercel Production Deployment

## Deployment Configuration

```json
// vercel.json
{
  "regions": ["iad1"],
  "public": false,
  "github": {
    "silent": true,
    "autoJobCancelation": true
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "..." },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ],
  "redirects": [
    { "source": "/app", "destination": "/app/dashboard", "permanent": true }
  ]
}
```

## Production Environment Variables

Set in Vercel Dashboard → Project → Settings → Environment Variables.

| Variable | Environment | Secret |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Yes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Production | No |
| `RESEND_API_KEY` | Production | Yes |
| `NEXT_PUBLIC_APP_URL` | Production | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | No |
| `SENTRY_AUTH_TOKEN` | Production | Yes |

## Deployment Process

```text
1. Merge PR to main
2. GitHub Actions runs:
   - lint → typecheck → test → build
3. Vercel auto-deploys main branch
4. Vercel runs:
   - Build (npm run build)
   - Deploy to production
5. Post-deploy:
   - Run smoke tests
   - Verify /api/health
   - Verify /api/ready
   - Check Sentry for new errors
```

## Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Or promote a previous deployment
vercel promote <deployment-id>
```

## Verification

After deployment, verify:

- [ ] Homepage loads (200 OK)
- [ ] Dashboard loads (authenticated)
- [ ] Admin loads (admin role)
- [ ] API health endpoints respond
- [ ] Wallet connection works
- [ ] Card ordering works
- [ ] Crypto payment works
- [ ] All images load correctly
- [ ] No console errors
- [ ] Sentry not capturing new errors
