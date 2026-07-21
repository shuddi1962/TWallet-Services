# Data Governance

## Principles

| Principle | Description |
|-----------|-------------|
| Collect only what's needed | Every event must have a documented purpose |
| Version events | Events are versioned to allow safe schema evolution |
| Document everything | Every event, metric, and KPI has a definition |
| Review quarterly | KPIs are reviewed and pruned every quarter |
| Restrict sensitive data | PII-accessible only to authorized roles |
| Backup reports | Critical reports are backed up to cold storage |
| Audit access | Analytics access is logged and auditable |

## Event Versioning

Events use a `$version` property for schema evolution:

```typescript
trackEvent('card_ordered', {
  $version: 2,          // Increment when properties change
  card_type: 'virtual',
  amount: 50,
  // Deprecated: currency (removed in v2)
  // Added in v2:
  token: 'USDC',
  network: 'ethereum',
});
```

## Data Dictionary

Every tracked event must be documented in the event catalog (`docs/analytics/EVENT_CATALOG.md`):

| Field | Description |
|-------|-------------|
| Event Name | `snake_case` event identifier |
| Description | What action the event represents |
| Trigger | When the event fires |
| Properties | All properties with types and descriptions |
| Version | Current event version |
| Owner | Team responsible |
| Since | Date when tracking began |

## Access Control

| Data Type | Admin | Super Admin | Customer |
|-----------|-------|-------------|----------|
| Aggregated KPIs | ✓ | ✓ | Dashboard only |
| User-level events | ✓ | ✓ | Own data only |
| PII (email, name) | ✗ | ✓ | Own data only |
| Payment data | ✓ (anonymized) | ✓ | Own data only |
| Raw analytics | ✗ | ✓ | ✗ |
