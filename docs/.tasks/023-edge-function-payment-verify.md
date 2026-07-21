# Task 023: Edge Function — Payment Verification

## Goal
Build the core on-chain payment verification Edge Function using Deno + viem + Alchemy RPC.

## Requirements
- Verify transaction exists on-chain (correct address, amount, chain)
- Check minimum confirmations (varies by network)
- Ensure tx hash not already used (prevent double-spend)
- Handle native ETH and ERC-20 tokens
- Error codes for every failure mode (10+ codes)
- Idempotent (safe to retry)

## Dependencies
- Task 022 (Supabase types)
- Task 017 (RLS policies)
- Alchemy RPC keys (one per network)

## Files
```
supabase/functions/
├── verify-payment/
│   ├── index.ts           # Main handler
│   ├── verification.ts    # Verification logic
│   ├── chains.ts          # Chain configs
│   ├── tokens.ts          # Token address mapping
│   └── _utils/
│       ├── rpc.ts         # Alchemy RPC client
│       └── errors.ts      # Error code constants
└── _shared/
    ├── supabase-admin.ts  # Service-role client
    └── cors.ts            # CORS headers
```

## References
- `docs/BOOK-11/BOOK_11_CRYPTO_PAYMENTS.md`
- `docs/BOOK-17/BOOK-17-SUPABASE/` (Edge Functions section)
- `docs/BOOK-16/BOOK-16-API/` (webhook contracts)

## Acceptance Criteria
- [ ] Verifies native ETH transfers
- [ ] Verifies ERC-20 token transfers
- [ ] Checks minimum confirmations per network
- [ ] Rejects already-used tx hashes
- [ ] Returns clear error codes for failures
- [ ] Handles RPC timeouts gracefully
- [ ] Edge Function deploys successfully
- [ ] Logs every verification attempt with outcome

## Testing
- Unit test: verification logic with mock RPC
- Unit test: error code mapping
- Integration test: verify against testnet transaction
- Edge Function deploy test
- Performance: verification completes within 5s

## Security
- Service-role key only, never exposed client-side
- Input validation (address format, hash format, chain ID)
- Rate limiting on function invocation
- Audit log every verification
