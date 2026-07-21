# Security Checklist

## Pre-Launch Security Verification

### Infrastructure

- [ ] HTTPS enforced (Vercel default)
- [ ] HSTS enabled (`max-age=63072000; includeSubDomains; preload`)
- [ ] Content Security Policy configured with WalletConnect allowlist
- [ ] Rate limiting active on all API endpoints
- [ ] DDoS protection active (Cloudflare)

### Application

- [ ] All user input validated with Zod
- [ ] All database queries use parameterized queries
- [ ] RLS enabled on every table — verified with tests
- [ ] No secrets exposed in client-side code
- [ ] No console errors or warnings in production
- [ ] Error pages do not expose stack traces
- [ ] Authentication required for all `/app/*` routes
- [ ] Admin role required for all `/admin/*` routes

### Authentication

- [ ] Password minimum length enforced
- [ ] Email verification required
- [ ] Session expiry configured (7 days)
- [ ] Rate limiting on login attempts
- [ ] No session fixation vulnerabilities
- [ ] Secure cookies (`httpOnly`, `secure`, `sameSite: lax`)

### Wallet

- [ ] Platform never requests private keys or seed phrases
- [ ] Platform never signs or broadcasts transactions
- [ ] WalletConnect SDK uses production Project ID
- [ ] Only supported networks are allowed
- [ ] Network switching is user-initiated only

### Payments

- [ ] On-chain verification required before marking order paid
- [ ] Payment verification checks: correct address, amount, chain, confirmations, used status
- [ ] Double-spend protection active
- [ ] Failed payments logged and monitored
- [ ] Manual override requires super_admin role + audit trail

### Data

- [ ] PII encrypted at rest
- [ ] Personal data accessible only to authorized roles
- [ ] Data retention policy documented and enforced
- [ ] Audit logging active for all sensitive operations
- [ ] Data export feature available
- [ ] Account deletion feature available

### Dependencies

- [ ] `npm audit` passes with no critical vulnerabilities
- [ ] All dependencies up to date
- [ ] No deprecated packages in use
- [ ] Lockfile verified (no unexpected changes)
- [ ] Dependabot configured for automated security updates

## Monthly Security Review

- [ ] Review access logs for unusual activity
- [ ] Review rate limit hits
- [ ] Review failed authentication attempts
- [ ] Review Sentry error patterns
- [ ] Verify backup integrity
- [ ] Review dependency updates
- [ ] Rotate secrets (quarterly)

## Incident Response

See `10-Incident-Response.md` and `ops/INCIDENT_LOG.md` for security incident procedures.
