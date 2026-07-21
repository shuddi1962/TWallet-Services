# WalletConnect Production Configuration

## Production Setup

### WalletConnect Cloud

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create or select TWallet Services project
3. Set redirect URLs to production domain
4. Ensure plan supports production traffic

### Configuration

```typescript
// src/config/walletconnect.ts
export const walletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  metadata: {
    name: 'TWallet Card',
    description: 'Non-custodial crypto-funded card platform',
    url: 'https://twalletservices.com',
    icons: ['https://twalletservices.com/logo.png'],
  },
};
```

## Supported Networks (Production)

| Network | Chain ID | RPC (Alchemy) |
|---------|----------|---------------|
| Ethereum Mainnet | 1 | `eth-mainnet.g.alchemy.com` |
| Base | 8453 | `base-mainnet.g.alchemy.com` |
| Arbitrum | 42161 | `arb-mainnet.g.alchemy.com` |
| Optimism | 10 | `opt-mainnet.g.alchemy.com` |
| Polygon | 137 | `polygon-mainnet.g.alchemy.com` |
| Avalanche C-Chain | 43114 | `avax-mainnet.g.alchemy.com` |
| BNB Smart Chain | 56 | `bnb-mainnet.g.alchemy.com` |

## Supported Wallets (Production)

| Wallet | Type | Tested |
|--------|------|--------|
| MetaMask | Browser extension | ✅ |
| WalletConnect | QR/mobile | ✅ |
| Coinbase Wallet | Browser extension + mobile | ✅ |
| Trust Wallet | Mobile (WalletConnect) | ✅ |

## Verification

- [ ] WalletConnect Project ID created and set in production env vars
- [ ] Production domain added to WalletConnect allowlist
- [ ] All 7 networks confirmed working
- [ ] All 4 wallets confirmed connecting
- [ ] Signature requests function correctly
- [ ] Network switching works
- [ ] Disconnect/reconnect flow works
- [ ] Rate limits adequate for expected traffic
