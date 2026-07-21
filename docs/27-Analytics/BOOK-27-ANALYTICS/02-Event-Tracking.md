# Event Tracking

## Event Naming Standard

Format: `snake_case` with domain prefix.

```text
{domain}_{action}[_{context}]

Examples:
user_registered
wallet_connected
card_order_created
crypto_payment_confirmed
support_ticket_created
admin_order_updated
```

## Tracked Events

### Authentication

| Event | Trigger | Properties |
|-------|---------|------------|
| `user_registered` | Account created | method, email_provider |
| `email_verified` | Email confirmed | — |
| `user_logged_in` | Session created | method (wallet/email) |
| `user_logged_out` | Session ended | — |
| `password_reset_requested` | Reset email sent | — |
| `password_reset_completed` | Password changed | — |

### Wallet

| Event | Trigger | Properties |
|-------|---------|------------|
| `wallet_connected` | Wallet connection success | wallet_type, network, address (hashed) |
| `wallet_disconnected` | Wallet disconnected | wallet_type |
| `wallet_network_changed` | User switched network | from_network, to_network |
| `wallet_connection_failed` | Connection failed | wallet_type, error_code |

### Cards

| Event | Trigger | Properties |
|-------|---------|------------|
| `card_product_viewed` | User viewed card details | card_type, card_id |
| `card_ordered` | User placed order | card_type, amount, token |
| `card_order_cancelled` | Order cancelled | order_id, reason |
| `card_activated` | Card becomes active | card_id, card_type |
| `card_status_changed` | Card status updated | from_status, to_status |

### Payments

| Event | Trigger | Properties |
|-------|---------|------------|
| `crypto_payment_started` | Transaction submitted | amount, token, network |
| `crypto_payment_pending` | Awaiting confirmation | tx_hash, confirmations |
| `crypto_payment_confirmed` | On-chain verified | tx_hash, block_number |
| `crypto_payment_failed` | Verification failed | error_code, reason |

### Support

| Event | Trigger | Properties |
|-------|---------|------------|
| `support_ticket_created` | User opened ticket | category, priority |
| `support_ticket_updated` | Ticket changed | from_status, to_status |
| `support_ticket_closed` | Ticket resolved | satisfaction_score |

### Admin

| Event | Trigger | Properties |
|-------|---------|------------|
| `admin_logged_in` | Admin authenticated | admin_id |
| `admin_order_updated` | Order status changed | order_id, from_status, to_status |
| `admin_user_flagged` | User flagged | user_id, reason |
| `admin_settings_changed` | System settings updated | setting_key |

### Marketing

| Event | Trigger | Properties |
|-------|---------|------------|
| `referral_link_shared` | User shared referral | referral_channel |
| `referral_signup` | New user via referral | referrer_id |
| `newsletter_subscribed` | Email subscribed | source |
| `campaign_clicked` | User clicked campaign | campaign_id, source, medium |

## Event Implementation

```typescript
// src/lib/analytics/events.ts
import { posthog } from './client';

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return; // Server-side events use different path

  posthog.capture(name, {
    ...properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
}

// Usage
trackEvent('wallet_connected', {
  wallet_type: 'metaMask',
  network: 'ethereum',
});
```

## Server-Side Events

For backend events (Edge Functions, Server Actions), use the Supabase `analytics_events` table:

```sql
INSERT INTO analytics_events (event_name, user_id, properties, timestamp)
VALUES ('payment_confirmed', $1, $2, NOW());
```
