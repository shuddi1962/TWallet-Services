# Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|----|------|-------------|--------|------------|-------|
| R01 | WalletConnect API outage | Low | High | Fallback to direct RPC for chain reads; queued orders | Engineering |
| R02 | Alchemy RPC failure | Low | Critical | Backup RPC provider configured per network; automatic failover | Engineering |
| R03 | Supabase downtime | Low | High | Status page monitoring; read replicas for dashboards; degraded mode | DevOps |
| R04 | Crypto price volatility | Medium | Medium | Prices quoted in USD with 15-min lock; stablecoin priority | Product |
| R05 | Payment verification timeout | Medium | High | Retry with exponential backoff; manual reconciliation fallback | Engineering |
| R06 | Smart contract vulnerability | Low | Critical | Contract audited by third party; no user funds held; platform only verifies | Security |
| R07 | Double-spend attack | Very Low | Critical | Edge Function checks tx hash uniqueness; minimum confirmations per network | Engineering |
| R08 | DDoS attack | Medium | High | Cloudflare DDoS protection; rate limiting; WAF rules | DevOps |
| R09 | Data breach | Low | Critical | No keys/seeds stored; RLS on all tables; audit logging; encryption at rest | Security |
| R10 | Regulatory change (crypto) | Medium | High | Legal counsel; modular compliance hooks; jurisdiction-aware features | Product |
| R11 | Key personnel departure | Medium | Medium | Documentation-first approach; all architecture in ADRs; code reviewed | Management |
| R12 | Third-party dependency vulnerability | Medium | Medium | Automated dependency scanning (Dependabot); weekly review; pinned versions | Engineering |
| R13 | Cloud cost overrun | Medium | Medium | Budget alerts on Vercel + Supabase; cost review cadence | DevOps |
| R14 | Card fulfillment delays | Medium | High | Multiple card manufacturers; inventory buffer; transparent status tracking | Operations |
| R15 | Email deliverability issues | Low | Medium | SPF/DKIM/DMARC configured; monitoring bounce rates; fallback provider | Engineering |

## Risk Review Cadence

| Frequency | Type | Attendees |
|-----------|------|-----------|
| Weekly | Operational risks | Engineering + DevOps |
| Monthly | Security risks | Security Lead + Engineering |
| Quarterly | Strategic risks | CTO + Product + Legal |
