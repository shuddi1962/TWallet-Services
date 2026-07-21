# Documentation Standards

## What to Document

Every feature or change MUST document:

1. **Purpose** — Why does this exist?
2. **Architecture** — How does it work at a high level?
3. **API Changes** — New/modified endpoints, request/response shapes
4. **Database Changes** — New/modified tables, columns, indexes
5. **UI Changes** — New/modified components, routes, flows
6. **Testing Notes** — What was tested, what edge cases exist

## Documentation Locations

| Topic | Location |
|-------|----------|
| Architecture decisions | `docs/adr/` |
| Component API docs | `docs/components/{name}.md` |
| Database docs | `docs/database/{topic}.md` |
| Analytics docs | `docs/analytics/{topic}.md` |
| Book/spec docs | `{NN}-{Name}/` |
| Operations | `ops/` |
| Observability | `observability/` |
| Security | `security/` |
| Quality assurance | `qa/` |

## Code Documentation

### JSDoc for Public APIs

```typescript
/**
 * Verifies a crypto payment on-chain.
 *
 * @param params - Payment verification parameters
 * @param params.txHash - Transaction hash to verify
 * @param params.expectedAmount - Expected payment amount
 * @param params.expectedToken - Expected token address
 * @returns The verification result with transaction details
 * @throws {VerificationError} If on-chain verification fails
 */
export async function verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult> {
  // ...
}
```

### Inline Comments

Use inline comments sparingly. Code should be self-documenting through clear naming and structure.

```typescript
// ❌ Unnecessary comment
// Set the user's name
user.name = name;

// ✅ Self-documenting code
user.name = name;

// ✅ Useful comment (explains why, not what)
// Retry with exponential backoff to handle RPC rate limits
for (let i = 0; i < 3; i++) {
  try { return await rpcCall(); }
  catch { await sleep(1000 * Math.pow(2, i)); }
}
```

## README Standards

Every major directory SHOULD have a README.md that explains:

1. What lives in this directory
2. How the code is organized
3. Key files and their purposes
4. Cross-references to related documentation

## Changelog

All notable changes are documented in `00-Project/CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Documentation Updates

- Documentation is updated IN THE SAME PR as the code change
- Documentation review is part of the code review process
- Outdated documentation is treated as a bug
