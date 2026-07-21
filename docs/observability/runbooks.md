# Observability — Runbooks

## Database Recovery

```
1. Check Supabase Dashboard → Database → Status
2. If down:
   - Check connection pool usage
   - Check for long-running queries
   - Kill blocking queries if needed
3. If corrupted:
   - Initiate point-in-time recovery
   - Estimated downtime: < 1 hour
4. Verify:
   - Run SELECT 1
   - Check query performance
   - Verify application connectivity
```

## High Error Rate

```
1. Open Sentry → Issues → Sort by count (1h)
2. Identify the error type and endpoint
3. Check if related to recent deployment
4. If deploy-related:
   - Rollback Vercel deployment
   - Notify #deployments
5. If not deploy-related:
   - Check external dependencies (Alchemy, WalletConnect)
   - Check database performance
   - Check rate limits
```

## Payment Failure Spike

```
1. Check payment Edge Function logs in Supabase
2. Identify error codes (see Book 11 error catalog)
3. Common causes:
   - Network congestion (retry)
   - Invalid transaction parameters (user error)
   - RPC failure (check Alchemy status)
   - Double-spend protection (tx already used)
4. If systemic:
   - Disable payments via feature flag
   - Notify users via status page
   - Escalate to payment lead
```

## Auth Outage

```
1. Check Supabase Auth logs
2. Check for rate limiting on auth endpoints
3. Check if user can reach Supabase
4. Common causes:
   - Supabase Auth rate limit exceeded (upgrade plan)
   - JWT secret rotated without notice
   - Cookie/session configuration issue
5. Resolution:
   - Verify JWT secrets match
   - Check cookie settings in middleware
   - Restart Edge Functions if needed
```

## Slow API Response

```
1. Check Sentry Performance → find slowest endpoint
2. Check if recent deployment added regression
3. Check database query performance (pg_stat_statements)
4. Common causes:
   - Missing index (add migration)
   - N+1 query pattern (fix with join/eager loading)
   - External API latency (add caching)
   - Memory pressure (scale Vercel function)
```

## Reference

See `24-Monitoring/BOOK-24-MONITORING/` for full specification.
