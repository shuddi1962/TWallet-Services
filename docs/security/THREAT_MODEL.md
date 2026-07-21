# Threat Model — TWallet Services

> Full threat model documented in `21-Security/BOOK-21-SECURITY/01-Threat-Model.md`

## Quick Reference

| Category | Top Threat | Mitigation |
|----------|-----------|------------|
| Authentication | Credential stuffing | Supabase rate limiting + MFA |
| Authorization | IDOR / privilege escalation | RLS + server-side checks |
| Payments | Fake transaction confirmation | On-chain verification via Alchemy |
| Wallets | Address replacement | Signature verification + UNIQUE constraint |
| Webhooks | HMAC forgery | Signature verification + IP allowlist |
| Data | SQL injection | Parameterized queries (Supabase SDK) |
| XSS | Script injection | CSP + React escaping |
| Secrets | Key exposure | Environment variables + rotation |

## Data Flow Diagram

```
User Browser → Next.js (Edge) → Supabase (Data)
    ↕                          ↕
Wallet (WalletConnect)    Alchemy RPC (Verification)
```

## Trust Boundaries

1. **Browser → Server**: TLS, JWT auth, CSP
2. **Server → Supabase**: Service role key (server only), TLS
3. **Server → Alchemy**: API key, TLS, IP allowlist
4. **Webhook → Server**: HMAC-SHA256, IP allowlist
