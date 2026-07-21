# Known Limitations

## v1.0 (MVP)

### Functional
- **Single receiving wallet address** — All customer payments go to a single configured address. Multi-wallet support planned for v1.1.
- **EVM chains only** — Supports Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Smart Chain, Avalanche. No Solana or Bitcoin L2 support until v3.0.
- **No mobile native app** — Mobile experience is responsive web (PWA-ready). React Native app planned for v3.0.
- **No multi-language support** — English only. i18n planned for v1.1.
- **No KYC/AML integration** — Manual verification only. Automated KYC via third-party provider planned for v2.0.

### Geographic
- **US only initially** — Regulatory compliance for EU/Asia pending (v2.0+).
- **No fiat settlement** — Multi-currency fiat rails planned for v3.0.

### Scale
- **10,000 card target** — Architecture supports up to ~100k users. Beyond that requires database read replicas and additional Edge Function capacity.
- **No multi-region deployment** — Single-region (US) Vercel deployment. Multi-region planned for v2.0.

### Technical
- **No offline mode** — Full internet connection required.
- **No progressive web app** — PWA manifest and service worker setup deferred to v1.1.
- **No WebSocket fallback** — Realtime subscriptions require WebSocket support. No polling fallback currently configured.

### Security
- **No bug bounty program** — Security researchers acknowledged but not rewarded.
- **No penetration test** — Third-party pentest scheduled for v1.1.

## Future Resolution

| Limitation | Planned Version |
|------------|-----------------|
| Single receiving address | v1.1 |
| Multi-language | v1.1 |
| KYC/AML integration | v2.0 |
| Multi-region deployment | v2.0 |
| Mobile native app | v3.0 |
| Non-EVM chains | v3.0 |
| Fiat settlement | v3.0 |
