# Documentation Rules

## Whenever Code Changes

| Document | Update Required |
|----------|-----------------|
| Architecture docs | If architecture changes |
| Database docs | If schema changes |
| API docs | If endpoints change |
| README | If component/feature purpose changes |
| Changelog | For every notable change |
| Migration notes | For database schema changes |
| Component docs | If component API changes |
| Analytics docs | If events change |

## What to Document

Every feature MUST document:

| Section | What to Write |
|---------|---------------|
| Purpose | Why does this exist? |
| Architecture | How does it work at a high level? |
| API changes | New/modified endpoints, request/response |
| Database changes | New/modified tables, columns, indexes |
| UI changes | New/modified components, routes, flows |
| Testing notes | What was tested, edge cases |

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

## JSDoc for Public APIs

```typescript
/**
 * Verifies a crypto payment on-chain.
 *
 * @param params - Payment verification parameters
 * @param params.txHash - Transaction hash to verify
 * @returns The verification result
 * @throws {VerificationError} If on-chain verification fails
 */
export async function verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult>
```

## Changelog Format

Follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):

```markdown
# Changelog

## [Unreleased]

### Added
- New feature description

### Changed
- Change description

### Fixed
- Bug fix description
```

## Golden Rule

**Documentation is updated in the same PR as the code change.**
Outdated documentation is treated as a bug.
