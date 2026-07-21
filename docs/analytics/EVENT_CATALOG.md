# Event Catalog

## Event Standards

- Format: `{domain}_{action}[_{context}]`
- Case: `snake_case`
- Semantic: `<subject>_<past_tense_verb>`
- Every event has an `$version` property for schema evolution

## Authentication Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `user_registered` | 1 | method, email_hash, domain | Account created |
| `email_verified` | 1 | — | Email confirmed |
| `user_logged_in` | 1 | method | Session created |
| `user_logged_out` | 1 | — | Session ended |
| `password_reset_requested` | 1 | — | Reset email sent |
| `password_reset_completed` | 1 | — | Password changed |

## Wallet Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `wallet_connected` | 1 | wallet_type, network | Connection success |
| `wallet_disconnected` | 1 | wallet_type | User disconnects |
| `wallet_network_changed` | 1 | from_network, to_network | Network switch |
| `wallet_connection_failed` | 1 | wallet_type, error_code | Connection failure |

## Card Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `card_product_viewed` | 1 | card_type, card_id | Card detail view |
| `card_ordered` | 1 | card_type, amount, token | Order placed |
| `card_order_cancelled` | 1 | order_id, reason | Order cancelled |
| `card_activated` | 1 | card_id, card_type | Card becomes active |
| `card_status_changed` | 1 | from_status, to_status | Status transition |

## Payment Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `crypto_payment_started` | 1 | amount, token, network | Transaction submitted |
| `crypto_payment_pending` | 1 | tx_hash, confirmations | Awaiting confirmation |
| `crypto_payment_confirmed` | 1 | tx_hash, block_number | On-chain verified |
| `crypto_payment_failed` | 1 | error_code, reason | Verification failed |

## Support Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `support_ticket_created` | 1 | category, priority | Ticket opened |
| `support_ticket_updated` | 1 | from_status, to_status | Ticket changed |
| `support_ticket_closed` | 1 | satisfaction_score | Ticket resolved |

## Admin Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `admin_logged_in` | 1 | admin_id | Admin authenticated |
| `admin_order_updated` | 1 | order_id, from_status, to_status | Order status change |
| `admin_user_flagged` | 1 | user_id, reason | User flagged |
| `admin_settings_changed` | 1 | setting_key | Settings updated |

## Marketing Events

| Event | Version | Properties | Trigger |
|-------|---------|------------|---------|
| `referral_link_shared` | 1 | referral_channel | User shared referral |
| `referral_signup` | 1 | referrer_id | New user via referral |
| `newsletter_subscribed` | 1 | source | Email subscribed |
| `campaign_clicked` | 1 | campaign_id, source, medium | Campaign click |

## Server-Side Events (via analytics_events table)

Events that originate from backend (Edge Functions, Server Actions, pg_cron) are stored in the `analytics_events` table with the same naming convention.

## Event Lifecycle

| State | Description |
|-------|-------------|
| Active | Currently being tracked |
| Deprecated | Being phased out, replaced by newer version |
| Removed | No longer tracked, documented for historical reference |
