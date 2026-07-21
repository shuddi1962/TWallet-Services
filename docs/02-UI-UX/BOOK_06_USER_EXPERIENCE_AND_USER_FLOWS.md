# Book 06 — User Experience & User Flows

> **TWallet Services · TWallet Card**
> The UX blueprint that guides every UI page OpenCode generates. Defines user experience goals, user types, all end-to-end user flows, page-by-page UX specifications, micro-interactions, state behaviors, timing budgets, and accessibility requirements per flow. This is the document that tells a developer or AI exactly what a page should *feel like* and *behave like* when a user lands on it.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 06 — User Experience & User Flows  |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Author       | Engineering Team                   |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |

### Revision History

| Version | Date       | Author                | Notes                                                                                       |
| ------- | ---------- | --------------------- | ------------------------------------------------------------------------------------------- |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft (UX goals, user types, 12 flows, UX rules, accessibility)                     |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: enterprise expansion — page-by-page UX specs, micro-interactions, timing budgets, state behaviors per flow, mobile UX, form patterns, accessibility per flow. Consolidates UX Research, User Personas, and User Journeys into one comprehensive book. |

### Structural Note (v1.0.0)

This book consolidates what was previously planned as three separate books (UX Research, User Personas, User Journeys) into a single comprehensive UX document. This avoids fragmentation and gives OpenCode one source of truth for all UX decisions. The documentation roadmap has been renumbered accordingly (see `00-Project/CHANGELOG.md`).

---

## Table of Contents

1. [User Experience Goals](#1-user-experience-goals)
2. [UX Principles](#2-ux-principles)
3. [Primary User Types](#3-primary-user-types)
4. [UX Research Summary](#4-ux-research-summary)
5. [Page-by-Page UX Specifications](#5-page-by-page-ux-specifications)
6. [Main User Journey (End-to-End)](#6-main-user-journey-end-to-end)
7. [Homepage Journey](#7-homepage-journey)
8. [Registration Flow](#8-registration-flow)
9. [Login Flow](#9-login-flow)
10. [Email Verification Flow](#10-email-verification-flow)
11. [Wallet Connection Flow](#11-wallet-connection-flow)
12. [Card Ordering Flow](#12-card-ordering-flow)
13. [Crypto Payment Flow](#13-crypto-payment-flow)
14. [Order Tracking Flow](#14-order-tracking-flow)
15. [Support Flow](#15-support-flow)
16. [Admin Flow](#16-admin-flow)
17. [Profile & Settings Flow](#17-profile--settings-flow)
18. [Error Flow](#18-error-flow)
19. [Empty State Flow](#19-empty-state-flow)
20. [Success Flow](#20-success-flow)
21. [Micro-Interactions](#21-micro-interactions)
22. [Form UX Patterns](#22-form-ux-patterns)
23. [Navigation UX](#23-navigation-ux)
24. [Mobile UX](#24-mobile-ux)
25. [State Behaviors Per Page](#25-state-behaviors-per-page)
26. [Timing Budgets Per Task](#26-timing-budgets-per-task)
27. [UX Rules (Mandatory)](#27-ux-rules-mandatory)
28. [Accessibility Per Flow](#28-accessibility-per-flow)
29. [Content & Copy UX Guidelines](#29-content--copy-ux-guidelines)
30. [Glossary](#30-glossary)
31. [References](#31-references)

---

## 1. User Experience Goals

The platform must provide a premium fintech experience that is:

| Attribute        | Definition                                                              | Measured By                    |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------ |
| Fast             | Feels instant; no perceptible wait on interactions.                     | Core Web Vitals, task time     |
| Secure           | User feels their funds and data are safe; no key exposure.              | Trust signals, no-seed policy  |
| Intuitive        | First-time users complete key tasks without help.                       | Task success rate, time-to-first-order |
| Modern           | Current SaaS/fintech conventions; no dated patterns.                    | Design review                  |
| Mobile Friendly  | Phone is the primary device; nothing is desktop-only.                   | Mobile task success rate       |
| Accessible       | WCAG 2.1 AA; keyboard and screen reader first.                         | Axe CI, SR testing             |
| Professional     | Enterprise polish; no consumer-flashy elements.                         | Design review                  |

### 1.1 North Star

> **Every user should be able to complete any major task in under 3 minutes.**

Major tasks: Register, Connect Wallet, Order a Card, Pay, Track an Order, Open a Support Ticket.

### 1.2 Trust as a UX Goal

Trust is a first-class UX attribute for a crypto fintech product. It is built through:

- Never asking for seed phrases or private keys (visible policy).
- Transparent payment verification (user sees tx status, not a black box).
- Clear, honest error messages (no technical jargon).
- Visible security indicators (HTTPS, verification badges, audit trail).
- Professional, calm visual design (no urgency tactics, no dark patterns).

---

## 2. UX Principles

| ID    | Principle                          | Rule                                                                    |
| ----- | ---------------------------------- | ----------------------------------------------------------------------- |
| UX-01 | One primary action per screen      | Each page has exactly one obvious next step; secondary actions are visually subordinate. |
| UX-02 | Never overload users               | Progressive disclosure; show what's needed now, reveal details on demand. |
| UX-03 | Always show progress               | Multi-step flows show a progress indicator; user always knows where they are. |
| UX-04 | Always confirm successful actions  | Every state change results in visible confirmation (toast, badge, or page change). |
| UX-05 | Always provide a way back          | Every page has a back/cancel path; no dead ends.                        |
| UX-06 | Minimize cognitive load            | Group related actions; use familiar patterns; avoid novel interactions.  |
| UX-07 | Feedback is immediate              | Every interaction has visual feedback within 100ms.                    |
| UX-08 | Errors are recoverable             | Every error tells the user what happened and what to do next.           |
| UX-09 | Motion explains change             | Animations show cause and effect; never decorate.                      |
| UX-10 | Content is scannable               | Users scan, not read; headings, bullets, and visual hierarchy guide the eye. |
| UX-11 | Consistency over creativity        | Use the same pattern for the same action everywhere; novelty costs trust. |
| UX-12 | Mobile is not a lesser experience  | Mobile has full feature parity; patterns adapt, features don't disappear. |

---

## 3. Primary User Types

### 3.1 Guest (Unauthenticated)

| Can                          | Cannot                        |
| ---------------------------- | ----------------------------- |
| Browse homepage              | Order card                    |
| View cards                   | Connect wallet                |
| View pricing                 | Access dashboard (`/app`)     |
| Read FAQ                     | View transactions             |
| Contact support              | Open support tickets (requires account) |
| Register                     | Access admin portal           |
| Log in                       |                               |

### 3.2 Registered User (Customer)

| Can                          | Cannot                        |
| ---------------------------- | ----------------------------- |
| Log in / log out             | Access admin portal           |
| Manage profile               | Modify orders after payment   |
| Connect / disconnect wallet  | Access other users' data      |
| Order card (physical/virtual)| Bypass verification steps     |
| Track orders                 |                               |
| View transactions            |                               |
| Open support tickets         |                               |
| Update settings              |                               |

### 3.3 Administrator

| Can                          | Cannot                        |
| ---------------------------- | ----------------------------- |
| Manage users                 | (Super Admin only: manage admins, platform settings) |
| Manage orders (state transitions) |                     |
| Manage cards                 |                               |
| View all transactions        |                               |
| Manage support tickets       |                               |
| View analytics               |                               |

### 3.4 Super Administrator

Everything an Administrator can do, plus:

| Can                          |
| ---------------------------- |
| Manage admin accounts        |
| Configure platform settings  |
| Manage receiving wallets     |
| View audit logs              |
| Access all `/admin/settings` |

> Detailed personas live in Book 01 §6. This section defines role-based UX capabilities.

---

## 4. UX Research Summary

### 4.1 Research Approach

The UX decisions in this book are informed by:

| Method                   | Application                                                |
| ------------------------ | ---------------------------------------------------------- |
| Competitive analysis     | Stripe, Revolut, Coinbase, Vercel, Linear, Apple.         |
| Persona-driven design    | 4 personas from Book 01 §6 (Maya, Daniel, Aisha, Sam).    |
| Heuristic evaluation     | Nielsen's 10 heuristics applied to each flow.              |
| Accessibility-first      | WCAG 2.1 AA checklist applied to every page spec.         |
| Mobile-first prototyping | Every flow designed at 320px before desktop.              |
| Crypto-native conventions| WalletConnect patterns, MetaMask UX, Trust Wallet UX.      |

### 4.2 Key Findings

| Finding                              | UX Implication                                              |
| ------------------------------------ | ----------------------------------------------------------- |
| Users fear losing funds to scams     | Prominent "we never ask for your seed phrase" messaging.    |
| Crypto users expect wallet-based UX  | Standard WalletConnect flow; no custom key handling.        |
| Payment status is a top anxiety      | Real-time verification status; no black boxes.              |
| Onboarding is the biggest drop-off   | Minimize steps; progress indicators; clear next actions.    |
| Mobile is the primary device         | Bottom tab bar; thumb-friendly targets; no hover-dependent flows. |
| Admins need context, not pretty charts | Tables with search/filter/pagination; data density over decoration. |
| Trust signals reduce abandonment     | Security badges, transparent process, FAQ accessible from any page. |

### 4.3 Heuristic Evaluation Checklist (Applied to Every Flow)

| Heuristic                  | Check                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Visibility of system status| User always knows what's happening (loading, pending, done).|
| Match real world           | Language is familiar; no jargon without explanation.        |
| User control & freedom     | Cancel, back, undo are always available.                    |
| Consistency & standards    | Same action = same pattern across the app.                  |
| Error prevention           | Validation prevents errors before they happen.              |
| Recognition over recall    | Options are visible; user doesn't have to remember.         |
| Flexibility & efficiency   | Shortcuts for power users (keyboard nav, quick actions).    |
| Aesthetic & minimalist     | No irrelevant information; every element earns its place.   |
| Error recovery             | Errors are actionable, not just informative.                |
| Help & documentation       | FAQ, tooltips, and help accessible from any context.        |

---

## 5. Page-by-Page UX Specifications

Each page specification follows this structure:

```
Page: [route]
Purpose: [one sentence]
Primary Action: [the one thing the user should do]
Secondary Actions: [subordinate actions]
Layout: [desktop / mobile description]
States: [loading / empty / error / success behavior]
Micro-interactions: [notable interactions]
Timing: [expected load + interaction time]
Accessibility: [key a11y requirements]
```

### 5.1 Public Pages

#### 5.1.1 `/` — Homepage

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Convince the visitor to register and order a card.                |
| Primary Action     | "Get Started" / "Order Your Card" CTA → `/auth/register`           |
| Secondary Actions  | "Login" (header), "How It Works", "Pricing", "Cards" links         |
| Layout (desktop)   | Sticky header → hero → features → card showcase → dashboard preview → security → pricing preview → testimonials → FAQ preview → newsletter → footer |
| Layout (mobile)    | Hamburger header → hero → features (stacked) → card showcase (carousel) → security → pricing preview → testimonials → FAQ → newsletter → footer |
| States             | Loading: skeleton hero; Error: generic page error; Success: N/A (static) |
| Micro-interactions | Hero text fade-in on load; card hover lift; feature icon animate on scroll into view; FAQ accordion expand/collapse |
| Timing             | LCP < 2.0s; interactive < 2.5s                                     |
| Accessibility      | Skip-to-content link; heading hierarchy h1→h2→h3; all CTAs keyboard focusable; FAQ accordion is ARIA-compliant |

#### 5.1.2 `/how-it-works`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Explain the 6-step process from signup to card delivery.           |
| Primary Action     | "Get Started" CTA at the bottom → `/auth/register`                 |
| Secondary Actions  | Links to /cards, /pricing, /faq                                     |
| Layout             | Step-by-step vertical timeline (1–6); each step has icon, title, description, and optional illustration |
| States             | Static content; no loading states needed (RSC)                     |
| Micro-interactions | Steps fade-in + slide-up on scroll into view (stagger 100ms)       |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Ordered list semantic (`<ol>`); steps are headings                 |

#### 5.1.3 `/cards`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Showcase physical and virtual card options.                        |
| Primary Action     | "Order Now" on each card → `/auth/register` (or `/app/order` if authed) |
| Secondary Actions  | "Compare Cards" (scroll to comparison table), "View Pricing"      |
| Layout             | Two-card hero (Physical vs Virtual) → comparison table → benefits → fees → supported networks |
| States             | Static content (RSC)                                               |
| Micro-interactions | Card images tilt on hover (desktop); tap to flip (mobile)          |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Comparison table has `<th scope>`; card images have descriptive alt |

#### 5.1.4 `/pricing`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Transparent pricing for cards and shipping.                        |
| Primary Action     | "Get Started" CTA → `/auth/register`                               |
| Secondary Actions  | "View Cards", FAQ section on page                                  |
| Layout             | Pricing cards (Physical, Virtual) → shipping fees table → supported networks → FAQ accordion |
| States             | Static (RSC); FAQ accordion interactive (client island)            |
| Micro-interactions | Pricing card hover lift; FAQ accordion expand/collapse             |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Price is semantically marked; FAQ uses ARIA accordion pattern       |

#### 5.1.5 `/about`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Company story, mission, vision, values.                            |
| Primary Action     | "Join Us" CTA → `/auth/register`                                   |
| Secondary Actions  | Links to /security, /contact                                        |
| Layout             | Story → mission/vision cards → core values grid → timeline         |
| States             | Static (RSC)                                                       |
| Micro-interactions | Timeline items slide-in on scroll                                   |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Heading hierarchy; timeline is semantic `<ol>`                     |

#### 5.1.6 `/security`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Build trust by explaining security posture.                        |
| Primary Action     | "Get Started" CTA → `/auth/register`                               |
| Secondary Actions  | Links to /faq, /contact                                             |
| Layout             | Security pillars (wallet, encryption, compliance, privacy) → best practices for users |
| States             | Static (RSC)                                                       |
| Micro-interactions | Shield icon animation on scroll into view                          |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Icons have aria-labels; content is semantic                        |

#### 5.1.7 `/faq`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Answer common questions grouped by topic.                          |
| Primary Action     | "Contact Support" CTA at bottom → `/contact`                       |
| Secondary Actions  | Category tabs (Cards, Payments, Wallets, Shipping, Accounts, Security) |
| Layout             | Category tab bar → accordion list of questions per category         |
| States             | Static content; interactive tabs + accordions (client island)      |
| Micro-interactions | Tab switch slide; accordion expand/collapse with rotate icon       |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | ARIA tabs + accordion pattern; keyboard navigable                  |

#### 5.1.8 `/support`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Entry point for help: tickets, knowledge base, contact, status.    |
| Primary Action     | "Open a Ticket" → `/auth/login` (if not authed) or `/app/support`  |
| Secondary Actions  | Knowledge base, contact form, status page link                     |
| Layout             | Help options grid (ticket, KB, contact, status) → popular articles |
| States             | Static (RSC) with interactive links                                 |
| Micro-interactions | Option cards hover lift                                             |
| Timing             | LCP < 2.0s                                                         |
| Accessibility      | Option cards are links with descriptive text                       |

#### 5.1.9 `/contact`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Let visitors send a message.                                       |
| Primary Action     | "Send Message" (form submit)                                       |
| Secondary Actions  | Email/phone/office info; Google Maps embed                         |
| Layout             | Contact info left (desktop) / top (mobile) → contact form right/bottom → map |
| States             | Loading: button spinner; Success: toast + form reset; Error: inline validation |
| Micro-interactions | Form field focus ring; submit button loading state                 |
| Timing             | Form submit < 2s                                                   |
| Accessibility      | Labels associated with inputs; error announced via aria-live; form is keyboard navigable |

### 5.2 Authentication Pages

#### 5.2.1 `/auth/register`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Create a new account.                                              |
| Primary Action     | "Create Account" (submit)                                          |
| Secondary Actions  | "Login" link, "Accept Terms" checkbox                              |
| Layout             | Centered card on muted background; brand mark at top               |
| Fields             | Name, Email, Password, Confirm Password, Accept Terms checkbox     |
| States             | Loading: button spinner; Success: redirect to verify-email; Error: inline validation per field |
| Micro-interactions | Password strength meter animates as user types; field focus ring   |
| Timing             | Submit < 2s; redirect < 1s                                         |
| Accessibility      | Labels above inputs; error text aria-live; password toggle is a button with aria-label |
| Critical           | **No field ever requests a seed phrase or private key.**           |

#### 5.2.2 `/auth/login`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Authenticate an existing user.                                     |
| Primary Action     | "Login" (submit)                                                   |
| Secondary Actions  | "Register" link, "Forgot Password" link                            |
| Layout             | Centered card; brand mark at top                                    |
| Fields             | Email, Password (with show/hide toggle)                            |
| States             | Loading: button spinner; Success: redirect to /app; Error: inline message |
| Micro-interactions | Field focus ring; password toggle eye icon                         |
| Timing             | Submit < 1s; redirect < 1s                                         |
| Accessibility      | Labels above inputs; error aria-live; toggle is a button            |

#### 5.2.3 `/auth/forgot-password`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Send a password reset email.                                       |
| Primary Action     | "Send Reset Link" (submit)                                         |
| Secondary Actions  | "Back to Login" link                                               |
| Layout             | Centered card                                                       |
| Fields             | Email                                                              |
| States             | Loading: button spinner; Success: "Check your email" message; Error: inline |
| Micro-interactions | Field focus ring                                                    |
| Timing             | Submit < 2s                                                        |
| Accessibility      | Label above input; success message aria-live                       |

#### 5.2.4 `/auth/reset-password`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Set a new password using a reset token.                            |
| Primary Action     | "Reset Password" (submit)                                          |
| Secondary Actions  | "Back to Login" link                                               |
| Layout             | Centered card                                                       |
| Fields             | New Password, Confirm Password                                     |
| States             | Loading: spinner; Success: redirect to /app; Error: inline; Token invalid: error page with "request new link" |
| Micro-interactions | Password strength meter                                             |
| Timing             | Submit < 2s                                                        |
| Accessibility      | Labels above inputs; password toggle button                        |

#### 5.2.5 `/auth/verify-email`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Confirm email verification status.                                 |
| Primary Action     | "Resend Email" (if not verified) or "Continue to Dashboard" (if verified) |
| Secondary Actions  | "Back to Login"                                                    |
| Layout             | Centered card with status icon (success/check or pending/clock)    |
| States             | Success: green check + continue button; Pending: clock icon + resend; Failed: error icon + resend |
| Micro-interactions | Check icon scale-in on success; resend button has cooldown (30s)   |
| Timing             | Verification check < 2s                                            |
| Accessibility      | Status announced via aria-live; icon has aria-label                 |

### 5.3 Customer Application Pages

#### 5.3.1 `/app` — Overview

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | At-a-glance status of the user's account.                          |
| Primary Action     | "Order New Card" (if no cards) or "View Orders"                     |
| Secondary Actions  | Quick actions: connect wallet, view transactions, open ticket      |
| Layout (desktop)   | Sidebar + topbar → stat cards row → recent orders table → wallet status card → notifications |
| Layout (mobile)    | Bottom tab bar → stat cards (horizontal scroll) → recent orders → wallet status |
| States             | Loading: skeleton stat cards + table; Empty: illustration + CTA; Error: error card with retry |
| Micro-interactions | Stat card numbers count-up on load; notification bell badge pulse  |
| Timing             | Data load < 500ms (p95); interactive < 100ms                       |
| Accessibility      | Stat cards are semantic; table has th scope; skip-to-content link  |

#### 5.3.2 `/app/cards`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | View owned cards and order new ones.                               |
| Primary Action     | "Order New Card" → `/app/order`                                    |
| Secondary Actions  | View card details (`/app/cards/:id`); freeze (future)              |
| Layout             | Card grid (1 col mobile, 2-3 col desktop) → each card shows type, status, last4 |
| States             | Loading: skeleton cards; Empty: illustration + "Order Your First Card" CTA; Error: error card |
| Micro-interactions | Card hover lift; card tap → details page                           |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Cards are links; status is a badge with icon + text                |

#### 5.3.3 `/app/order` — Order Wizard (see §12 for full flow)

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Guide user through card selection → shipping → review → payment → confirmation. |
| Primary Action     | "Continue" (step forward)                                          |
| Secondary Actions  | "Back" (step back), "Cancel" (abort to /app/orders)                |
| Layout             | Step indicator at top → step content below → nav buttons at bottom  |
| States             | Loading: button spinner on submit; Error: inline per field; Success: transition to next step |
| Micro-interactions | Step indicator animates on progress; form fields slide-in per step |
| Timing             | Step transition < 300ms                                            |
| Accessibility      | Step indicator is ARIA progressbar; forms are keyboard navigable   |

#### 5.3.4 `/app/orders`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | View order history and track current orders.                       |
| Primary Action     | Click an order to view details                                     |
| Secondary Actions  | Filter by status (All / Pending / Paid / Shipped / Delivered / Cancelled) |
| Layout             | Filter tabs → order list (table on desktop, cards on mobile)       |
| States             | Loading: skeleton list; Empty: illustration + "Order a Card" CTA; Error: error card |
| Micro-interactions | Filter tab slide indicator; row hover highlight                    |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Filter tabs are ARIA tabs; table has th scope; rows are links       |

#### 5.3.5 `/app/orders/:id` — Order Details

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Show order details and tracking timeline.                          |
| Primary Action     | "Track Order" (if shipped) or "Pay Now" (if pending)               |
| Secondary Actions  | "Contact Support" (with order context), "Back to Orders"           |
| Layout             | Order summary card → tracking timeline → payment details → support link |
| States             | Loading: skeleton; Error: error card; Success: status badge per state |
| Micro-interactions | Timeline items animate in; status badge color matches state        |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Timeline is semantic; status badge has icon + text                 |

#### 5.3.6 `/app/transactions`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | View verified payment history.                                     |
| Primary Action     | Click a transaction to view details                                 |
| Secondary Actions  | Export history (CSV), filter by type                               |
| Layout             | Filter bar → transactions table (date, type, amount, tx hash, status) |
| States             | Loading: skeleton table; Empty: illustration + "Make Your First Payment" message; Error: error card |
| Micro-interactions | Row hover; tx hash is monospace + truncated with copy button        |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Table has th scope; tx hash copy button has aria-label              |

#### 5.3.7 `/app/wallet`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Manage connected wallet(s).                                        |
| Primary Action     | "Connect Wallet" (if none) or "Disconnect" (if connected)          |
| Secondary Actions  | View wallet address, network badge, connection history              |
| Layout             | Wallet card (address, network, status) → connect button / disconnect → "What is wallet connection?" info |
| States             | Loading: spinner during connection; Empty: illustration + "Connect Wallet" CTA; Error: connection error with retry |
| Micro-interactions | Wallet picker modal slide-in; address truncation with copy; network badge |
| Timing             | Connection depends on wallet app; UI feedback < 100ms              |
| Accessibility      | Wallet picker is ARIA dialog; address is selectable text           |
| Critical           | **No seed phrase or private key input, anywhere, ever.** Prominent "We never ask for your seed phrase" notice. |

#### 5.3.8 `/app/profile`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | View and edit personal information and shipping address.           |
| Primary Action     | "Save Changes" (form submit)                                       |
| Secondary Actions  | Cancel (discard changes)                                           |
| Layout             | Two sections: Personal Info (name, email read-only) → Shipping Address (for physical cards) |
| States             | Loading: skeleton; Success: toast "Profile updated"; Error: inline validation |
| Micro-interactions | Field focus ring; save button loading state; success toast slide-in |
| Timing             | Save < 1s                                                          |
| Accessibility      | Labels above inputs; success toast aria-live                       |

#### 5.3.9 `/app/security`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Manage password and sessions.                                      |
| Primary Action     | "Change Password" (submit)                                         |
| Secondary Actions  | View active sessions; "Revoke Session" per session                 |
| Layout             | Change password form → active sessions list                        |
| States             | Loading: spinner; Success: toast; Error: inline validation         |
| Micro-interactions | Session revoke confirm dialog                                      |
| Timing             | Save < 1s                                                          |
| Accessibility      | Form labels; confirm dialog is ARIA alertdialog                     |

#### 5.3.10 `/app/settings`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Manage preferences (theme, notifications, privacy).               |
| Primary Action     | Toggle settings (switches)                                         |
| Secondary Actions  | N/A (changes save automatically or via "Save" button)              |
| Layout             | Settings sections: Appearance (theme — future), Notifications (email toggles), Privacy |
| States             | Loading: skeleton; Success: toast "Settings saved"; Error: inline  |
| Micro-interactions | Switch toggle animation; toast slide-in                            |
| Timing             | Toggle < 200ms (optimistic update)                                 |
| Accessibility      | Switches are ARIA switch role; labels associated                    |

### 5.4 Admin Portal Pages

#### 5.4.1 `/admin` — Overview

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | System overview with key metrics.                                  |
| Primary Action     | Drill into a metric (e.g., click "Pending Orders" → /admin/orders?filter=pending) |
| Secondary Actions  | View recent activity, charts                                       |
| Layout             | Stat cards row → revenue chart → orders chart → recent activity table |
| States             | Loading: skeleton stat cards + charts; Error: error card with retry |
| Micro-interactions | Chart hover tooltip; stat card hover                               |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Charts have data table fallback; stat cards are semantic            |

#### 5.4.2 `/admin/users`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Manage users (search, view, suspend, delete).                      |
| Primary Action     | Click a user to view details                                       |
| Secondary Actions  | Search, filter, suspend, delete (with confirmation)                |
| Layout             | Search bar → users table (name, email, status, orders count, joined date) → pagination |
| States             | Loading: skeleton table; Empty: "No users found"; Error: error card |
| Micro-interactions | Search debounced (300ms); row hover; suspend/delete confirm dialog  |
| Timing             | Search < 500ms; load < 500ms                                       |
| Accessibility      | Table has th scope; confirm dialog is ARIA alertdialog; search has aria-label |

#### 5.4.3 `/admin/orders`

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Purpose            | Manage orders and transition states.                               |
| Primary Action     | Click an order to view details / transition state                   |
| Secondary Actions  | Filter by status, search, bulk actions                             |
| Layout             | Filter tabs → orders table → pagination                            |
| States             | Loading: skeleton; Empty: "No orders found"; Error: error card     |
| Micro-interactions | State transition confirm dialog; filter tab slide                   |
| Timing             | Load < 500ms                                                       |
| Accessibility      | Filter tabs ARIA; table th scope; transition dialog is alertdialog  |

#### 5.4.4–5.4.9 Other Admin Pages

(See Book 03 §10 for route inventory; detailed UX per admin page follows the same pattern: search/filter → table → pagination → detail view. Admin pages prioritize data density and efficiency over decoration.)

---

## 6. Main User Journey (End-to-End)

```text
Guest
  ↓
Homepage (/)
  ↓
Explore Products (/cards, /pricing)
  ↓
Register (/auth/register)
  ↓
Verify Email (/auth/verify-email)
  ↓
Login (/auth/login)
  ↓
Dashboard (/app)
  ↓
Connect Wallet (/app/wallet)
  ↓
Choose Card (/app/order)
  ↓
Fill Shipping Details (/app/order/shipping) [physical only]
  ↓
Review Order (/app/order/review)
  ↓
Approve Crypto Payment (/app/order/payment)
  ↓
Blockchain Confirmation (server-side verification)
  ↓
Order Created (status: paid)
  ↓
Track Order (/app/orders/:id)
  ↓
Receive Card (status: delivered)
```

### 6.1 Journey Timing Budget

| Step                  | Target Time          |
| --------------------- | -------------------- |
| Homepage → Register   | < 30s (browse + click) |
| Register → Verify     | < 1min (fill + submit)  |
| Verify → Login        | < 30s (click email link) |
| Login → Dashboard     | < 2s (redirect)       |
| Dashboard → Wallet Connected | < 1min (connect) |
| Wallet → Order Started | < 30s (navigate + select) |
| Order → Payment       | < 2min (fill + review + pay) |
| Payment → Confirmation | < 10s (verification)  |
| **Total: Register → Confirmation** | **< 5 min** |
| **Total: Login → Confirmation (returning user)** | **< 3 min** |

---

## 7. Homepage Journey

```text
Landing (/)
  ↓
Hero (headline + subtext + CTA)
  ↓
Features (3-4 key features)
  ↓
Card Showcase (physical + virtual)
  ↓
Dashboard Preview (screenshot/mockup)
  ↓
Security (trust signals)
  ↓
Pricing Preview (starting price + link)
  ↓
Testimonials (social proof)
  ↓
FAQ (3-4 common questions)
  ↓
Newsletter (email capture)
  ↓
Footer (links, legal, brand)
```

### 7.1 Homepage UX Rules

- Hero CTA is the single most prominent element on the page.
- Each section has one heading + one subtext + one visual.
- Scroll-driven fade-in animations (stagger, max 8 items).
- "Get Started" CTA repeated at hero and bottom of page.
- Footer is accessible from anywhere on the page (sticky not required).

---

## 8. Registration Flow

```text
Register (/auth/register)
  ↓
Enter Name
  ↓
Enter Email
  ↓
Enter Password (with strength meter)
  ↓
Confirm Password
  ↓
Accept Terms (checkbox)
  ↓
Create Account (submit)
  ↓
[if error: inline validation, stay on page]
  ↓
Verification Email Sent
  ↓
Verify (/auth/verify-email)
  ↓
Login (/auth/login)
```

### 8.1 Registration UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Password strength meter       | Shows weak/fair/strong as user types.               |
| Email validation              | Real-time format check; uniqueness check on submit. |
| Confirm password              | Must match; error on mismatch.                      |
| Terms checkbox                | Required; link to terms opens in new tab.           |
| Submit button                 | Disabled until all fields valid + terms accepted.   |
| Error messages                | Affirmative + actionable ("Enter a valid email").   |
| Success                       | Redirect to `/auth/verify-email` with email shown.  |
| Rate limit                    | 5 registrations / 15 min / IP.                      |
| **No seed phrase field**      | **No field anywhere requests a seed or private key.** |

---

## 9. Login Flow

```text
Login (/auth/login)
  ↓
Enter Email
  ↓
Enter Password (with show/hide toggle)
  ↓
Authenticate
  ↓
[if error: "Invalid email or password", stay on page]
  ↓
[if not verified: redirect to /auth/verify-email]
  ↓
Dashboard (/app)
```

### 9.1 Login UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Password toggle               | Eye icon shows/hides password; aria-label "Show password". |
| Error message                 | Generic "Invalid email or password" (no enumeration of which is wrong). |
| Unverified user               | Redirect to verify-email with message.              |
| Remember me                   | Session persists via Supabase Auth cookies (default). |
| Rate limit                    | 5 attempts / 15 min / IP; on exceed: "Try again later". |
| Redirect after login          | `/app` (or return URL if redirected from a guarded page). |

---

## 10. Email Verification Flow

```text
Register → Email Sent
  ↓
User opens email
  ↓
Clicks verification link
  ↓
[if valid: verified → redirect to /app]
  ↓
[if expired: /auth/verify-email with "link expired, resend"]
  ↓
[if already verified: redirect to /app]
```

### 10.1 Verification UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Verify-email page             | Shows pending state with "Resend Email" button (30s cooldown). |
| Success                       | Green check icon scales in; "Continue to Dashboard" button. |
| Expired link                  | Clock icon; "Link expired" + "Resend" button.       |
| Resend cooldown               | 30s between resends; button shows countdown.        |
| Already verified              | Auto-redirect to `/app`.                            |

---

## 11. Wallet Connection Flow

```text
Dashboard (/app) or Wallet page (/app/wallet)
  ↓
Click "Connect Wallet"
  ↓
Wallet Picker opens (modal or dropdown)
  ↓
Choose Wallet:
  • MetaMask
  • Coinbase Wallet
  • Trust Wallet (via WalletConnect)
  • Other (via WalletConnect)
  ↓
Wallet app opens (user's own wallet)
  ↓
User approves connection in their wallet
  ↓
[if rejected: error with retry, no data written]
  ↓
Wallet address captured (read-only)
  ↓
Wallet Connected → UI updates to show address + network
  ↓
Return to Dashboard / current page
```

### 11.1 Wallet Connection UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| **No seed phrase input**      | **Prominent notice: "We never ask for your seed phrase."** |
| Standard protocols only       | WalletConnect v2, MetaMask injected, Coinbase SDK.  |
| Read-only address             | Platform stores address only; no signing, no broadcasting. |
| Connection errors             | User-friendly message + "Try Again" button.         |
| Wallet picker                 | ARIA dialog; keyboard navigable; Esc to close.      |
| Disconnect                    | One-click disconnect from /app/wallet; confirm for safety. |
| Multiple wallets              | One connected wallet at a time (MVP); reconnect to switch. |
| Network badge                 | Shows which chain the wallet is on (e.g., Ethereum, Polygon). |

### 11.2 Wallet Connection States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| Not connected        | Illustration + "Connect Wallet" primary button.           |
| Connecting           | Spinner + "Connecting to [wallet name]..."                |
| Connected            | Address (truncated, copyable) + network badge + "Disconnect". |
| Connection failed    | Error icon + message + "Try Again" button.                |
| Disconnected         | Return to "Not connected" state.                          |

---

## 12. Card Ordering Flow

```text
Dashboard (/app) → "Order New Card"
  ↓
/app/order — Select Card Type:
  • Physical Card
  • Virtual Card
  ↓
[if physical:] /app/order/shipping — Shipping Address:
  • Full name, address line 1, address line 2, city, state, postal code, country
  ↓
[if virtual:] skip shipping
  ↓
/app/order/review — Review Order:
  • Card type, price, shipping (if physical), total
  • "Back" to edit, "Continue to Payment"
  ↓
/app/order/payment — Crypto Payment:
  • Receiving address (with copy button + QR code)
  • Amount + chain
  • "I've Sent the Payment" → submit tx hash
  • OR wallet opens to sign (if connected wallet matches chain)
  ↓
/app/order/confirmation — Order Confirmed:
  • Order ID, status: paid
  • "Track Order" → /app/orders/:id
  • "Back to Dashboard" → /app
```

### 12.1 Order Wizard UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Step indicator                | Visible at top: Step 1 / 2 / 3 / 4 / 5.             |
| Back button                   | Always available; preserves entered data.           |
| Cancel                        | Returns to /app; order not created until confirmation step. |
| Form persistence              | Wizard data persists in state across steps (not saved to DB until order submit). |
| Validation per step           | Can't proceed to next step until current step is valid. |
| Shipping (physical only)      | Virtual card skips shipping step entirely.          |
| Review step                   | Shows complete summary before payment; no surprises. |
| Precondition                  | User must be authenticated + email verified + wallet connected to start. |

### 12.2 Step Indicator UX

```text
[1 Card Type] —— [2 Shipping] —— [3 Review] —— [4 Payment] —— [5 Confirmation]
   ✓ done         ✓ done         ● current       ○ pending       ○ pending
```

- Completed steps: check icon + primary color.
- Current step: filled circle + primary color.
- Pending steps: empty circle + muted color.
- Clickable: completed steps are clickable to go back; current and future are not.

---

## 13. Crypto Payment Flow

```text
Order Summary (/app/order/payment)
  ↓
Display Receiving Address + Amount + Chain
  ↓
User sends payment from their own wallet (outside platform)
  ↓
Option A: User submits tx hash manually
  ↓
Option B: User clicks "Pay with [Wallet]" → wallet opens → user signs → tx broadcast
  ↓
Blockchain Confirms (N confirmations)
  ↓
System Verifies Transaction (Edge Function):
  • Correct address ✓
  • Correct amount ✓
  • Correct chain ✓
  • N confirmations ✓
  • Not already used ✓
  ↓
[if all pass: order → paid, payment record created]
  ↓
[if any fail: order stays pending, error with reason + retry]
  ↓
Payment Successful → /app/order/confirmation
  ↓
Receipt Generated (payment record with tx hash, amount, chain, verified_at)
  ↓
Notifications sent (email + in-app)
```

### 13.1 Payment UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Receiving address display     | Monospace, truncatable, copy button, QR code.       |
| Amount display                | Clear crypto amount + USD equivalent (if available). |
| Chain display                 | Network badge (e.g., Ethereum, Polygon).            |
| Tx hash submission            | Input field with validation; paste support.         |
| Verification status           | Real-time: "Verifying..." → "Confirmed" / "Failed".  |
| No platform signing           | Platform never signs or broadcasts; user signs in own wallet. |
| Error reasons                 | Specific: "Wrong address", "Wrong amount", "Wrong chain", "Insufficient confirmations", "Already used". |
| Retry                         | User can resubmit a new tx hash if verification fails. |
| Confirmation count            | Show "Waiting for N confirmations (M/N)..." if applicable. |

### 13.2 Payment States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| Awaiting payment     | Address + amount + chain + "I've Sent Payment" button.    |
| Verifying            | Spinner + "Verifying your transaction..."                 |
| Waiting confirmations| Progress bar + "Waiting for confirmations (M/N)"           |
| Verified (success)   | Green check + redirect to confirmation.                   |
| Verification failed  | Red error + reason + "Submit New Transaction" button.     |

---

## 14. Order Tracking Flow

```text
Dashboard (/app) → Orders (/app/orders)
  ↓
Click order → Order Details (/app/orders/:id)
  ↓
Current Status (badge: pending / paid / shipped / delivered / cancelled)
  ↓
Tracking Timeline:
  • Order Placed (date)
  • Payment Verified (date)
  • Card Shipped (date + tracking number)
  • Delivered (date)
  ↓
[if shipped: external tracking link if available]
  ↓
Completed (delivered)
```

### 14.1 Tracking UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Timeline                      | Vertical timeline with icons per state; completed states are filled; future states are muted. |
| Tracking number               | Shown for shipped orders; copyable; link to carrier (if available). |
| Status badge                  | Color-coded per state (pending=warning, paid=success, shipped=info, delivered=success, cancelled=danger). |
| Realtime update               | Order status updates via Supabase Realtime (no page refresh). |

---

## 15. Support Flow

```text
Dashboard (/app) → Support
  ↓
New Ticket
  ↓
Describe Issue (subject + message + optional order link)
  ↓
Submit
  ↓
Ticket Created (status: open)
  ↓
Admin/Agent Reply (status: pending_customer)
  ↓
User Reply (status: pending_agent)
  ↓
Resolved (status: resolved)
  ↓
[if reopened within 7d: status → open]
```

### 15.1 Support UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Ticket form                   | Subject (short), Message (textarea), optional order selector. |
| Order context                 | If ticket relates to an order, user can link it.    |
| Status badge                  | open=warning, pending_customer=info, pending_agent=info, resolved=success. |
| Response time                 | Display SLA: "First response within 24h (business hours)." |
| Notification                  | User gets email + in-app notification on agent reply. |
| Reopen                        | "Reopen Ticket" button visible for 7 days after resolution. |

---

## 16. Admin Flow

```text
Admin Login (/auth/login)
  ↓
Admin Dashboard (/admin)
  ↓
Overview (revenue, orders, users, charts)
  ↓
Navigate to:
  • Users (/admin/users)
  • Orders (/admin/orders)
  • Cards (/admin/cards)
  • Payments (/admin/payments)
  • Wallets (/admin/wallets) [SA only for config]
  • Support (/admin/support)
  • Content (/admin/content)
  • Settings (/admin/settings) [SA only]
  ↓
Logout
```

### 16.1 Admin UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Data density                  | Admin pages prioritize information over whitespace.  |
| Tables                        | Search, filter, sort, pagination, bulk actions.     |
| State transitions             | Confirm dialog for irreversible actions (delete, suspend). |
| Audit trail                   | All admin actions logged; admin sees "last action" indicator. |
| Role badge                    | Admin or Super Admin badge visible in topbar.       |
| RBAC enforcement              | Super Admin-only pages are hidden for regular admins (not just disabled). |
| Keyboard shortcuts            | `/` to focus search; `Esc` to close dialogs.        |

---

## 17. Profile & Settings Flow

### 17.1 Profile Update

```text
/app/profile → Edit fields → Save Changes → Toast "Profile updated"
```

### 17.2 Password Change

```text
/app/security → Enter current password → New password → Confirm → Save → Toast "Password changed"
```

### 17.3 Settings Toggle

```text
/app/settings → Toggle switch → Optimistic update → Toast "Settings saved"
```

### 17.4 UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Optimistic updates            | Settings toggles update UI immediately; revert on error. |
| Email change                  | Requires re-verification (new email gets verification link). |
| Password change               | Requires current password; new password strength meter. |
| Session management            | User can view and revoke active sessions.            |

---

## 18. Error Flow

```text
Something Went Wrong
  ↓
Friendly Message (what happened, in plain language)
  ↓
Retry Button
  ↓
[if retry succeeds: continue]
  ↓
[if retry fails: "Contact Support" link]
```

### 18.1 Error UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| No technical jargon           | Never show stack traces, error codes, or SQL.       |
| Friendly tone                 | "Something went wrong" not "Error 500".             |
| Actionable                    | Always provide a next step (retry, contact support). |
| Logging                       | Technical detail logged server-side (Sentry).       |
| Error boundaries              | App and admin have error boundaries that keep the shell intact. |
| 404                           | Branded 404 with links to key pages.                |
| 403                           | "You don't have access to this page" + redirect option. |
| 429                           | "Too many requests" + retry-after countdown.        |
| 500                           | "Something went wrong on our end" + retry + support link. |
| Network error                 | "Check your connection" + retry.                    |

---

## 19. Empty State Flow

### 19.1 No Orders

```text
No Orders
  ↓
Illustration (empty box / card icon)
  ↓
"You haven't ordered any cards yet"
  ↓
[Order Card] button → /app/order
```

### 19.2 No Wallet Connected

```text
No Wallet Connected
  ↓
Illustration (wallet icon)
  ↓
"Connect your wallet to get started"
  ↓
[Connect Wallet] button → /app/wallet
```

### 19.3 No Transactions

```text
No Transactions
  ↓
Illustration (receipt icon)
  ↓
"Your payment history will appear here"
  ↓
[Order a Card] button → /app/order
```

### 19.4 Empty State UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Always show an illustration   | SVG, 120px, muted tone (per Book 04 §23).           |
| Always show a message         | 1-2 sentences explaining the state.                 |
| Always show a CTA             | Primary button guiding to the next action.          |
| Never show blank space        | Empty states are required, not optional.            |

---

## 20. Success Flow

```text
Green Check Icon
  ↓
Success Message (what was accomplished)
  ↓
Continue Button → next logical page
  ↓
[or: Back to Dashboard]
```

### 20.1 Success UX Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Green check icon              | Scales in with a brief animation (200ms).           |
| Clear message                 | "Order confirmed", "Payment verified", "Profile saved". |
| Next step                     | Always provide a "Continue" or "Back to Dashboard" button. |
| Toast vs page                 | Small successes use toast (settings save); major successes use a page or section (order confirmed). |
| Email confirmation            | Major successes also send an email confirmation.    |

---

## 21. Micro-Interactions

| Interaction          | Trigger                | Animation                    | Duration |
| -------------------- | ---------------------- | ---------------------------- | -------- |
| Button hover         | Mouse enter            | bg color shift               | 150ms    |
| Button press         | Mouse down             | translateY(1px)              | 100ms    |
| Card hover           | Mouse enter            | translateY(-2px) + shadow    | 150ms    |
| Field focus          | Focus                  | Ring appear                  | 100ms    |
| Toast appear         | Action success         | Slide up + fade              | 300ms    |
| Toast dismiss        | Auto (4s) or click     | Slide down + fade            | 200ms    |
| Modal open           | Action trigger         | Backdrop fade + scale(0.96→1)| 200ms    |
| Modal close          | Esc / backdrop click   | Scale(1→0.96) + fade         | 150ms    |
| Tab switch           | Click tab              | Underline slide              | 200ms    |
| Accordion expand     | Click                  | Height expand + icon rotate  | 200ms    |
| Stat count-up        | Page load              | Number animate to value      | 800ms    |
| Skeleton shimmer     | Data loading           | Subtle pulse                 | 1.5s loop|
| Notification badge   | New notification       | Pulse (scale 1→1.1→1)        | 600ms x2 |
| Step indicator       | Step change            | Circle fill + check pop      | 300ms    |
| Copy button          | Click copy             | Icon swap (copy → check)     | 200ms    |

### 21.1 Micro-Interaction Rules

- All interactions respect `prefers-reduced-motion` (disable non-essential).
- No interaction exceeds 500ms (except count-up and shimmer).
- Every interaction has a purpose (feedback, state change, guidance).
- Hover effects have touch equivalents on mobile (active state).

---

## 22. Form UX Patterns

### 22.1 General Form Rules

| Rule                          | Detail                                              |
| ----------------------------- | --------------------------------------------------- |
| Labels above inputs           | No floating labels (MVP); labels are always visible. |
| Required indicator            | `*` after label in danger color.                    |
| Help text                     | Below input, before error, small muted text.        |
| Error text                    | Below input, small danger text; announced via aria-live. |
| Validation timing             | On blur after first attempt; on submit; real-time for password strength. |
| Submit button                 | Disabled until required fields valid; shows spinner on submit. |
| Success                       | Toast for minor updates; redirect for major ones.   |
| Spam protection               | Rate limiting on all form endpoints.                |

### 22.2 Field Types & Behavior

| Field Type   | Behavior                                                  |
| ------------ | --------------------------------------------------------- |
| Text         | Standard input; maxLength per field.                      |
| Email        | Real-time format validation; uniqueness on submit.        |
| Password     | Show/hide toggle; strength meter on registration.         |
| Number       | Numeric keyboard on mobile; tabular-nums.                 |
| Textarea     | Auto-grow up to max-height; character count if limited.   |
| Select       | Radix UI Select; searchable for long lists.               |
| Checkbox     | 20px; label to the right; keyboard operable.              |
| Radio        | Radix UI RadioGroup; 20px; keyboard operable.             |
| Switch       | Radix UI Switch; for settings; optimistic update.         |
| Address      | Multi-field (line 1, line 2, city, state, postal, country).|
| Tx hash      | Monospace; paste support; length validation.              |
| Wallet address| Monospace; truncatable; copy button.                     |

---

## 23. Navigation UX

### 23.1 Public Navigation

| Element          | Behavior                                                |
| ---------------- | ------------------------------------------------------- |
| Header           | Sticky; white; 1px bottom border.                       |
| Logo             | Click → `/` (home).                                     |
| Nav links        | Hover: text color shift; active: primary color.         |
| CTA ("Dashboard")| Primary button in header.                               |
| Mobile           | Hamburger → full-width drawer; tap outside to close.    |

### 23.2 App Navigation (Customer)

| Element          | Behavior                                                |
| ---------------- | ------------------------------------------------------- |
| Sidebar (desktop)| Fixed left; 260px; nav items with icons.                |
| Active item      | Primary-light bg + primary text + 3px left bar.         |
| Bottom tab bar (mobile) | 4 items (Overview, Cards, Orders, Wallet) + "More" drawer. |
| Topbar           | Brand, notifications bell, user menu (profile, security, settings, logout). |
| Breadcrumbs      | Where applicable (e.g., Orders / #1024).                |

### 23.3 Admin Navigation

| Element          | Behavior                                                |
| ---------------- | ------------------------------------------------------- |
| Sidebar          | Same shell as app; admin nav items; role badge at top.  |
| Mobile           | Hamburger → slide-in drawer (full sidebar).             |
| Topbar           | Brand, "Admin" badge, notifications, user menu.         |

### 23.4 Navigation Rules

- Active state is always visible (user knows where they are).
- Back button is always available (browser back works; explicit back buttons in flows).
- No more than 8 items in a sidebar (cognitive load).
- Mobile: max 5 items in bottom tab bar; rest in drawer.
- Keyboard: `Tab` navigates forward; `Shift+Tab` backward; `Enter` activates.

---

## 24. Mobile UX

### 24.1 Mobile-First Principles

| Principle                  | Implementation                                           |
| -------------------------- | -------------------------------------------------------- |
| Thumb-friendly targets     | All interactive elements ≥ 44x44px.                      |
| Bottom-reachable actions   | Primary CTAs in bottom half of screen on mobile.         |
| No hover-dependent flows   | All flows work without hover; hover is enhancement.     |
| Bottom tab bar             | Quick nav for most-used pages.                           |
| Drawer for rest            | Less-used nav items in a slide-in drawer.                |
| Full-width forms           | Inputs and buttons are full-width on mobile.             |
| Sticky CTAs                | Primary action sticks to bottom on long pages (e.g., order review). |
| Responsive tables          | Tables become cards or horizontal-scroll on mobile.      |
| No layout shift            | Skeletons match final content shape.                     |

### 24.2 Mobile Patterns

| Pattern               | Usage                                              |
| --------------------- | -------------------------------------------------- |
| Bottom tab bar        | App navigation (Overview, Cards, Orders, Wallet + More). |
| Slide-in drawer       | Full nav on mobile (public hamburger, app "More"). |
| Sticky bottom CTA     | Order review, payment, confirmation steps.         |
| Full-width cards      | Card lists stack 1-column on mobile.               |
| Horizontal scroll     | Stat cards on overview; card showcase on homepage. |
| Swipe to go back      | Supported by browser; not custom-implemented.      |

---

## 25. State Behaviors Per Page

Every page must implement all four states. Summary of state behavior by page:

| Page                   | Loading                | Empty                       | Error                      | Success             |
| ---------------------- | ---------------------- | --------------------------- | -------------------------- | ------------------- |
| Homepage               | Skeleton hero          | N/A (static)                | Page error                 | N/A                 |
| Register               | Button spinner         | N/A                         | Inline field errors        | Redirect to verify  |
| Login                  | Button spinner         | N/A                         | Inline error               | Redirect to /app    |
| App Overview           | Skeleton stat + table  | Empty illustration + CTA    | Error card + retry         | N/A                 |
| App Cards              | Skeleton cards         | Empty + "Order Card" CTA    | Error card                 | N/A                 |
| App Order wizard       | Button spinner         | N/A                         | Inline errors per step     | Step transition     |
| App Orders             | Skeleton list          | Empty + "Order a Card" CTA  | Error card                 | N/A                 |
| App Transactions       | Skeleton table         | Empty + message             | Error card                 | N/A                 |
| App Wallet             | Spinner (connecting)   | Empty + "Connect Wallet" CTA| Connection error + retry   | Wallet connected    |
| App Profile            | Skeleton form          | N/A                         | Inline errors              | Toast "Saved"       |
| App Settings           | Skeleton               | N/A                         | Inline error               | Toast "Saved"       |
| Admin Overview         | Skeleton stats + charts| N/A                         | Error card                 | N/A                 |
| Admin Users            | Skeleton table         | "No users found"            | Error card                 | N/A                 |
| Admin Orders           | Skeleton table         | "No orders found"           | Error card                 | State transition toast |

---

## 26. Timing Budgets Per Task

| Task                          | Target          | Breakdown                              |
| ----------------------------- | --------------- | -------------------------------------- |
| Register                      | < 1 min         | Fill form (45s) + submit (2s) + redirect (1s) |
| Login                         | < 15 sec        | Fill (10s) + submit (1s) + redirect (1s) |
| Connect wallet                | < 1 min         | Pick (5s) + approve in wallet (30s) + update UI (1s) |
| Order a card (full wizard)    | < 2 min         | Select (15s) + shipping (30s) + review (15s) + pay (30s) + confirm (10s) |
| Payment verification          | < 10 sec        | RPC read (3s) + verify (2s) + confirm (1s) + update UI (1s) |
| Track order (view details)    | < 2 sec         | Page load (500ms) + render (200ms)     |
| Open support ticket           | < 1 min         | Fill (45s) + submit (2s)               |
| Admin: find a user            | < 10 sec        | Search (300ms) + results (200ms)       |
| Admin: transition order       | < 15 sec        | Open order (500ms) + transition (1s) + confirm (10s) |

### 26.1 Performance Perception Rules

| Perceived Speed  | Technique                                              |
| ---------------- | ------------------------------------------------------ |
| < 100ms          | Feels instant; no feedback needed.                     |
| 100ms–1s         | Feels fast; subtle feedback (hover, focus).            |
| 1s–3s            | Feels perceptible; show loading state (skeleton).      |
| 3s–10s           | Feels slow; show progress indicator + status text.     |
| > 10s            | Feels broken; show progress + allow leaving + notify on completion. |

---

## 27. UX Rules (Mandatory)

Every page must contain:

| Element              | Requirement                                              |
| -------------------- | -------------------------------------------------------- |
| Clear Heading        | h1 per page; hierarchy h1→h2→h3.                         |
| Description          | Subtext or description where the purpose isn't obvious.  |
| Primary Action       | Exactly one obvious primary action per screen region.    |
| Secondary Action     | Subordinate actions visually de-emphasized.              |
| Loading State        | Skeleton matching final content shape (no CLS).          |
| Empty State          | Illustration + message + CTA (never blank).              |
| Error State          | Friendly message + retry + support link.                 |
| Success State        | Confirmation (toast or page) + next step.                |
| Back / Cancel        | Always available; no dead ends.                         |
| Responsive           | Works at 320px first; enhances at larger breakpoints.    |
| Accessible           | Keyboard navigable; screen reader tested; WCAG 2.1 AA.   |

---

## 28. Accessibility Per Flow

| Flow                  | Key Accessibility Requirements                          |
| --------------------- | ------------------------------------------------------- |
| Registration          | Labels above inputs; error aria-live; password toggle is button; form keyboard navigable. |
| Login                 | Same as registration; error is generic (security).      |
| Email Verification   | Status announced via aria-live; icon has aria-label.    |
| Wallet Connection     | Wallet picker is ARIA dialog; keyboard navigable; Esc closes. |
| Card Ordering         | Step indicator is ARIA progressbar; forms are keyboard navigable; step back is keyboard accessible. |
| Crypto Payment        | Address is selectable + has copy button with aria-label; QR code has alt text; status announced via aria-live. |
| Order Tracking        | Timeline is semantic; status badge has icon + text (not color alone). |
| Support               | Ticket form is keyboard navigable; messages are in a live region. |
| Admin                 | Tables have th scope; search has aria-label; confirm dialogs are ARIA alertdialog; keyboard shortcuts documented. |
| All Flows             | Skip-to-content link; visible focus ring; no color-only status; prefers-reduced-motion respected. |

---

## 29. Content & Copy UX Guidelines

### 29.1 Voice

- Professional, confident, calm.
- Short sentences; active voice.
- "You" for the user; "we" for the platform.
- No hype words ("revolutionary", "game-changing").
- No fear-based messaging or dark patterns.

### 29.2 UX Copy by Context

| Context           | Rule                                                  | Example                          |
| ------------------ | ----------------------------------------------------- | -------------------------------- |
| Button             | Verb + object                                         | "Place Order" not "Submit"       |
| Heading            | Sentence case in body                                 | "How it works"                   |
| Form label         | Noun, short                                           | "Email" not "Your email address" |
| Form error         | Affirmative + actionable                              | "Enter a valid email"            |
| Empty state        | Tell user what to do next                             | "Order your first card"          |
| Error state        | What happened + what to do                            | "Something went wrong. Try again." |
| Success state      | What was accomplished                                 | "Order confirmed"                |
| Loading            | What's happening                                      | "Verifying your transaction..."  |
| Status badge       | Short, clear                                          | "Pending", "Paid", "Shipped"     |
| Tooltip            | Helpful context                                       | "We never ask for your seed phrase" |
| Notification       | Informative, not noisy                                | "Your order has been shipped"    |

### 29.3 Prohibited Copy

- Never request a recovery phrase or private key.
- Never promise guaranteed returns or financial advice.
- Never use fear, urgency, or manipulation tactics.
- Never use technical jargon without explanation.
- Never use all-caps for emphasis (use weight or color instead).

---

## 30. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| UX                  | User Experience.                                                  |
| User flow           | A sequence of steps a user takes to accomplish a goal.            |
| Micro-interaction   | A small animation or feedback response to a user action.          |
| Empty state         | The UI shown when there is no data to display.                    |
| Skeleton            | A placeholder matching the shape of final content.                |
| Toast               | A transient notification that appears and auto-dismisses.         |
| Wizard              | A multi-step form flow (e.g., card ordering).                     |
| Step indicator      | A visual showing progress through a multi-step flow.              |
| Optimistic update   | UI updates immediately, before server confirms.                   |
| Trust signal        | A UI element that builds user confidence (badge, notice, link).   |
| Bottom tab bar      | Mobile navigation pattern with tabs at the bottom of the screen.  |

---

## 31. References

- Book 01 — Project Foundation (personas, §6)
- Book 02 — Business Requirements (user roles, §7; business rules, §13)
- Book 03 — Information Architecture (routes, §6; navigation, §11; user flows, §12)
- Book 04 — Design System (component APIs, states, motion, accessibility)
- Book 05 — Software Requirements Specification (state machines, §6; acceptance criteria, §23)
- `00-Project/TECH_STACK.md`
- `00-Project/CHANGELOG.md`

### Downstream Books

| Book | Title              | Consumes Book 06 as...                |
| ---- | ------------------ | ------------------------------------- |
| 07   | Database Design & ERD | Data requirements referenced from UX flows. |
| 10   | Component Library  | Component behavior from page UX specs.|
| 11   | Homepage           | Homepage journey (§7) + page spec (§5.1.1). |
| 12   | Authentication     | Registration (§8), Login (§9), Verification (§10) flows. |
| 13   | Wallet Integration | Wallet connection flow (§11).         |
| 14   | Crypto Payments    | Crypto payment flow (§13).            |
| 15   | Card Ordering      | Card ordering flow (§12).             |
| 16   | Customer Dashboard | Page specs (§5.3) + state behaviors (§25). |
| 17   | Admin Dashboard    | Admin flow (§16) + page specs (§5.4). |
| 18   | Support Center     | Support flow (§15).                   |

---

## Next Book

**Book 07 — Database Architecture** (`04-Database/BOOK_07_DATABASE_ARCHITECTURE.md`): the foundational database document defining the philosophy, naming conventions, UUID/audit/soft-delete strategies, full 19-table inventory across 5 domains, high-level entity relationships, indexing strategy, RLS strategy overview, performance considerations, and migration strategy. The "read this first" document for the 6-book database suite (Books 07–12).

---

> End of Book 06 — User Experience & User Flows. This document is the UX blueprint for every page OpenCode generates. Any change to user flows, page UX specs, micro-interactions, or UX rules requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
