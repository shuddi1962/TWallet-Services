# Pre-Launch Verification

## Documentation

- [ ] All 30 books complete and reviewed
- [ ] README.md up to date with book status
- [ ] CHANGELOG.md updated
- [ ] AGENTS.md configured with build commands
- [ ] MASTER_INDEX.md created as entry point

## Code

- [ ] Last build succeeds (`npm run build`)
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] All performance budgets met
- [ ] Lighthouse scores ≥ 95
- [ ] All accessibility checks pass

## Database

- [ ] All 9 migrations applied to production
- [ ] RLS policies verified on all tables
- [ ] Indexes created on all query predicates
- [ ] Seed data deployed (networks, tokens, card products, settings)
- [ ] Admin account created
- [ ] Backup configured (PITR + daily pg_dump)

## Wallet

- [ ] WalletConnect Project ID configured (production)
- [ ] All 7 supported networks tested
- [ ] All 4 supported wallets tested
- [ ] Wallet connection flow end-to-end verified
- [ ] Signature request flow end-to-end verified
- [ ] Network switching flow end-to-end verified

## Payments

- [ ] Payment verification Edge Function deployed
- [ ] On-chain verification tested on each network
- [ ] Native token payments tested (ETH, MATIC, etc.)
- [ ] ERC-20 token payments tested (USDC, USDT)
- [ ] Failed payment handling verified
- [ ] Double-spend protection verified

## Monitoring

- [ ] Sentry configured (frontend + Edge Functions)
- [ ] Uptime Robot configured (homepage + API health)
- [ ] Vercel Analytics enabled
- [ ] Alerts configured (Slack + SMS for critical)
- [ ] Dashboards created (ops, payments, security, business)

## Security

- [ ] HTTPS verified
- [ ] Security headers tested (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting configured
- [ ] Input validation verified on all forms
- [ ] No secrets exposed in client code
- [ ] Dependency audit clean (`npm audit`)
- [ ] Penetration test completed

## Backup

- [ ] Database PITR enabled
- [ ] Daily pg_dump tested
- [ ] Storage cross-region replication configured
- [ ] Restore test completed
- [ ] Backup monitoring alert configured
