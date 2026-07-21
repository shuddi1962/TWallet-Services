# TWallet Services — Requirements Index

This file is an index. Detailed functional and non-functional requirements are specified inside each Book.

## Functional Requirements (by Book)

| Area                | Book | Document                                   |
| ------------------- | ---- | ------------------------------------------ |
| Project Foundation  | 01   | `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md` |
| Business Requirements | 02 | `01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md` |
| Information Architecture | 03 | `03-Architecture/BOOK_03_INFORMATION_ARCHITECTURE.md` |
| Design System       | 04   | `02-UI-UX/BOOK_04_DESIGN_SYSTEM.md` |
| Software Requirements Spec | 05 | `01-Foundation/BOOK_05_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` |
| User Experience & User Flows | 06 | `02-UI-UX/BOOK_06_USER_EXPERIENCE_AND_USER_FLOWS.md` |
| Database Architecture | 07 | `04-Database/BOOK_07_DATABASE_ARCHITECTURE.md` |
| Database Schema     | 08   | `04-Database/BOOK_08_DATABASE_SCHEMA.md` |
| Authentication System | 09 | `05-Authentication/BOOK_09_AUTHENTICATION_SYSTEM.md` |
| Wallet Integration  | 10   | `06-Wallet/BOOK_10_WALLET_INTEGRATION.md` |
| Third-Party Integrations & APIs | 10A | `01-Foundation/BOOK_10A_THIRD_PARTY_INTEGRATIONS.md` |
| Crypto Payments     | 11   | `08-Payments/BOOK_11_CRYPTO_PAYMENTS.md` |
| System Architecture | 12   | `01-Foundation/BOOK_12_SYSTEM_ARCHITECTURE.md` |
| Card Ordering       | 13   | `07-Cards/` |
| Customer Dashboard  | 14   | `09-Customer/` |
| Admin Dashboard     | 15   | `10-Admin/BOOK_15_ADMIN_DASHBOARD/` (modular folder — 18 files) |
| API Specification  | 16   | `15-API/BOOK-16-API/` (modular folder — 17 files + 14 OpenAPI contracts) |
| Supabase Architecture | 17 | `17-Supabase/BOOK-17-SUPABASE/` (16 files) |
| Database SQL & Migrations | 18 | `18-Database-SQL/BOOK-18-DATABASE-SQL/` (7 SQL scripts) |
| Component Library  | 19   | `19-Components/BOOK-19-COMPONENT-LIBRARY/` (7 files) |
| Design Tokens      | 20   | `20-Design-Tokens/BOOK-20-DESIGN-TOKENS/` (4 files) |
| Testing Strategy   | 21   | `21-Testing/BOOK-21-TESTING-STRATEGY/` (5 files) |
| Deployment & Operations | 22 | `22-Deployment/BOOK-22-DEPLOYMENT-OPERATIONS/` (2 files) |
| Master OpenCode Implementation Guide | 23 | `23-Master-Guide/BOOK-23-MASTER-OPENCODE-GUIDE/` |
| Security & Compliance | 21 | `21-Security/BOOK-21-SECURITY/` (16 files + security/ enterprise docs + ADRs) |
| Testing & Quality Assurance | 22 | `22-Testing/BOOK-22-TESTING/` (17 files + qa/ enterprise docs) |
| DevOps & Deployment | 23 | `23-DevOps/BOOK-23-DEVOPS/` (15 files + `ops/` 10 enterprise docs) |
| Monitoring & Logging | 24 | `24-Monitoring/BOOK-24-MONITORING/` (15 files + `observability/` 7 enterprise docs) |
| Performance Optimization | 25 | `25-Performance/BOOK-25-PERFORMANCE/` (15 files) |
| SEO & Marketing | 26 | `26-SEO/BOOK-26-SEO/` (15 files) |
| Analytics & Business Intelligence | 27 | `27-Analytics/BOOK-27-ANALYTICS/` (15 files + `docs/analytics/` 7 enterprise docs) |
| Developer Handbook | 28 | `28-Handbook/BOOK-28-DEVELOPER/` (15 files) |
| OpenCode AI Build Instructions | 29 | `29-AI-Build/BOOK-29-OPENCODE/` (15 files + `.ai/` 3 context files) |
| Production Launch Checklist & Operations Playbook | 30 | `30-Launch/BOOK-30-PRODUCTION/` (16 files) |

## Non-Functional Requirements (Summary)

- **Security:** RLS on all tables; no custody of keys/seeds; verified on-chain payments; OWASP-aligned.
- **Performance:** LCP < 2.5s on 4G; INP < 200ms; Core Web Vitals "Good".
- **Availability:** Target 99.9% for MVP.
- **Accessibility:** WCAG 2.1 AA.
- **Compatibility:** Modern evergreen browsers; iOS/Android via responsive PWA-ready web.
- **Compliance:** KYC/AML hook (Phase 2); GDPR data export/erasure.

> Note: Full functional and non-functional requirement enumeration lives in `01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md`. This file remains an index.
