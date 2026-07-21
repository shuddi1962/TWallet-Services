# Health Checks

## Endpoints

Three standard health endpoints MUST be implemented:

| Endpoint | Purpose | Expected Status |
|----------|---------|-----------------|
| `GET /api/health` | Liveness — is the app running? | `200 OK` |
| `GET /api/ready` | Readiness — are dependencies available? | `200 OK` |
| `GET /api/version` | Version info | `200 OK` |

## Implementation

### `/api/health`

Lightweight check confirming the application process is alive. No dependency calls.

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

### `/api/ready`

Full dependency check. Returns `503` if any critical dependency is unavailable.

```typescript
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    supabase: await checkSupabase(),
    storage: await checkStorage(),
    auth: await checkAuthProvider(),
  };

  const allHealthy = Object.values(checks).every((c) => c.status === 'ok');
  const httpStatus = allHealthy ? 200 : 503;

  return Response.json({ status: allHealthy ? 'ok' : 'degraded', checks }, { status: httpStatus });
}

async function checkDatabase() {
  try {
    const { db } = await getServiceRoleClient();
    await db`SELECT 1`;
    return { status: 'ok' };
  } catch (e) {
    return { status: 'error', message: 'Database unreachable' };
  }
}
```

### `/api/version`

Returns build metadata for deployment tracking.

```typescript
export async function GET() {
  return Response.json({
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0',
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown',
    deployed: new Date().toISOString(),
  });
}
```

## Health Check Integration

| Consumer | Endpoint | Frequency |
|----------|----------|-----------|
| Uptime Robot | `/api/health` | Every 5 minutes |
| Vercel Cron | `/api/ready` | Every minute |
| Load balancer | `/api/health` | Every 10 seconds |
| Deployment pipeline | `/api/ready` | Post-deploy |
