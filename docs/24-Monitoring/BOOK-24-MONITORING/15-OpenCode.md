# OpenCode: Monitoring, Logging & Observability Build Instructions

## Requirements

- Structured JSON logging on all services
- Health check endpoints (`/api/health`, `/api/ready`, `/api/version`)
- Metrics collection (API, database, wallet, business)
- Sentry error tracking (frontend + Edge Functions)
- Web Vitals monitoring (Vercel Analytics + Sentry)
- Performance budgets
- Alerting rules (Sentry + Uptime Robot)
- Dashboard widgets (per domain: ops, system, payments, security, support, business)
- Audit reports (automated + ad-hoc)
- Incident management workflow
- SLI/SLO measurement with error budget tracking
- observability/ folder with runbooks and incident playbooks

## File Structure

```
src/
├── app/api/
│   ├── health/route.ts
│   ├── ready/route.ts
│   └── version/route.ts
└── lib/
    ├── logger.ts
    ├── monitor.ts
    └── sentry.ts

observability/
├── logging.md
├── alerts.md
├── dashboards.md
├── slo.md
├── metrics.md
├── runbooks.md
└── incident-playbooks.md
```

## Verification Checklist

- [ ] Structured JSON logging implemented on all services
- [ ] Health check endpoints respond correctly
- [ ] Sentry captures frontend errors
- [ ] Sentry captures backend errors
- [ ] Web Vitals reported to Vercel Analytics
- [ ] Performance budgets documented and enforced
- [ ] Alerting rules configured (Sentry + Uptime Robot)
- [ ] Dashboards created for each domain
- [ ] Audit reports automated
- [ ] Incident management workflow documented
- [ ] SLI/SLO targets defined
- [ ] Error budget tracking in place
- [ ] observability/ folder created with all docs
- [ ] Production ready
