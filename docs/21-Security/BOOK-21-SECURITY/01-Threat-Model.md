# Threat Model

## Threat Categories

| Category | Example | Risk |
|----------|---------|------|
| Unauthorized Login | Credential stuffing, brute force | Critical |
| Session Hijacking | Stolen JWT, XSS cookie theft | Critical |
| Cross-Site Scripting (XSS) | Malicious script injection | High |
| Cross-Site Request Forgery (CSRF) | Forged authenticated requests | High |
| SQL Injection | Malformed query input | Critical |
| Broken Access Control | Horizontal/vertical privilege escalation | Critical |
| Payment Spoofing | Fake transaction confirmations | Critical |
| Webhook Forgery | Fake provider callbacks | High |
| Malicious File Uploads | SVG with embedded script | Medium |
| Wallet Address Manipulation | Address replacement attack | Critical |
| Denial of Service | Rate limit exhaustion | Medium |
| Supply Chain Attack | Compromised dependency | High |
| Insecure Direct Object Reference | IDOR on orders, tickets | High |

## Risk Levels

| Level | Criteria | Response Time |
|-------|----------|---------------|
| Critical | Financial loss, data breach, account takeover | Immediate |
| High | Unauthorized access to non-financial data | < 1 hour |
| Medium | Degraded security posture | < 24 hours |
| Low | Informational, best-practice gap | < 1 week |

## Threat Documentation Format

Every identified threat must include:

- **Description** — what the attack is
- **Likelihood** — Low / Medium / High
- **Impact** — what happens if exploited
- **Mitigation** — how we prevent it
- **Detection** — how we know it's happening
- **Recovery** — how we restore normal operations

## Top Threats (STRIDE)

| Threat | Mitigation |
|--------|------------|
| Spoofing identity | Strong auth + MFA + wallet signature verification |
| Tampering with data | Signed webhooks, audit logs, immutable tx records |
| Repudiation | Append-only audit logs with actor/action/timestamp |
| Information disclosure | RLS, CSP, signed URLs, no secrets in client |
| Denial of service | Rate limiting, WAF, pagination limits |
| Elevation of privilege | RBAC, server-side permission checks, RLS |
