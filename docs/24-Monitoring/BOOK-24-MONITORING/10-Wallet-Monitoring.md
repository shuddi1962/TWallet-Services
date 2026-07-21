# Wallet Monitoring

## Monitored Events

### Connection Events

| Event | Metric | Alert |
|-------|--------|-------|
| Connection attempt | `wallet.connection.attempt` | — |
| Connection success | `wallet.connection.success` | — |
| Connection failure | `wallet.connection.failure` | Rate > 10% |
| Disconnection | `wallet.connection.disconnect` | — |
| Network switch | `wallet.network.switch` | — |
| Unsupported network | `wallet.network.unsupported` | > 10/min |

### Signature Events

| Event | Metric | Alert |
|-------|--------|-------|
| Signature request | `wallet.signature.request` | — |
| Signature confirmed | `wallet.signature.confirmed` | — |
| Signature rejected | `wallet.signature.rejected` | Rate > 50% |

### Payment Events

| Event | Metric | Alert |
|-------|--------|-------|
| Transaction submission | `wallet.tx.submitted` | — |
| Transaction confirmed | `wallet.tx.confirmed` | — |
| Transaction failed | `wallet.tx.failed` | Rate > 5% |
| RPC timeout | `wallet.rpc.timeout` | Any |

## Wallet Provider Health

| Provider | Monitored Via | Check Interval |
|----------|---------------|----------------|
| WalletConnect | WalletConnect API status | 5 min |
| MetaMask | Extension presence | Per request |
| Coinbase Wallet | SDK status | Per request |
| Trust Wallet | WalletConnect relay | 5 min |
| Alchemy RPC | RPC response time | 1 min |

## Network Health

| Network | RPC Endpoint | Healthy Latency |
|---------|-------------|-----------------|
| Ethereum Mainnet | Alchemy | < 500 ms |
| Base | Alchemy | < 500 ms |
| Arbitrum | Alchemy | < 500 ms |
| Optimism | Alchemy | < 500 ms |
| Polygon | Alchemy | < 500 ms |
| Avalanche C-Chain | Alchemy | < 500 ms |
| BNB Smart Chain | Alchemy | < 500 ms |

## Implementation

```typescript
export function monitorWalletConnection(
  walletType: string,
  success: boolean,
  error?: string,
): void {
  Sentry.metrics.increment('wallet.connection.attempt', 1, {
    tags: { wallet: walletType },
  });

  if (success) {
    Sentry.metrics.increment('wallet.connection.success', 1, {
      tags: { wallet: walletType },
    });
  } else {
    Sentry.metrics.increment('wallet.connection.failure', 1, {
      tags: { wallet: walletType, error: error ?? 'unknown' },
    });
  }
}
```

## Dashboard Widgets

- Active wallet connections (real-time gauge)
- Wallet connection success rate (24h sparkline)
- RPC response time by network (table)
- Unsupported network attempts (counter)
- Signature rejection rate (sparkline)
