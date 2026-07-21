# Release Criteria

## Go/No-Go Checklist

A release is approved only when ALL criteria pass:

```
☑ All unit tests pass
☑ All integration tests pass
☑ All E2E tests pass
☑ Build succeeds (production mode)
☑ No critical bugs open
☑ No high bugs open (waived exceptions require CTO approval)
☑ Security scan passed
☑ Dependency audit clean (no critical CVEs)
☑ Performance budget met
☑ Lighthouse score ≥ 90 (performance + accessibility)
☑ Accessibility audit passed (0 violations)
☑ Cross-browser tests passed
☑ Mobile tests passed
☑ Database migration applied and verified
☑ Rollback script tested
☑ API contract tests pass
☑ Sentry no new issues from staging
☑ Changelog updated
☑ Version bumped (semver)
```

## Release Process

```
1. PR merged to main
2. CI passes all checks
3. Release candidate tagged (v1.x.x)
4. Deployed to staging
5. QA runs regression suite (1 day)
6. Stakeholder review (if applicable)
7. Release sign-off (see qa/RELEASE_SIGNOFF.md)
8. Deploy to production
9. Smoke test production (30 min)
10. Monitor Sentry + Vercel Analytics (2 hours)
```

## Rollback Criteria

Rollback immediately if:

- Error rate > 5% above baseline
- Payment verification failures increase
- Critical bug discovered post-deploy
- Performance regression > 20%
- Database migration error
- Auth failures > 1% of requests

## Versioning

| Change | Version Bump | Example |
|--------|-------------|---------|
| Bug fix | Patch | 1.0.0 → 1.0.1 |
| New feature (backward compatible) | Minor | 1.0.0 → 1.1.0 |
| Breaking change | Major | 1.0.0 → 2.0.0 |
