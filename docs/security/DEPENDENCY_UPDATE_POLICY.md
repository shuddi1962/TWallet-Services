# Dependency Update Policy — TWallet Services

## Update Cadence

| Update Type | Cadence | Review |
|-------------|---------|--------|
| Patch (1.0.x) | Auto — Dependabot PR | Quick review |
| Minor (1.x.0) | Monthly | Standard review |
| Major (x.0.0) | Quarterly | Full review + testing |
| Security | Within 7 days of advisory | Expedited review |

## Review Requirements

| Check | Minor | Major |
|-------|-------|-------|
| Changelog review | Required | Required |
| Breaking changes | — | Required |
| Migration guide | — | Required |
| Test suite pass | Required | Required |
| Manual QA | — | Required |
| Rollback plan | — | Required |

## Tools

| Tool | Purpose |
|------|---------|
| Dependabot | Automated PRs for dependency updates |
| `npm audit` | Security vulnerability scanning |
| `npm outdated` | Manual review of outdated packages |
| Renovate (future) | Alternative automated dependency manager |

## Package Freezing

Production dependencies are pinned to exact versions. Dev dependencies use semver ranges.

```json
{
  "dependencies": {
    "next": "15.0.0"  // exact
  },
  "devDependencies": {
    "typescript": "^5.5.0"  // range
  }
}
```

## Prohibited Actions

- No `npm update --force` without review
- No installing unverified packages
- No packages with known CVEs at install time
- No packages with excessive permissions in `package.json`
