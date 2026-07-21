# Git Rules

## Branch Strategy

```text
main                  Production — deploys automatically
    ↑ PR
development           Integration branch
    ↑ PR
feature/{name}        Feature branches
hotfix/{name}         Emergency fixes
release/v*            Release candidates
```

## Commit Convention

All commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>
```

### Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(wallet): add MetaMask connection` |
| `fix` | Bug fix | `fix(payments): handle RPC timeout` |
| `docs` | Documentation | `docs(api): update payment spec` |
| `refactor` | Code restructuring | `refactor(orders): extract validation` |
| `test` | Tests | `test(wallet): add connection tests` |
| `perf` | Performance | `perf(db): add composite index` |
| `style` | Formatting | `style: format with prettier` |
| `chore` | Maintenance | `chore: update dependencies` |

### Examples

```text
feat(auth): add wallet connection flow
fix(payments): resolve double-verify race condition
docs(api): update payment endpoint spec
refactor(orders): extract validation logic
test(wallet): add connection failure tests
perf(db): add composite index on orders
chore: upgrade next.js to 15.2.0
```

## Pull Request Process

1. Create feature branch from `development`
2. Implement with conventional commits
3. Push and open PR to `development`
4. PR title matches commit convention
5. CI checks must pass (lint, typecheck, test, build)
6. At least one approval required
7. Squash merge to `development`
8. Delete feature branch

## Release Process

1. Create `release/v*` from `development`
2. Run full regression tests
3. PR from `release/v*` to `main`
4. Squash merge to `main`
5. Tag: `git tag v1.0.0 && git push --tags`
6. CI deploys to production

## Git Hooks

| Hook | Tool | Action |
|------|------|--------|
| pre-commit | lint-staged | Lint + format staged files |
| commit-msg | commitlint | Validate commit message |
| pre-push | — | Run tests + typecheck |
