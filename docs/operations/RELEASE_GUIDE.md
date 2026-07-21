# Operations — Release Guide

## Release Types

| Type | Frequency | Version Bump | Approval |
|------|-----------|--------------|----------|
| Major | Quarterly | v1.0.0 → v2.0.0 | CTO + Product |
| Minor | Monthly | v1.0.0 → v1.1.0 | Tech Lead |
| Patch | As needed | v1.0.0 → v1.0.1 | Tech Lead |
| Hotfix | Emergency | v1.0.0 → v1.0.1 | CTO |

## Release Process

```text
1. Merge all feature PRs to development
2. Create release branch: release/v1.2.0
3. Update version in package.json
4. Update CHANGELOG.md
5. Run full regression suite
6. Create PR: release/v1.2.0 → main
7. After approval, squash merge to main
8. Tag release: git tag v1.2.0 && git push --tags
9. CI deploys main to production
10. Run smoke tests
11. Monitor Sentry + Vercel Analytics for 30 min
```

## Hotfix Process

```text
1. Branch from main: hotfix/critical-fix
2. Fix, test, PR to main
3. Cherry-pick to release branch if needed
4. Deploy
```

## Pre-Release Checklist

- [ ] Code complete (all feature PRs merged)
- [ ] All CI checks pass
- [ ] E2E tests pass (full suite)
- [ ] Database migration verified
- [ ] Rollback script tested
- [ ] Environment variables verified
- [ ] Changelog updated
- [ ] Version bumped
- [ ] QA regression suite passed
- [ ] Stakeholder approval (major/minor only)
