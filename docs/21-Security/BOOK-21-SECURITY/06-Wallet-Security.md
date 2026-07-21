# Wallet Security

## Non-Negotiable Rules

| Rule | Rationale |
|------|-----------|
| Never store private keys | Platform is non-custodial by design |
| Never request seed phrases | No input field, anywhere, may request them |
| Never sign transactions | Platform never signs on behalf of users |
| Never broadcast from server | All transactions initiated by user's wallet |

## Data Stored

| What | Where | Purpose |
|------|-------|---------|
| Public wallet address | `wallets.address` | Payment verification |
| Network ID | `wallets.network_id` | Chain identification |
| Signature | `wallets.signature` | Ownership proof |

## Wallet Connection Flow

```
1. User clicks "Connect Wallet"
2. WalletConnect modal opens (user's wallet UI)
3. User signs a message proving ownership
4. Signature + address sent to server
5. Server verifies signature with ethers/viem
6. If valid, address stored in wallets table
7. Connection logged in audit_logs
```

## Security Measures

| Measure | Implementation |
|---------|----------------|
| Ownership verification | Message signing required on every new wallet |
| Duplicate prevention | UNIQUE(address, network_id) constraint |
| Network validation | Compare against `supported_networks` table |
| Rate limiting | Max 5 wallet connections per hour |
| Delete protection | Wallets cannot be deleted if linked to active orders |
| Audit | All connect/disconnect events logged |
| Warning | Display warning when connecting to unsupported networks |

## Address Validation

```ts
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
```
