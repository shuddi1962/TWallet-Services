# Git Workflow

## Branch Strategy

```text
main                Production — deploys automatically
    ↑ PR (squash merge)
release/v*          Release candidates
    ↑ PR
development         Integration branch
    ↑ PR (squash merge)
feature/*           Feature branches
hotfix/*            Emergency fixes
```

### Branch Naming

| Branch | Pattern | Example |
|--------|---------|---------|
| Feature | `feature/{issue}-{short-description}` | `feature/42-wallet-connect` |
| Hotfix | `hotfix/{issue}-{short-description}` | `hotfix/56-payment-verification` |
| Release | `release/v{major}.{minor}.{patch}` | `release/v1.0.0` |
| Development | `development` | — |
| Main | `main` | — |

## Commit Convention

All commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(auth): add wallet connection flow` |
| `fix` | Bug fix | `fix(payments): resolve double-verify race condition` |
| `docs` | Documentation | `docs(api): update payment endpoint spec` |
| `refactor` | Code restructuring | `refactor(orders): extract validation logic` |
| `test` | Tests | `test(wallet): add connection failure tests` |
| `perf` | Performance | `perf(db): add composite index on orders` |
| `style` | Formatting | `style: format with prettier` |
| `chore` | Maintenance | `chore: update dependencies` |

### Examples

```text
feat(wallet): add MetaMask connection support

fix(payments): handle RPC timeout on confirmation

docs(api): add pagination documentation

refactor(orders): extract order validation to shared util

test(auth): add email verification test suite

perf(db): add composite index on payments(user_id, status)

chore: upgrade next.js to 15.2.0
```

## Pull Request Process

1. Create feature branch from `development`
2. Implement changes with conventional commits
3. Push and create PR to `development`
4. PR title matches commit convention: `feat(wallet): add MetaMask support`
5. PR description follows template (see `08-Code-Reviews.md`)
6. CI checks must pass (lint, typecheck, test, build)
7. At least one approval required
8. Squash merge to `development`
9. Delete feature branch

## Release Process

1. Create `release/v*` from `development`
2. Run full regression tests
3. Create PR from `release/v*` to `main`
4. After approval, squash merge to `main`
5. Tag release: `git tag v1.0.0 && git push --tags`
6. CI deploys to production

## Git Hooks

| Hook | Tool | Action |
|------|------|--------|
| pre-commit | lint-staged | Lint + format staged files |
| commit-msg | commitlint | Validate commit message |
| pre-push | — | Run tests + typecheck |
