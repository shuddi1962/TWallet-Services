# Git Workflow

## Branching Strategy

**GitHub Flow** with release branches.

```
main ──────●─────────●──────────●─────────►
             \       / \        /
feature/      ●───●─●   ●───●──●
                             \
release/                       ●──●──●──►
                                  \
hotfix/                            ●──●──►
```

## Branch Types

| Branch | Source | Target | Purpose |
|--------|--------|--------|---------|
| `main` | — | — | Production-ready code |
| `feature/*` | `main` | `main` | New features and improvements |
| `fix/*` | `main` | `main` | Bug fixes |
| `hotfix/*` | `main` | `main` | Critical production fixes |
| `release/v*` | `main` | `main` | Release stabilization |

## Naming Convention

```
feature/<issue-number>-<short-description>
  feature/42-add-card-theme

fix/<issue-number>-<short-description>
  fix/87-fix-payment-validation

hotfix/<issue-number>-<short-description>
  hotfix/93-critical-payment-bypass

release/v<major>.<minor>.<patch>
  release/v1.2.0
```

## Commit Convention

Use conventional commits:

```
type(scope): description

feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting, styling
refactor: Code restructuring
test:     Adding/updating tests
chore:    Build, deps, CI
```

Examples:

```
feat(orders): add card theme selection
fix(payment): correct USDC decimal parsing
docs(api): update order endpoint spec
test(auth): add MFA test cases
```

## PR Requirements

- Title follows conventional commit format
- Description includes what + why + testing notes
- All CI checks pass
- At least one reviewer approves
- No merge commits (squash or rebase)
