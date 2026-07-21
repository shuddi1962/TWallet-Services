# OpenCode: Production Launch Build Instructions

## Before Every Release

| Gate | Check |
|------|-------|
| Build passes | `npm run build` |
| TypeScript passes | `npm run typecheck` |
| Lint passes | `npm run lint` |
| Tests pass | `npm run test` + `npm run test:e2e` |
| Documentation updated | PR includes doc changes |
| Security verified | No secrets, RLS, validation |
| Database ready | Migrations applied, backed up |
| Performance verified | Lighthouse ≥ 95, bundles within budget |
| Monitoring enabled | Sentry, Uptime Robot, Vercel Analytics |
| Production deployment approved | Sign-off from Tech Lead + CTO |
| Rollback plan available | Vercel rollback + DB compensation |

## Launch Sequence

```text
1. Run pre-launch checklist (01-Pre-Launch.md)
2. Configure domain + DNS (02-Domain-DNS.md)
3. Deploy to Vercel production (03-Vercel-Deployment.md)
4. Configure Supabase production (04-Supabase-Production.md)
5. Verify WalletConnect production (05-WalletConnect.md)
6. Set environment variables (06-Environment-Variables.md)
7. Run security checklist (07-Security-Checklist.md)
8. Execute go-live sequence (08-Go-Live.md)
9. Post-launch monitoring (09-Post-Launch.md)
10. In case of incident (10-Incident-Response.md)
```

## File Setup

```text
operations/
├── RUNBOOK.md
├── INCIDENT_PLAYBOOK.md
├── RELEASE_GUIDE.md
├── BACKUP_GUIDE.md
├── RESTORE_GUIDE.md
├── CHANGELOG.md
├── MAINTENANCE_SCHEDULE.md
├── SERVICE_STATUS.md
└── POSTMORTEM_TEMPLATE.md
```

## Verification Checklist

- [ ] Domain active with SSL
- [ ] Homepage loads (< 2s)
- [ ] Authentication works (login, signup, email verify)
- [ ] Wallet connection works (all 4 wallets, all 7 networks)
- [ ] Card ordering works (select, order, pay)
- [ ] Crypto payment works (submit, confirm on-chain)
- [ ] Admin dashboard works (manage users, orders, payments)
- [ ] Notifications work (email, in-app)
- [ ] Sentry capturing errors
- [ ] Uptime Robot monitoring active
- [ ] Backups running
- [ ] Rollback tested
- [ ] Support team briefed
- [ ] Documentation published
- [ ] Production ready
