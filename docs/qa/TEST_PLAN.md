# Test Plan — TWallet Services

## Scope

Full-stack testing for the TWallet Card platform: Next.js 15 frontend, Supabase backend, Edge Functions, and on-chain payment verification.

## In Scope

- Authentication (register, login, verify, reset)
- Wallet integration (connect, disconnect, switch)
- Card ordering (browse, select, pay, track)
- Payment verification (on-chain, Edge Function)
- Customer dashboard (orders, wallet, notifications)
- Admin dashboard (order management, user management, reports)
- Support tickets (create, reply, escalate)
- File uploads (avatars, documents, support attachments)
- API endpoints (65+ routes)
- Database (RLS, triggers, functions, migrations)
- Cross-browser and mobile compatibility
- Accessibility (WCAG 2.1 AA)
- Performance (Core Web Vitals)

## Out of Scope

- Third-party wallet UI behavior (MetaMask, Coinbase Wallet — tested by vendors)
- Blockchain RPC reliability (tested by Alchemy)
- Email delivery (tested by Resend)
- Load testing beyond 50 concurrent users (Phase 2)

## Test Levels

| Level | Who | When |
|-------|-----|------|
| Unit | Developers | Every commit |
| Integration | Developers | Every PR |
| E2E | Developers + CI | Every PR + pre-release |
| Manual | QA team | Pre-release |
| UAT | Stakeholders | Before major releases |

## Deliverables

- Test suite in repository
- CI pipeline with automated tests
- QA runbook for manual testing
- Release sign-off template
