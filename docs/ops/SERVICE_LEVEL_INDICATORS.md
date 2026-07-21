# Service Level Indicators (SLIs)

## Availability SLIs

| Indicator | Source | Calculation |
|-----------|--------|-------------|
| API availability | Uptime Robot | Successful checks / total checks × 100 |
| Database availability | Supabase Dashboard | Uptime metric |
| Auth availability | Vercel Analytics + Sentry | Successful auth requests / total auth requests × 100 |
| Payment availability | Supabase Edge Function logs | Successful verifications / total verification requests × 100 |

## Performance SLIs

| Indicator | Source | Calculation |
|-----------|--------|-------------|
| API response p50 | Sentry | 50th percentile of API transaction durations |
| API response p95 | Sentry | 95th percentile of API transaction durations |
| API response p99 | Sentry | 99th percentile of API transaction durations |
| LCP | Vercel Analytics | Largest Contentful Paint |
| CLS | Vercel Analytics | Cumulative Layout Shift |
| INP | Vercel Analytics | Interaction to Next Paint |

## Quality SLIs

| Indicator | Source | Calculation |
|-----------|--------|-------------|
| Error rate (5xx) | Sentry | 5xx responses / total responses × 100 |
| JS error rate | Sentry | JS errors / pageviews × 100 |
| Auth failure rate | Supabase Logs | Failed auth attempts / total auth attempts × 100 |
| Payment failure rate | Edge Function logs | Failed verifications / total verifications × 100 |

## Throughput SLIs

| Indicator | Source | Calculation |
|-----------|--------|-------------|
| Requests per minute | Vercel Analytics | Count |
| Active users | Vercel Analytics | Count |
| Concurrent connections | Supabase Logs | Count |
| Database connections | Supabase Logs | Count |

## Data Freshness SLIs

| Indicator | Source | Calculation |
|-----------|--------|-------------|
| Realtime latency | Supabase Logs | Event received time — event created time |
| Database replication lag | Supabase Logs | Current — replayed LSN |
| Backup freshness | aws s3 | Time since last backup |
