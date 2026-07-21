# Data Retention Policy — TWallet Services

> Full compliance details in `21-Security/BOOK-21-SECURITY/15-Compliance.md`

## Retention Schedule

| Data Type | Active Retention | Archive | Deletion |
|-----------|-----------------|---------|----------|
| User profiles | Account lifetime | — | 30 days after deletion request |
| Authentication logs | 90 days | 365 days | After 365 days |
| Wallet connections | Account lifetime | — | On account deletion |
| Card orders | 7 years | — | Anonymized after 7 years |
| Payment transactions | 7 years | — | Anonymized after 7 years |
| Shipping addresses | 3 years | — | Anonymized after 3 years |
| Support tickets | 3 years | — | Anonymized after 3 years |
| Ticket messages | 3 years | — | Anonymized after 3 years |
| Notifications | 90 days | — | Auto-deleted |
| Audit logs | 365 days | — | Auto-deleted |
| Uploaded documents | Account lifetime | — | 30 days after deletion |
| System settings | Permanent | — | — |

## Deletion Process

1. User initiates deletion via Settings → Delete Account
2. 30-day grace period (account suspended, not deleted)
3. After 30 days: anonymize personal data, cascade delete child records
4. Payment records retained (anonymized) for 7 years (compliance)
5. Confirmation email sent upon completion

## Data Export

Users can export their data via Settings → Export Data. Exported data includes:

- Profile information
- Order history
- Payment history
- Support tickets
- Wallet connections
