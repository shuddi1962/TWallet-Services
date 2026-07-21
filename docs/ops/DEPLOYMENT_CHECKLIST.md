# Deployment Checklist

## Pre-Deployment

- [ ] All PRs merged to main
- [ ] All CI checks passed
- [ ] Lint passed (`npm run lint`)
- [ ] Typecheck passed (`npm run typecheck`)
- [ ] Unit tests passed (`npm run test`)
- [ ] E2E tests passed (`npm run test:e2e`)
- [ ] Build succeeded (`npm run build`)
- [ ] Code review completed
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release branch created (`release/vX.Y.Z`)
- [ ] Database migration reviewed
- [ ] Rollback migration written (if applicable)
- [ ] Environment variables verified (all environments)
- [ ] Feature flags configured (if applicable)
- [ ] Security scan passed
- [ ] Performance budget met
- [ ] Accessibility compliance verified
- [ ] Stakeholder approval received (major/minor releases)

## Deployment

- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Run regression suite on staging
- [ ] QA sign-off received
- [ ] Deploy to production
- [ ] Verify SSL certificate
- [ ] Verify DNS resolution
- [ ] Run smoke tests on production

## Post-Deployment

- [ ] Monitoring checked (Sentry errors, response times)
- [ ] Database migration verified
- [ ] Edge functions operating normally
- [ ] Auth flow working
- [ ] Payment flow working
- [ ] Vercel Analytics showing traffic
- [ ] Rollback plan confirmed
- [ ] Team notified (Slack #deployments)
- [ ] Release tagged in Git
- [ ] Release notes published (if major/minor)
