# Entity Relationship Diagram — TWallet Services

> Generated from `supabase/migrations/202607200001_initial_schema.sql`

## Mermaid ERD

```mermaid
erDiagram
  auth_users ||--o| profiles : has
  profiles ||--o| user_roles : has
  profiles ||--o| wallets : owns
  profiles ||--o| card_orders : places
  profiles ||--o| payment_transactions : makes
  profiles ||--o| notifications : receives
  profiles ||--o| support_tickets : creates
  profiles ||--o| user_preferences : configures
  profiles ||--o| admins : "is (optional)"

  admins ||--o| ticket_messages : writes
  admins ||--o| admin_notifications : receives
  admins ||--o| audit_logs : "generates (optional)"
  admins ||--o| system_settings : updates

  card_orders ||--|| shipping_addresses : has
  card_orders ||--o| payment_transactions : "has (optional)"
  card_orders ||--o| support_tickets : "references (optional)"
  card_orders ||--|| card_products : orders

  support_tickets ||--o| ticket_messages : contains
  ticket_messages ||--o| ticket_attachments : has

  supported_networks ||--o| supported_tokens : "has tokens"
  supported_networks ||--o| supported_wallet_addresses : "has addresses"
  supported_networks ||--o| payment_transactions : "used in"

  supported_tokens ||--o| payment_transactions : "used in"
  supported_wallet_addresses ||--o| payment_transactions : "receives payment"
```

## Legend

| Notation | Meaning |
|----------|---------|
| `||--||` | One-to-one |
| `||--o|` | One-to-zero-or-one |
| `||--o{` | One-to-many |
| `}|--o{` | Many-to-many |

## Key Entities

| Entity | Type | Description |
|--------|------|-------------|
| `profiles` | Core | User profiles, synced from auth.users |
| `wallets` | Core | User-connected crypto wallets |
| `card_products` | Core | Available card types with pricing |
| `card_orders` | Core | Customer orders with lifecycle |
| `payment_transactions` | Core | On-chain payment verification records |
| `support_tickets` | Support | Customer support requests |
| `notifications` | Core | User notification records |
| `audit_logs` | Admin | Append-only admin action log |
| `admins` | Admin | Admin users with RBAC roles |
