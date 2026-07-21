# Versioning

## Version Schema

This project follows [Semantic Versioning](https://semver.org/):

```
v{major}.{minor}.{patch}
```

| Component | When to Increment | Example |
|-----------|-------------------|---------|
| Major | Breaking changes, major rewrites | `v1.0.0` → `v2.0.0` |
| Minor | New features, non-breaking additions | `v1.0.0` → `v1.1.0` |
| Patch | Bug fixes, security patches | `v1.0.0` → `v1.0.1` |

## Pre-Release Tags

| Tag | Meaning | Example |
|-----|---------|---------|
| `-alpha.1` | Internal testing | `v1.0.0-alpha.1` |
| `-beta.1` | External testing | `v1.0.0-beta.1` |
| `-rc.1` | Release candidate | `v1.0.0-rc.1` |

## Release History

| Version | Date | Highlights |
|---------|------|------------|
| v0.1.0 | Feb 2026 | Internal MVP |
| v0.2.0 | Mar 2026 | Card management |
| v0.3.0 | Mar 2026 | Admin portal |
| v0.4.0 | Apr 2026 | Testing + security |
| v1.0.0-rc.1 | Apr 2026 | Release candidate |
| **v1.0.0** | **May 2026** | **Public launch** |

## Versioning Rules

| Rule | Description |
|------|-------------|
| Version in code | `package.json` version field |
| Version in docs | README.md and CHANGELOG.md |
| Git tag | Every release gets `git tag vX.Y.Z` |
| Breaking changes | Always major version bump, even if "small" |
| Deprecation | Mark deprecated APIs one version before removal |

## Versioning Process

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Update CHANGELOG.md

# 3. Commit
git add package.json CHANGELOG.md
git commit -m "chore: bump version to v1.0.1"

# 4. Tag
git tag v1.0.1

# 5. Push
git push && git push --tags
```
