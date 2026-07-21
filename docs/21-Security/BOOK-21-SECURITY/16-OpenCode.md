# OpenCode Security Build Instructions

Build a secure production-ready platform.

## Requirements

- Supabase RLS on every table
- Secure authentication (email verification, strong passwords, JWT rotation)
- RBAC with least privilege + deny-by-default
- Zod validation on every API input
- Security headers (CSP, HSTS, XFO, etc.)
- Rate limiting (auth, payment, general tiers)
- Secret management (env vars, never committed, rotated)
- Audit logging (append-only, searchable, 365-day retention)
- Monitoring + alerting (Sentry, Vercel, Supabase logs)
- Incident response runbooks (SEV-1/2/3/4)
- Privacy controls (data export, account deletion, retention)
- No private keys or seed phrases collected
- No on-chain transaction signing by server
- On-chain payment verification before marking orders paid
- Production ready

## File Structure

```
21-Security/BOOK-21-SECURITY/
├── README.md
├── 01-Threat-Model.md
├── 02-Authentication.md
├── 03-Authorization.md
├── 04-Input-Validation.md
├── 05-API-Security.md
├── 06-Wallet-Security.md
├── 07-Database-Security.md
├── 08-Storage-Security.md
├── 09-Secret-Management.md
├── 10-Security-Headers.md
├── 11-Rate-Limiting.md
├── 12-Audit-Logging.md
├── 13-Monitoring.md
├── 14-Incident-Response.md
├── 15-Compliance.md
└── 16-OpenCode.md

security/
├── SECURITY.md
├── THREAT_MODEL.md
├── SECURITY_HEADERS.md
├── DATA_RETENTION.md
├── ACCESS_CONTROL_MATRIX.md
├── INCIDENT_RUNBOOK.md
├── BACKUP_RECOVERY.md
├── VULNERABILITY_RESPONSE.md
└── DEPENDENCY_UPDATE_POLICY.md

docs/adr/
├── ADR-001-use-supabase.md
├── ADR-002-walletconnect-appkit.md
├── ADR-003-nextjs-15.md
├── ADR-004-vercel-hosting.md
├── ADR-005-crypto-payment-flow.md
└── ADR-006-rbac-model.md
```

## Verification Checklist

- HTTPS enabled on all routes
- Secure cookies configured
- JWT validated on every API call
- RLS enabled on all 19 tables
- Zod validation on all inputs
- CSP header configured
- Rate limiting implemented
- Audit logs recording all security events
- Secrets stored as environment variables only
- Storage URLs are signed (private) or properly restricted (public)
- Wallet ownership verified via signed message
- No private key or seed phrase input fields exist
- Daily backups configured
- Monitoring alerts configured
- Incident response plan documented
- Production logging active with correlation IDs
