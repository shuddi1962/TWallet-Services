# Event Naming Conventions

## Format

All events follow: `{domain}_{action}[_{context}]`

### Domain

The domain represents the product area:

| Domain | Examples |
|--------|----------|
| `user` | user_registered, user_logged_in |
| `wallet` | wallet_connected, wallet_disconnected |
| `card` | card_ordered, card_activated |
| `crypto_payment` | crypto_payment_confirmed |
| `support_ticket` | support_ticket_created |
| `admin` | admin_logged_in, admin_order_updated |
| `referral` | referral_signup, referral_link_shared |

### Action

Past tense verb describing the action:

- `created`, `updated`, `deleted` — CRUD operations
- `connected`, `disconnected` — Connection state changes
- `confirmed`, `failed`, `pending` — State transitions
- `started`, `completed` — Process lifecycle
- `viewed`, `clicked`, `shared` — User interactions

### Context (Optional)

Additional qualification to distinguish similar events:

- `card_product_viewed` vs `card_ordered`
- `crypto_payment_started` vs `crypto_payment_confirmed`

## Rules

1. Always `snake_case`
2. No abbreviations unless universally understood (`crypto` is OK, `tx` is not)
3. Boolean events use `_started` / `_completed` pairs
4. Error events include `_failed` suffix
5. Admin events are prefixed with `admin_`

## Anti-Patterns

| Bad | Good | Reason |
|-----|------|--------|
| `order-create` | `card_ordered` | Mixed case |
| `user click cta` | `cta_clicked` | Spaces, not snake_case |
| `usr_reg` | `user_registered` | Unclear abbreviation |
| `cardOrder` | `card_ordered` | camelCase instead of snake_case |
| `error_occurred` | `crypto_payment_failed` | Too generic |

## Versioning

Events include `$version` property starting at 1. Increment when:

- Properties are added or removed
- Property types change
- Property semantics change

```typescript
// Version 1
trackEvent('card_ordered', { $version: 1, card_type: 'virtual', amount: 50 });

// Version 2 — added token and network
trackEvent('card_ordered', { $version: 2, card_type: 'virtual', amount: 50, token: 'USDC', network: 'ethereum' });
```
