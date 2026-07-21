# Bundle Optimization

## Targets

| Asset | Budget |
|-------|--------|
| Total JavaScript (initial load) | < 250 KB |
| Initial CSS | < 100 KB |
| Homepage total | < 2 MB |
| Third-party scripts | Minimal |

## Techniques

### Tree Shaking

Next.js automatically tree-shakes unused exports in production builds. Ensure:

- All imports are named (`import { Button } from '@/components/ui/button'`) not wildcard (`import * from '...'`)
- Library imports are specific (`import { formatDistance } from 'date-fns'`) not barrel (`import { formatDistance } from 'date-fns'` is fine; `import { formatDistance } from './utils'` may cause issues)
- Side-effect-free packages use `"sideEffects": false` in package.json

### Code Splitting

Next.js automatically code-splits by route. Additionally:

```typescript
// Dynamic import for heavy components
const DataGrid = dynamic(() => import('@/components/ui/data-grid'), {
  loading: () => <Skeleton className="h-96" />,
});

// Dynamic import for chart library
const Chart = dynamic(() => import('@/components/ui/chart'), {
  ssr: false, // Chart libraries often need browser APIs
});
```

### Remove Dead Code

- Remove unused exports (TypeScript `noUnusedLocals: true` helps catch these)
- Remove console.log statements in production (use the logger from Book 24)
- Remove commented-out code
- Use `@next/bundle-analyzer` to audit bundle contents

### Analyze Bundle Size

```bash
npm install @next/bundle-analyzer
# Add to next.config.ts:
// const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
// Run: ANALYZE=true npm run build
```

### Optimize Dependencies

| Action | Impact |
|--------|--------|
| Remove unused dependencies | Reduces install size, build time |
| Replace heavy libraries with lighter alternatives | Direct JS bundle reduction |
| Use date-fns over moment.js | 75% size reduction |
| Import individual Lodash functions instead of full library | 90% size reduction |
| Use Radix UI primitives instead of full component libraries | Custom sizing |

### Dependency Audit

```bash
# Check bundle size of dependencies
npx cost-of-modules

# Find duplicate packages
npx dpdm src/app/page.tsx --tree
```

## Checklist

- [ ] No wildcard imports (`import *`)
- [ ] Heavy components use `dynamic()` imports
- [ ] Chart libraries use `ssr: false`
- [ ] Bundle analyzer run and reviewed
- [ ] Unused dependencies removed
- [ ] Lodash imports are path-specific (`import debounce from 'lodash/debounce'`)
- [ ] Moment.js replaced with date-fns (or use built-in Intl)
