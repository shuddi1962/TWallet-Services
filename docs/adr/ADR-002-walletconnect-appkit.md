# ADR-002: Use WalletConnect AppKit for Wallet Integration

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Services needs to connect users' self-custody wallets (MetaMask, Coinbase Wallet, Trust Wallet, etc.) to allow them to sign messages (proving ownership) and send crypto payments. Options evaluated: WalletConnect AppKit, wagmi solo, Web3Modal v3, custom integration.

## Decision

Use WalletConnect AppKit (formerly Web3Modal) with wagmi + viem.

## Rationale

- Supports all major wallets (MetaMask, Coinbase, Trust Wallet, Ledger, etc.)
- Built-in UI modal — consistent connection experience
- wagmi + viem provide typed React hooks and ethers-alternative interaction
- WalletConnect v2 protocol — industry standard
- No private keys or seed phrases pass through our servers
- Active development and maintenance

## Consequences

- Dependency on WalletConnect infrastructure for relay
- Users must have a WalletConnect-compatible wallet
- Mobile wallet connection requires deep linking or QR code
