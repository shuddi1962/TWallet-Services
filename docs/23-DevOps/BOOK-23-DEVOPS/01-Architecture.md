# Architecture

## Production Architecture

```
Users
  │
  ▼
Cloudflare DNS (twalletservices.com)
  │
  ▼
Vercel Edge Network (CDN + SSL termination)
  │
  ├── Static assets (cache at edge)
  └── Next.js App (Edge + Serverless Functions)
        │
        ├── Server Components (RSC)
        ├── Server Actions (POST endpoints)
        ├── API Routes (Route Handlers)
        └── Middleware (session refresh, headers)
              │
              ▼
        Supabase
        ├── Auth (GoTrue — JWT sessions)
        ├── PostgreSQL 16 (RLS, functions, triggers)
        ├── Storage (avatars, documents, card-art)
        ├── Edge Functions (payment verification, admin)
        └── Realtime (order status, notifications)
              │
              ▼
        External Services
        ├── WalletConnect (wallet connection relay)
        ├── Alchemy RPC (on-chain verification)
        └── Resend (transactional email)
```

## Data Flow

| Flow | Path | Protocol |
|------|------|----------|
| Page request | User → Cloudflare → Vercel → Next.js → HTML | HTTPS |
| API call | Client → Next.js Route Handler → Supabase | HTTPS + JWT |
| Payment verify | Client → Edge Function → Alchemy RPC → Supabase | HTTPS + service_role |
| Realtime | Supabase → Client (WebSocket) | WSS + JWT |
| Upload | Client → Supabase Storage (signed URL) | HTTPS + JWT |
| Email | Server Action → Resend API → User inbox | HTTPS + API key |

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Vercel over self-hosted | Zero-config Next.js, edge CDN, preview deploys |
| Supabase over custom backend | PostgreSQL + Auth + Storage + Realtime in one platform |
| Edge Functions over serverless | Lower latency for payment verification |
| Route Handlers over Server Actions (admin) | Standard REST for third-party integrations |
