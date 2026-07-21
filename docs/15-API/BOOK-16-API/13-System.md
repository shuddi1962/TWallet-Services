# System API

> Base route: `/api/v1/system`
> Health and version endpoints are public (no auth). Config endpoint requires admin auth.

---

## GET /api/v1/system/health

Health check endpoint. Returns status of all 9 system monitors.

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": {
    "overall": "healthy",
    "checks": [
      { "name": "api", "status": "healthy", "latency_ms": 5 },
      { "name": "database", "status": "healthy", "latency_ms": 23 },
      { "name": "auth", "status": "healthy", "latency_ms": 120 },
      { "name": "storage", "status": "healthy", "latency_ms": 150 },
      { "name": "edge_functions", "status": "healthy", "latency_ms": 80 },
      { "name": "blockchain_rpc", "status": "healthy", "latency_ms": 340 },
      { "name": "email", "status": "healthy", "latency_ms": 200 },
      { "name": "realtime", "status": "healthy", "latency_ms": 45 }
    ],
    "checked_at": "2026-07-21T10:00:00Z"
  }
}
```

### Response `503` (when degraded/down)
```json
{
  "success": false,
  "message": "Some systems are degraded",
  "data": {
    "overall": "degraded",
    "checks": [
      { "name": "blockchain_rpc", "status": "degraded", "latency_ms": 3200, "error": "High latency" },
      { "name": "database", "status": "healthy", "latency_ms": 25 }
    ]
  }
}
```

---

## GET /api/v1/system/version

Get the current application version and build info.

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "build": "20260721.1",
    "commit": "a1b2c3d4",
    "deployed_at": "2026-07-21T08:00:00Z",
    "environment": "production"
  }
}
```

---

## GET /api/v1/system/status

Get platform status information (public-facing). Returns minimal operational status.

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "message": "All systems operational",
    "last_incident": null,
    "uptime_pct_30d": 99.95,
    "maintenance_scheduled": null
  }
}
```

---

## GET /api/v1/system/config

Get non-sensitive system configuration.

**Auth:** JWT + Super Admin

### Response `200`
```json
{
  "success": true,
  "data": {
    "platform_name": "TWallet Card",
    "support_email": "support@twalletservices.com",
    "maintenance_mode": false,
    "features": {
      "kyc_required": false,
      "mfa_required": false,
      "promotions_enabled": true
    },
    "limits": {
      "max_file_size_mb": 10,
      "rate_limit_per_min": 60,
      "max_wallets_per_user": 5
    }
  }
}
```
