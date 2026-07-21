# Developer FAQ

## Setup

### How do I start the dev server?
```bash
npm run dev
```

### How do I set up Supabase locally?
```bash
supabase start
supabase db push
supabase gen types typescript --local > src/types/supabase.ts
```

### Where are environment variables documented?
See `docs/BOOK-30/BOOK-30-PRODUCTION/06-environment-variables.md` for the full catalog.

## Architecture

### Why Server Components instead of fetching on the client?
Server Components reduce bundle size, improve SEO, and eliminate client waterfalls. Only use Client Components when you need interactivity (event handlers, browser APIs, state).

### When should I use Server Actions vs API routes?
Server Actions for mutations tied to the current user session (auth, wallet, profile, orders). API routes for webhooks, admin batch operations, and public endpoints.

### How do I add a new database table?
1. Add migration: `supabase migration new <name>`
2. Write SQL in the migration file
3. Apply: `supabase db push`
4. Regenerate types: `npm run gen:types`
5. Add RLS policies (never skip this)
6. Commit the migration

## Database

### How do I write RLS policies?
See `docs/BOOK-21/BOOK-21-SECURITY/` and existing policies in `supabase/migrations/` for patterns. Every policy must be scoped to the authenticated user or admin role.

### How do I query the database in RSC?
Use the typed Supabase client in `src/lib/supabase/server.ts`. Never expose the service role key to the client.

## Testing

### How do I run tests?
```bash
npm run test          # Unit + integration
npm run test:e2e     # Playwright
npm run test:coverage # With coverage report
```

### How do I add a test?
Follow the pattern in `docs/BOOK-22/BOOK-22-TESTING/`. Place tests next to the code they test (`*.test.ts` alongside `*.ts`).

## Deployment

### How do I deploy?
Merge to `main` → GitHub Actions runs CI → Vercel auto-deploys. Manual production releases use git tags.

### How do I roll back?
Vercel: promote previous deployment. Database: migration rollback. See `docs/BOOK-30/BOOK-30-PRODUCTION/` for detailed procedures.

## Wallet

### Why don't we store private keys?
Non-custodial model. Users connect their own wallet. We only store the wallet address. We never sign transactions on behalf of users.

### What wallets are supported?
MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, Rainbow. Add more via WalletConnect AppKit configuration.

## Security

### How do I report a vulnerability?
See `docs/SECURITY_CONTACT.md`. Email security@twalletservices.com. Response within 24 hours.

### What security checks run in CI?
- TypeScript strict checking
- ESLint security rules
- Dependabot vulnerability scanning
- RLS policy review (manual gate)

## Documentation

### Where do I find the full documentation?
Start at `docs/MASTER_INDEX.md`. The 30 documentation books are under `docs/BOOK-01/` through `docs/BOOK-30/`.

### How do I add documentation?
If it changes architecture, add an ADR in `docs/adr/`. If it adds a feature, update the relevant Book. File changes in the relevant Book folder.
