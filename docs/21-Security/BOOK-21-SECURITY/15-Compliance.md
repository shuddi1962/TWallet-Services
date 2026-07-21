# Compliance

## Privacy

| Requirement | Implementation |
|-------------|----------------|
| Collect only required data | Minimal fields in profiles table |
| Privacy Policy | Published at `/privacy` |
| Terms of Service | Published at `/terms` |
| Account deletion | Users can delete via Settings → Delete Account |
| Data export | Users can export via Settings → Export Data |
| Audit logs | All data access logged |
| Data retention | 90 days (notifications), 365 days (audit logs) |
| GDPR readiness | Data export + erasure, privacy policy, consent records |

## Data Classification

| Classification | Examples | Controls |
|----------------|----------|----------|
| Public | Card products, supported networks | No access controls |
| Internal | Order counts, system settings | RLS + auth required |
| Confidential | User profiles, wallet addresses | RLS + encryption |
| Restricted | KYC documents, payment records | RLS + signed URLs + audit |

## Data Retention Schedule

| Data Type | Retention | Deletion |
|-----------|-----------|----------|
| Profiles | Account lifetime | 30 days after deletion request |
| Orders | 7 years (tax/compliance) | Anonymized after 7 years |
| Payment transactions | 7 years | Anonymized after 7 years |
| Notifications | 90 days | Auto-deleted |
| Audit logs | 365 days | Auto-deleted |
| Support tickets | 3 years | Anonymized after 3 years |
| Uploaded documents | Account lifetime | 30 days after deletion request |

## Cookie Compliance

| Cookie | Purpose | Duration | Category |
|--------|---------|----------|----------|
| `sb-access-token` | Auth session | 1 hour | Essential |
| `sb-refresh-token` | Auth refresh | 30 days | Essential |
| `theme` | User preference | 1 year | Functional |
| `_ga` | Analytics | 2 years | Analytics |

## Regulatory Considerations

| Regulation | Scope | Status |
|------------|-------|--------|
| GDPR | EU users | Privacy policy, data export, data erasure |
| CCPA | California users | Data disclosure, opt-out |
| PCI-DSS | Not applicable | No card data storage (crypto only) |
| FinCEN | US MSB | Future: consult legal counsel |
| MiCA | EU crypto regulation | Future: monitor regulation |
