# Smoke Tests — TWallet Services

Run these smoke tests after every production deployment (≈ 15 min).

## Critical Paths

```
1.  Visit landing page          → Page loads, assets render
2.  Navigate to /cards          → Products displayed
3.  Click "Get Started"         → Redirect to /auth/register
4.  Register new account        → Verification sent
5.  Login                       → Dashboard loads
6.  Connect wallet (mock)       → Wallet shown
7.  Create order                → Order created, pending
8.  Verify payment (mock)       → Order status = paid
9.  View order details          → All info displayed
10. Open support ticket         → Ticket created
11. Admin login                 → Admin dashboard loads
12. View orders (admin)         → Orders table renders
13. Update order status         → Status changed
14. Logout                      → Redirect to /
```

## Quick Verification

```bash
# Health check
curl -I https://twalletservices.com

# API health
curl https://twalletservices.com/api/health

# Auth check
curl -I https://twalletservices.com/auth/login

# Admin route protection
curl -I https://twalletservices.com/admin (expect 401)
```

## Post-Deploy Monitoring (30 min)

- Sentry: no critical errors
- Vercel Analytics: no 5xx spikes
- Supabase Logs: no auth failures above baseline
- Uptime: all endpoints responding
