# Test Data

## Seed Data Requirements

| Entity | Records | Purpose |
|--------|---------|---------|
| Demo users | 3 | Customer, admin, support agent |
| Admin accounts | 3 | Super admin, operations, finance |
| Card products | 5 | Virtual standard/premium, physical standard/premium/black |
| Demo orders | 5 | Each status: pending, paid, processing, shipped, delivered |
| Demo payments | 3 | Confirmed, pending, failed |
| Wallet addresses | 2 | Connected, disconnected |
| Support tickets | 3 | Open, in-progress, resolved |
| Notifications | 5 | Mix of read/unread, types |
| System settings | 6 | General, payment, shipping, KYC, notifications, limits |
| Networks | 6 | Ethereum, Polygon, Arbitrum, Optimism, Base, Solana |
| Tokens | 9 | USDC/USDT/DAI across networks |

## Test User Credentials

| User | Email | Role |
|------|-------|------|
| Customer | `customer@test.com` | Customer |
| Admin | `admin@test.com` | Super Administrator |
| Support | `support@test.com` | Support Agent |
| Finance | `finance@test.com` | Finance |

**Password:** `TestPass123!` (all test accounts)

## Test Wallet Addresses

```ts
export const TEST_WALLETS = {
  polygon: {
    address: "0x...",
    networkId: 137,
  },
  ethereum: {
    address: "0x...",
    networkId: 1,
  },
}
```

## Reset Script

```bash
# Reset database to clean seed state
supabase db reset
```

## Seed Data File

`supabase/seed.sql` — managed in version control. Runs automatically with `supabase db reset`.
