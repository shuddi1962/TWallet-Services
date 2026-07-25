# Penetration Testing Plan

## Scope

| Target | URL | Method |
|--------|-----|--------|
| Production App | https://twalletservices.com | Black-box + Gray-box |
| API Endpoints | https://twalletservices.com/api/* | Gray-box |
| Admin Dashboard | https://twalletservices.com/admin/* | Authenticated Gray-box |
| Supabase Project | <project>.supabase.co | White-box (with credentials) |

### In Scope
- Authentication (login, signup, password reset, session management)
- Wallet connection flows (WalletConnect, injected wallets)
- Payment processing (crypto transaction submission, verification)
- Card ordering flow
- Admin panel access controls
- API rate limiting
- RLS policies on all database tables
- Edge function security (payment verification, webhook handlers)
- CSP and security headers
- XSS, CSRF, SQL injection, SSRF

### Out of Scope
- Physical security
- Social engineering
- Third-party services (Vercel, Supabase, Alchemy, Sentry, PostHog)
- End-user devices/wallet software

## Prerequisites

Before scheduling the test:

- [ ] All known security findings fixed (RLS, rate limiting, CSP)
- [ ] Sentry error tracking monitoring active
- [ ] `SUPABASE_SERVICE_ROLE_KEY` rotated after test
- [ ] Test accounts provisioned with known credentials
- [ ] Wallet test accounts funded with testnet tokens
- [ ] Staging environment available for destructive tests

## Test Cases

### Authentication
1. Brute force login — verify rate limiting kicks in after 5 attempts
2. Password reset token reuse — verify tokens are single-use
3. Session fixation — verify session ID changes after login
4. JWT manipulation — verify tampered tokens are rejected
5. Cookie security — verify `HttpOnly`, `Secure`, `SameSite` flags

### Wallet Connection
6. WalletConnect URI injection — verify malformed URIs rejected
7. Signature replay — verify nonces are checked server-side
8. Wallet address spoofing — verify address matches signature

### Payment Processing
9. Double-spend — verify order marked paid only after on-chain confirmation
10. Amount manipulation — verify submitted amount matches order amount
11. Wrong chain — verify chain ID validated against order
12. Stale transaction — verify tx older than 1h rejected
13. Replay protection — verify used tx hashes cannot be reused

### API Security
14. Rate limit bypass — verify X-Forwarded-For cannot bypass IP-based limits
15. Path traversal — verify `../` attempts blocked
16. SQL injection — verify query parameters sanitized
17. Mass assignment — verify unexpected fields rejected
18. IDOR — verify users cannot access other users' orders/payments

### Admin Panel
19. Privilege escalation — verify non-admins cannot access admin routes
20. Admin action audit — verify all state-changing actions logged
21. Service role key leakage — verify not exposed in client bundles

### RLS Policy Audit
22. Verify every table has `SELECT` policy scoped to `auth.uid()`
23. Verify `INSERT` policies prevent unauthorized writes
24. Verify `UPDATE` policies prevent unauthorized modifications
25. Verify `DELETE` policies are admin-only

### Infrastructure
26. SSL/TLS — verify valid cert, no weak ciphers (use `testssl.sh`)
27. Security headers — verify CSP, HSTS, X-Frame-Options present
28. Subdomain takeover — verify no dangling DNS records
29. Dependency scan — verify no known vulns in production deps

## Tooling

| Tool | Purpose | Automation |
|------|---------|------------|
| OWASP ZAP | Automated web scanner | `zap-cli quick-scan https://twalletservices.com` |
| BURP Suite | Manual testing proxy | Manual |
| `nuclei` | Known vulnerability scanning | `nuclei -u https://twalletservices.com` |
| `testssl.sh` | TLS configuration audit | `testssl.sh https://twalletservices.com` |
| `npm audit` | Dependency vuln check | `npm audit --production` |
| Supabase Advisors | RLS + Security checks | `supabase_get_advisors type=security` |

## Reporting

Deliverable: PDF report containing:
1. Executive summary (risk level, critical findings count)
2. Methodology
3. Findings (severity, description, reproduction steps, impact, recommendation)
4. Retest results
5. Appendix (raw scan outputs, request/response dumps)

Severity classification:
| Level | Response SLA | Definition |
|-------|-------------|------------|
| Critical | 24h fix | Direct financial loss or user data exposure |
| High | 72h fix | Significant security control bypass |
| Medium | 2 weeks fix | Configuration weakness, limited impact |
| Low | 1 month fix | Informational, defense-in-depth improvement |

## Schedule

| Phase | Duration | Activities |
|-------|----------|------------|
| Reconnaissance | 4h | Information gathering, endpoint discovery |
| Automated Scanning | 2h | OWASP ZAP, nuclei, testssl.sh runs |
| Manual Testing | 8h | Authentication, wallet, payment flow testing |
| Admin Testing | 4h | Admin panel, RLS, privilege escalation |
| Report Writing | 4h | Findings documentation, remediation |
| Retest | 4h | Verify fixes applied (2 weeks after report delivery) |

## Fix Verification

After fixes are applied:
1. Re-run relevant automated scans
2. Re-test each finding manually
3. Update report with retest results
4. Close findings only when verified fixed

## Budget

| Item | Estimated Cost |
|------|----------------|
| External pentest firm (engagement) | $5,000–$15,000 |
| Self-service tools (ZAP, nuclei) | Free |
| BURP Suite Pro license | $449/year |
| Time (internal team, 24h) | Included |

## Legal

- All testing targets and scopes documented in writing
- Authorization obtained from project owner before testing
- No data exfiltration or persistence on target systems
- Testing limited to business hours (Mon–Fri, 09:00–17:00 UTC)
- Crashing or denial-of-service tests require explicit approval
