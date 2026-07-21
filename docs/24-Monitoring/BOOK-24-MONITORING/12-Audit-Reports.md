# Audit Reports

## Audit Report Catalog

### Security Events Report

Captures all security-relevant events from `audit_logs`.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `security.*` | 1 year |
| Severity | All | 1 year |
| User ID | Optional | 1 year |

```sql
SELECT
  created_at,
  user_id,
  metadata->>'event' AS event,
  metadata->>'severity' AS severity,
  metadata->>'ip_address' AS ip_address
FROM audit_logs
WHERE metadata->>'event' LIKE 'security.%'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### Admin Activity Report

All admin actions for compliance review.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `admin.*` | 1 year |
| Admin ID | Optional | 1 year |

### Payment Activity Report

Payment verification outcomes for reconciliation.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `payment.*` | 7 years |
| Status | All | 7 years |

### Order Activity Report

Order lifecycle events.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `order.*` | 3 years |
| Status | All | 3 years |

### Login Activity Report

Authentication attempts and outcomes.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `auth.*` | 1 year |
| Success/failure | All | 1 year |

### System Changes Report

Configuration and deployment changes.

| Field | Filter | Retention |
|-------|--------|-----------|
| Event type | `system.*` | 1 year |
| Actor | All | 1 year |

## Report Generation

### Automated Reports

| Report | Schedule | Delivery |
|--------|----------|----------|
| Weekly security summary | Every Monday 08:00 UTC | Email to security lead |
| Daily payment reconciliation | Every day 06:00 UTC | Email to finance |
| Monthly compliance report | 1st of month 08:00 UTC | Email to compliance |
| Admin activity digest | Every Monday 08:00 UTC | Email to CTO |

### Ad-Hoc Reports

```sql
-- Example: Export failed payment attempts for a date range
SELECT
  created_at,
  user_id,
  metadata->>'order_id' AS order_id,
  metadata->>'error_code' AS error_code,
  metadata->>'tx_hash' AS tx_hash
FROM audit_logs
WHERE metadata->>'event' = 'payment.verification_failed'
  AND created_at BETWEEN $1 AND $2
ORDER BY created_at DESC;
```

## Report Security

- Audit reports never contain personal data unless explicitly required
- Reports are generated server-side and delivered via encrypted email or Supabase Storage (signed URL)
- Access to audit reports is logged separately
- Report access requires `audit_viewer` role or higher
