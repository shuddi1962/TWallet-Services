# Release Process

## Release Types

| Type | Frequency | Version Bump | Approval |
|------|-----------|--------------|----------|
| Major | Quarterly | v1.0.0 → v2.0.0 | CTO + Product |
| Minor | Monthly | v1.0.0 → v1.1.0 | Tech Lead |
| Patch | As needed | v1.0.0 → v1.0.1 | Tech Lead |
| Hotfix | Emergency | v1.0.0 → v1.0.1 | CTO |

## Release Checklist

```
☐ Code complete (all feature PRs merged)
☐ All CI checks pass
☐ E2E tests pass (full suite)
☐ Security scan completed
☐ Performance budget met
☐ Database migration verified
☐ Rollback script tested
☐ Environment variables verified
☐ Changelog updated
☐ Version bumped (package.json + Git tag)
☐ Release branch created (release/vX.Y.Z)
☐ Deployed to staging
☐ QA regression suite passed
☐ Stakeholder approval (for major/minor)
☐ Production deploy
☐ Smoke tests passed (post-deploy)
☐ Monitoring check (30 min post-deploy)
```

## Release Flow

```
1. Merge all feature PRs to main
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

## Hotfix Flow

```
1. Branch from main: hotfix/critical-fix
2. Fix, test, PR
3. Merge to main
4. Cherry-pick to release branch if needed
5. Deploy
```

## Versioning

```text
v1.0.0  Initial launch
v1.1.0  Feature release (e.g., card themes)
v1.1.1  Bug fix release
v2.0.0  Breaking changes
```
