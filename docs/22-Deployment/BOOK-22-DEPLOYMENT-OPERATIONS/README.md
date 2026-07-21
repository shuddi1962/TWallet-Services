# Book 22 — Deployment & Operations

> **TWallet Services · TWallet Card**
> Deployment pipeline, environment management, monitoring, incident response.

---

## File Index

| File | Section |
|------|---------|
| `README.md` | Overview, architecture, environments |
| `01-Vercel.md` | Vercel deployment config |
| `02-Supabase.md` | Supabase deployment + migrations |
| `03-Environments.md` | Dev, staging, production setup |
| `04-Monitoring.md` | Sentry, Vercel Analytics, Supabase logs |
| `05-Logging.md` | Structured logging, audit trail |
| `06-Incident-Response.md` | Incident severity, runbooks |
| `07-Backup.md` | Backup + recovery procedures |
| `08-Release.md` | Release process, versioning |
| `09-Rollback.md` | Rollback strategy |
| `10-OpenCode.md` | Build prompt |

## Architecture

```
Developer → GitHub → Vercel (CI/CD) → Production
                                ↕
                         Supabase (DB, Auth, Storage, Edge Functions)
```

## Environments

| Environment | URL | Purpose | Deploy From |
|-------------|-----|---------|-------------|
| Development | `localhost:3000` | Local coding | Local |
| Preview | `*.vercel.app` | PR preview | GitHub PR |
| Staging | `staging.twalletservices.com` | QA + integration tests | `main` branch |
| Production | `twalletservices.com` | Live | Release tag |
