# ADR-005: Crypto Payment Verification via Edge Function

**Date:** 2026-07-20  
**Status:** Accepted

## Context

TWallet Card orders are paid in crypto (USDC/USDT/DAI). The platform must verify: the correct amount was sent, to the correct address, on the correct chain, with sufficient confirmations. Options evaluated: client-side verification, server-side verification via Edge Function, third-party webhook service.

## Decision

Verify payments server-side via a Supabase Edge Function using viem + Alchemy RPC.

## Rationale

- **Trustworthy** — verification happens on server, not in browser (cannot be tampered)
- **viem** — lightweight, TypeScript-native Ethereum interaction library
- **Alchemy RPC** — reliable, fast, and provides transaction receipt with logs
- **Edge Function** — runs in Deno, close to Supabase (low latency DB writes)
- **13-step verification** — checks address, amount, chain, confirmations, ERC-20 Transfer log, replay prevention (UNIQUE tx_hash)
- **Idempotent** — can retry safely; same tx_hash won't double-confirm

## Consequences

- Dependency on Alchemy RPC availability
- Edge Function timeout (10s) could fail on congested chains (mitigated by async retry)
- Requires `SUPABASE_SERVICE_ROLE_KEY` on server (protected)
