# Metric Owners

## Ownership Matrix

Each KPI has a named owner responsible for monitoring, reporting, and improvement.

| KPI | Owner | Team | Review Cadence |
|-----|-------|------|----------------|
| New Users | Product Manager | Product | Daily |
| DAU / WAU / MAU | Product Manager | Product | Weekly |
| Wallet Connections | Product Manager | Product | Weekly |
| Card Orders | Product Manager | Product | Daily |
| Order Conversion Rate | Product Manager | Product | Weekly |
| Payment Success Rate | Tech Lead | Engineering | Daily |
| AOV | Product Manager | Product | Weekly |
| Revenue | CTO | Leadership | Daily |
| ARPU / LTV | CTO | Leadership | Monthly |
| Churn Rate | Product Manager | Product | Weekly |
| CSAT Score | Support Lead | Support | Weekly |
| Support Response Time | Support Lead | Support | Daily |
| Error Rate | Tech Lead | Engineering | Daily |
| API Latency | Tech Lead | Engineering | Daily |
| Infrastructure Cost | CTO | Engineering | Monthly |
| Feature Adoption | Product Manager | Product | Weekly |
| Retention (D1/D7/D30) | Product Manager | Product | Weekly |

## Responsibilities

### KPI Owner Responsibilities

1. **Monitor** the KPI daily/weekly (as per cadence)
2. **Alert** if KPI drops below warning threshold
3. **Investigate** root cause of KPI changes
4. **Report** KPI status in team standups
5. **Improve** KPI through product/engineering changes
6. **Document** any changes to KPI definition

### KPI Review Protocol

| Scenario | Action |
|----------|--------|
| KPI drops 10% below target | Owner investigates, reports in daily standup |
| KPI drops 20% below target | Owner escalates to CTO, incident review |
| KPI drops 50% below target | Company-wide alert, immediate response |
| KPI exceeds target by 20% | Share learnings, consider raising target |

## Adding a New Metric Owner

1. Define the KPI in `KPI_DEFINITIONS.md`
2. Assign an owner in this document
3. Add monitoring widget to relevant dashboard
4. Configure alert thresholds
5. Announce to team
