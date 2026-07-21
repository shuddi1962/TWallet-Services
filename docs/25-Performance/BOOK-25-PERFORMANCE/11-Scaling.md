# Scaling Strategy

## Expected Growth Tiers

| Tier | Users | Infrastructure | Monthly Cost Estimate |
|------|-------|---------------|----------------------|
| Launch | < 1,000 | Vercel Pro + Supabase Pro | ~$100 |
| Growth | < 10,000 | Vercel Pro + Supabase Team | ~$200 |
| Scale | < 100,000 | Vercel Enterprise + Supabase Enterprise | ~$1,000+ |
| Enterprise | 100,000+ | Custom architecture | Custom |

## Scaling by Component

### Vercel Auto Scaling

Vercel automatically scales serverless functions based on traffic. No manual scaling required. Key considerations:

- **Concurrency limit:** Vercel Pro has configurable concurrency; Enterprise has custom limits
- **Cold starts:** Can be mitigated with provisioned concurrency (Enterprise) or Edge Functions
- **Region:** Deploy to nearest region to users (default: `iad1` — US East)

### Supabase Plan Upgrade

| Feature | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Database size | 8 GB | 16 GB | Custom |
| Connections | 60 | 150 | Custom |
| Edge Functions | 500k/month | 2M/month | Custom |
| Realtime connections | 200 | 500 | Custom |
| Storage | 100 GB | 200 GB | Custom |
| Daily backups | 7 days PITR | 7 days PITR | Custom |

### Database Optimization

Before scaling vertically:

1. Ensure all queries use indexes (run `pg_stat_statements` analysis)
2. Optimize slow queries with `EXPLAIN ANALYZE`
3. Archive old data (move transactions > 1 year to cold storage)
4. Implement materialized views for expensive aggregations
5. Consider read replicas for reporting workloads

### CDN Caching

Vercel Edge Network serves cached content from 30+ locations globally. Maximize cache hit ratio by:

- ISR for marketing pages
- Cache headers for public assets
- Strategy: public, but verify at edge (stale-while-revalidate)

### Background Processing

| Task | Current Solution | At Scale |
|------|-----------------|----------|
| Payment verification | Edge Function (sync) | Edge Function + webhook |
| Email sending | Server Action (sync) | Queue (Resend batch) |
| Report generation | Server Action (sync) | Queue (pg_cron + Storage) |
| Data cleanup | pg_cron | pg_cron + dedicated worker |
| Image processing | Client-side | Server-side (Storage transform) |

## When to Consider Microservices

Microservices are NOT recommended for MVP. The current monolithic architecture (Next.js + Supabase) is sufficient up to ~100,000 users. Consider extracting to microservices only when:

- Team size exceeds 10 engineers working on the same codebase
- Deployment frequency conflicts between features
- Independent scaling required for specific features
- Specialized infrastructure needs (e.g., ML model serving)

## Monitoring for Scaling

- Monitor database connection pool usage (see Book 24)
- Monitor Vercel function invocation duration and concurrency
- Monitor Sentry for latency trends
- Set alerts for approaching scaling thresholds
