# Benchmarking

## Benchmark Scenarios

| Scenario | Page/Flow | Metrics |
|----------|-----------|---------|
| Homepage | Landing page | LCP, CLS, INP, TTFB, JS size |
| Dashboard | Customer dashboard | LCP, API latency, DB queries |
| Orders | Order listing + detail | API latency, pagination perf |
| Wallet Connect | Connect wallet flow | Wallet call latency, RPC response |
| Checkout | Card ordering flow | API latency, payment verification time |
| Admin | Admin dashboard | Query performance, chart rendering |
| Support | Support ticket flow | Search latency, pagination |
| Reports | Admin report generation | Query complexity, export time |

## Benchmark Metrics

| Metric | How to Measure | Tool |
|--------|---------------|------|
| Load time | `performance.timing.loadEventEnd - navigationStart` | Lighthouse |
| Memory usage | `performance.memory.usedJSHeapSize` | Chrome DevTools |
| CPU usage | Long tasks > 50ms | Performance panel |
| API latency | Sentry transaction duration | Sentry |
| Database queries | Count + duration | Supabase Logs + pg_stat_statements |
| JS bundle size | `next build` output | Bundle analyzer |
| Time to interactive | Lighthouse TTI metric | Lighthouse |

## Running Benchmarks

### Local Benchmark

```bash
# Lighthouse
npx lighthouse https://twallet.app --view --preset=desktop
npx lighthouse https://twallet.app --view --preset=desktop --throttling.cpuSlowdownMultiplier=4

# Bundle analysis
ANALYZE=true npm run build

# Database query analysis
# Run in Supabase SQL Editor:
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...;
```

### CI Benchmark

```bash
# Lighthouse CI (part of CI pipeline)
npx lhci autorun

# k6 load testing (when needed)
k6 run tests/performance/api-load-test.js
```

### Production Benchmark

Vercel Analytics and Sentry provide real-user measurements continuously. No manual steps required.

## Benchmark Baseline

Initial baseline measurements should be captured at launch:

| Metric | Baseline | Date |
|--------|----------|------|
| Homepage LCP | < 2.5s | Launch |
| Dashboard LCP | < 2.5s | Launch |
| API p50 | < 200ms | Launch |
| API p95 | < 500ms | Launch |
| Lighthouse score | 95+ | Launch |
| Total JS | < 250 KB | Launch |
| Page weight | < 2 MB | Launch |

## Benchmark Frequency

| Benchmark | Frequency | When |
|-----------|-----------|------|
| Lighthouse CI | Every PR | In CI pipeline |
| Bundle analysis | Weekly | Monday morning |
| k6 load test | Monthly | Before major release |
| Full performance audit | Quarterly | Before quarterly release |
| Real-user CWV | Continuous | Vercel Analytics |
