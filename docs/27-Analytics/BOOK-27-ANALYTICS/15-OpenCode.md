# OpenCode: Analytics & Business Intelligence Build Instructions

## Requirements

- Event tracking for all business events (PostHog client + server)
- User identification and session tracking
- Business KPI dashboards (Executive, Operations, Finance, Support, Marketing, Product)
- Funnel analysis (8-step customer journey)
- Retention cohort tracking
- Revenue analytics (by token, network, time)
- Customer insights (popular cards, wallets, countries, segments)
- Admin reports (CSV, Excel, PDF export)
- Scheduled operational reports (daily, weekly, monthly)
- Data governance (event versioning, access control, retention)
- Privacy compliance (anonymization, consent, opt-out)

## Implementation Files

```text
src/
├── lib/
│   └── analytics/
│       ├── client.ts            # PostHog client initialization
│       ├── events.ts            # Event tracking helpers
│       ├── consent.ts           # Consent management
│       └── types.ts             # Event type definitions
├── components/
│   └── providers/
│       └── analytics-provider.tsx  # PostHog provider
└── app/
    └── admin/
        └── reports/              # Admin report pages
            ├── page.tsx
            ├── user-growth/
            ├── orders/
            ├── payments/
            └── ...

docs/analytics/
├── EVENT_CATALOG.md
├── EVENT_NAMING.md
├── DASHBOARD_DEFINITIONS.md
├── KPI_DEFINITIONS.md
├── REPORT_SCHEDULE.md
├── DATA_DICTIONARY.md
└── METRIC_OWNERS.md
```

## Verification Checklist

- [ ] PostHog initialized in app provider
- [ ] All business events tracked (see event matrix)
- [ ] Event naming follows `snake_case` convention
- [ ] User identification on login/registration
- [ ] No PII sent to analytics tools
- [ ] Executive dashboard created
- [ ] Operations dashboard created
- [ ] Finance dashboard created
- [ ] Support dashboard created
- [ ] Marketing dashboard created
- [ ] Product dashboard created
- [ ] Funnel analysis configured (8 steps)
- [ ] Retention cohorts configured
- [ ] Revenue by token/network/time tracked
- [ ] Admin reports with CSV/Excel/PDF export
- [ ] Daily ops report automated
- [ ] Weekly growth report automated
- [ ] Monthly executive report automated
- [ ] Data governance documented
- [ ] Privacy compliance verified
- [ ] Analytics ready
- [ ] Production ready
