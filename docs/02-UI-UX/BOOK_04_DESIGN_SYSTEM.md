# Book 04 — Design System

> **TWallet Services · TWallet Card**
> The single source of truth for the visual language of the entire platform: design tokens, color, typography, spacing, elevation, layout, component specifications, motion, iconography, states, and accessibility. Nothing gets built unless it conforms to this system. Every frontend developer, UI designer, and AI coding tool (including OpenCode) follows this document.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 04 — Design System                 |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |

### Revision History

| Version | Date       | Author                  | Notes                                                                 |
| ------- | ---------- | ----------------------- | --------------------------------------------------------------------- |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (philosophy, palette, type, components, states)         |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Approved: Tailwind v4 token map, TypeScript component APIs, motion specs, a11y contract, dark-mode hooks, canonical config |

### Structural Note (v1.0.0)

Books 04 and 05 originally swapped topics versus the initial plan so the visual language (Design System) would be defined before the interaction patterns. The roadmap has since evolved (see `00-Project/CHANGELOG.md`): Book 04 remains the Design System, Book 05 is the Software Requirements Specification (SRS), and Book 06 is the comprehensive User Experience & User Flows book (consolidating UX Research, User Personas, and User Journeys into one document). The documentation roadmap is now 29 books (Books 01–29).

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Principles](#2-design-principles)
3. [Theme Architecture](#3-theme-architecture)
4. [Color System](#4-color-system)
5. [Typography](#5-typography)
6. [Spacing Scale](#6-spacing-scale)
7. [Border Radius](#7-border-radius)
8. [Shadows & Elevation](#8-shadows--elevation)
9. [Layout & Grid System](#9-layout--grid-system)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Buttons](#11-buttons)
12. [Inputs & Forms](#12-inputs--forms)
13. [Cards](#13-cards)
14. [Tables](#14-tables)
15. [Dashboard / Stat Cards](#15-dashboard--stat-cards)
16. [Badges & Tags](#16-badges--tags)
17. [Modals & Dialogs](#17-modals--dialogs)
18. [Navigation Components](#18-navigation-components)
19. [Icons](#19-icons)
20. [Animations & Motion](#20-animations--motion)
21. [Images & Media](#21-images--media)
22. [Component API Contract](#22-component-api-contract)
23. [State System (Loading / Empty / Error / Success)](#23-state-system-loading--empty--error--success)
24. [Accessibility](#24-accessibility)
25. [Content & Copy Guidelines](#25-content--copy-guidelines)
26. [Theming & Dark Mode Hooks](#26-theming--dark-mode-hooks)
27. [Canonical Tailwind Configuration](#27-canonical-tailwind-configuration)
28. [Design Tokens Export](#28-design-tokens-export)
29. [Component Inventory](#29-component-inventory)
30. [Glossary](#30-glossary)
31. [References](#31-references)

---

## 1. Design Philosophy

TWallet Services follows a premium fintech design language inspired by:

- **Stripe** — clarity, whitespace, typographic confidence
- **Revolut** — product density without clutter
- **Coinbase** — trust through restraint
- **Vercel** — geometric precision, monospace accents
- **Linear** — focus, motion with purpose
- **Apple** — material honesty, hierarchy

The interface must feel:

| Attribute     | Meaning in this product                                   |
| ------------- | --------------------------------------------------------- |
| Premium       | Considered spacing, refined typography, no cheap effects.|
| Clean         | Generous whitespace; every element earns its place.       |
| Modern        | Current SaaS/fintech conventions; no dated skeuomorphism. |
| Trustworthy   | Calm color, predictable layout, no surprise behavior.     |
| Fast          | Feels instant; motion is brief and meaningful.            |
| Professional  | Enterprise polish, not consumer-flashy.                   |

### 1.1 Anti-Patterns (Explicitly Disallowed)

- No clutter or decorative noise.
- No outdated gradients (e.g., 2010s blue-purple ramps).
- No unnecessary animations; motion must serve understanding.
- No drop shadows used as decoration (shadows encode elevation only).
- No rainbow palettes; color is semantic.
- No layout shift on load.
- No modals on top of modals (one dialog at a time).

---

## 2. Design Principles

| ID    | Principle          | Rule                                                                  |
| ----- | ------------------ | --------------------------------------------------------------------- |
| DP-01 | Simplicity         | The simplest viable solution wins; remove before adding.              |
| DP-02 | Consistency        | One component, one behavior, everywhere. Tokens over ad-hoc values.   |
| DP-03 | Accessibility      | WCAG 2.1 AA is the floor; design for keyboard and screen readers first. |
| DP-04 | Mobile First       | Every screen is designed at 320px first, then enhanced.               |
| DP-05 | Component Driven   | UI is composed from documented components; no one-off pages.          |
| DP-06 | Performance First  | Visual choices must not regress Core Web Vitals.                      |
| DP-07 | User Trust         | No dark patterns; predictable, honest interactions.                   |
| DP-08 | Purposeful Motion  | Animations explain change; never decorate.                            |
| DP-09 | Token Discipline   | No raw hex/px in components; only design tokens.                      |
| DP-10 | State Completeness | Every component ships loading/empty/error/success states.             |

---

## 3. Theme Architecture

The platform uses an **area-aware theme**: each application area (public, auth, app, admin) has a defined surface treatment, but all share the same token system.

| Area              | Header        | Body              | Hero / Top         | Cards        | Footer      |
| ----------------- | ------------- | ----------------- | ------------------ | ------------ | ----------- |
| Public Website    | White         | Very Light Gray   | Dark Navy          | White        | Dark Navy   |
| Authentication    | — (none)      | Very Light Gray   | —                  | White        | —           |
| Customer App      | White         | Light Gray        | White              | White        | —           |
| Admin Portal      | White         | Light Gray        | White              | White        | —           |

### 3.1 Default Theme

- **Primary theme:** Light.
- **Dark mode:** Not shipped in MVP; tokens are structured to support it (see §26).

---

## 4. Color System

All colors are defined as semantic tokens that map to Tailwind CSS custom properties. Components reference semantic tokens, never raw hex values.

### 4.1 Brand / Primary

| Token                | Value       | Usage                                  |
| -------------------- | ----------- | -------------------------------------- |
| `--color-primary`    | `#2563EB`   | Primary actions, links, focus rings.   |
| `--color-primary-hover` | `#1D4ED8` | Primary button hover.                  |
| `--color-primary-light` | `#DBEAFE` | Primary tinted backgrounds, badges.    |

### 4.2 Neutrals (Surfaces & Text)

| Token                | Value       | Usage                                  |
| -------------------- | ----------- | -------------------------------------- |
| `--color-bg`         | `#F8FAFC`   | App/body background.                   |
| `--color-surface`    | `#FFFFFF`   | Cards, inputs, panels.                 |
| `--color-border`     | `#E2E8F0`   | Dividers, input borders.               |
| `--color-heading`    | `#0F172A`   | Headings, primary text.                |
| `--color-body`       | `#475569`   | Body copy.                             |
| `--color-muted`      | `#94A3B8`   | Placeholders, captions, disabled.      |
| `--color-footer`     | `#020817`   | Footer background (dark navy).         |
| `--color-hero`       | `#020817`   | Hero background (dark navy).           |

### 4.3 Semantic / Status

| Token                | Value       | Usage                                  |
| -------------------- | ----------- | -------------------------------------- |
| `--color-success`    | `#16A34A`   | Success states, verified, paid.        |
| `--color-warning`    | `#F59E0B`   | Warnings, pending.                     |
| `--color-danger`     | `#DC2626`   | Errors, destructive actions, cancelled.|
| `--color-info`       | `#0EA5E9`   | Informational badges.                  |

### 4.4 Color Usage Rules

- Primary blue is for **action and emphasis only**, never for body text.
- Status colors are **semantic only** — never decorative.
- Body text uses `--color-body` (`#475569`); headings use `--color-heading` (`#0F172A`).
- On dark surfaces (hero, footer), text uses white / `#E2E8F0` for muted.
- All color pairings must meet **WCAG 2.1 AA contrast** (4.5:1 body, 3:1 large text).

### 4.5 Contrast Notes

| Pairing                              | Ratio   | Status |
| ------------------------------------ | ------- | ------ |
| `--color-body` on `--color-bg`       | ~9.7:1  | AAA    |
| `--color-body` on `--color-surface`  | ~9.3:1  | AAA    |
| `--color-muted` on `--color-surface` | ~3.9:1  | AA-large only — use for ≥18px or non-essential |
| White on `--color-primary`           | ~4.6:1  | AA     |
| White on `--color-hero`              | ~18:1   | AAA    |

> `--color-muted` must not be used for body text or critical information; reserve for captions, placeholders, disabled states.

---

## 5. Typography

### 5.1 Font Family

| Token              | Value                                   |
| ------------------ | --------------------------------------- |
| `--font-sans`      | `Geist, Inter, system-ui, sans-serif`   |
| `--font-mono`      | `Geist Mono, ui-monospace, monospace`   |

- **Primary font:** Geist (variable).
- **Fallback:** Inter, then system-ui.
- Loaded via `next/font` (self-hosted, no external request) for performance and CLS prevention.

### 5.2 Weights

| Token           | Value |
| --------------- | ----- |
| `--weight-light`| 300   |
| `--weight-regular` | 400 |
| `--weight-medium` | 500 |
| `--weight-semibold` | 600 |
| `--weight-bold` | 700   |
| `--weight-extrabold` | 800 |

### 5.3 Type Scale

| Token              | Size   | Line Height | Weight | Usage                          |
| ------------------ | ------ | ----------- | ------ | ------------------------------ |
| `--text-hero`      | 64px   | 1.05        | 700    | Homepage hero title.           |
| `--text-hero-sub`  | 22px   | 1.4         | 400    | Hero subtitle.                 |
| `--text-section`   | 40px   | 1.1         | 700    | Section titles.                |
| `--text-card-title`| 24px   | 1.25        | 600    | Card titles, page titles.      |
| `--text-body`      | 16px   | 1.6         | 400    | Body copy (default).           |
| `--text-small`     | 14px   | 1.5         | 400    | Secondary text, table cells.   |
| `--text-caption`   | 12px   | 1.4         | 500    | Captions, badges, labels.       |

### 5.4 Responsive Type (Fluid)

Hero and section titles scale down on smaller viewports via `clamp()`:

| Token            | Desktop | Mobile |
| ---------------- | ------- | ------ |
| `--text-hero`    | 64px    | 40px (`clamp(2.5rem, 6vw, 4rem)`)   |
| `--text-section` | 40px    | 28px (`clamp(1.75rem, 5vw, 2.5rem)`) |

### 5.5 Typographic Rules

- Headings use `--color-heading`; never lighter than 600 weight for titles.
- Body uses `--color-body` at `--text-body` with 1.6 line-height for readability.
- Numbers in financial/stat contexts use `--font-mono` and tabular-nums.
- No all-caps body copy; caps reserved for badges/labels at `--text-caption` with letter-spacing 0.04em.
- Maximum line length for prose: 68ch.

---

## 6. Spacing Scale

A single 4px-based scale powers all padding, margin, and gap values. Components use tokens, never raw px.

| Token          | Value |
| -------------- | ----- |
| `--space-1`    | 4px   |
| `--space-2`    | 8px   |
| `--space-3`    | 12px  |
| `--space-4`    | 16px  |
| `--space-5`    | 20px  |
| `--space-6`    | 24px  |
| `--space-8`    | 32px  |
| `--space-10`   | 40px  |
| `--space-12`   | 48px  |
| `--space-16`   | 64px  |
| `--space-20`   | 80px  |
| `--space-24`   | 96px  |
| `--space-30`   | 120px |

### 6.1 Spacing Rules

- Section padding (vertical): `--space-30` (120px) desktop, `--space-16` (64px) mobile.
- Card padding: `--space-8` (32px) default, `--space-6` (24px) compact.
- Default content gap: `--space-8` (32px).
- Form field gap: `--space-4` (16px).
- Inline element gap: `--space-2` (8px) or `--space-3` (12px).

---

## 7. Border Radius

| Token             | Value    | Usage                              |
| ----------------- | -------- | ---------------------------------- |
| `--radius-sm`     | 8px      | Small chips, inline elements.      |
| `--radius-button` | 14px     | Buttons, inputs.                   |
| `--radius-card`   | 20px     | Cards, panels.                     |
| `--radius-modal`  | 24px     | Modals, large dialogs.             |
| `--radius-pill`   | 999px    | Badges, pills, avatars.            |

### 7.1 Radius Rules

- Inputs and buttons share `--radius-button` for visual rhythm.
- Nested elements use a smaller radius than their container.
- Pills/badges always `--radius-pill`.
- Images inside cards use `--radius-card` minus the card padding inset.

---

## 8. Shadows & Elevation

Shadows encode elevation only — never decoration. Tailwind shadow tokens are mapped to semantic elevation levels.

| Token                | Tailwind     | Usage                                  |
| -------------------- | ------------ | -------------------------------------- |
| `--shadow-xs`        | `shadow-sm`  | Resting inputs, subtle borders.        |
| `--shadow-sm`        | `shadow-sm`  | Badges, dropdowns.                     |
| `--shadow-md`        | `shadow-md`  | Cards (resting).                       |
| `--shadow-lg`        | `shadow-xl`  | Cards (hover), popovers.               |
| `--shadow-hero`      | `shadow-2xl` | Hero card, premium showcase.           |

### 8.1 Elevation Rules

- Resting cards: `--shadow-md`.
- Hover lift: translateY(-2px) + `--shadow-lg`.
- Modals: `--shadow-hero` plus a backdrop scrim.
- Inputs at rest: no shadow, 1px border; focus uses ring, not shadow.

---

## 9. Layout & Grid System

| Token                | Value     |
| -------------------- | --------- |
| `--container-max`    | 1280px    |
| `--content-max`      | 1200px    |
| `--grid-columns`     | 12        |
| `--grid-gap`         | 32px (desktop), 16px (mobile) |
| `--content-padding`  | 24px (desktop), 16px (mobile) |

### 9.1 Grid Rules

- Public pages use a 12-column grid with `--container-max`.
- Content is centered with `--content-padding` horizontal gutters.
- Dashboard layouts use a fluid sidebar + content area, not the 12-col grid.
- Card grids: 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide (responsive auto-fit).
- No element exceeds `--container-max` on large screens.

---

## 10. Responsive Breakpoints

Breakpoints follow Tailwind defaults (mobile-first).

| Token       | Min Width | Tailwind Prefix | Name    |
| ----------- | --------- | --------------- | ------- |
| `mobile`    | 320px     | (default)       | Mobile  |
| `sm`        | 640px     | `sm:`           | Large phone |
| `md`        | 768px     | `md:`           | Tablet  |
| `lg`        | 1024px    | `lg:`           | Laptop  |
| `xl`        | 1280px    | `xl:`           | Desktop |
| `2xl`       | 1536px    | `2xl:`          | Wide    |

### 10.1 Breakpoint Rules

- Styles are written mobile-first; `md:`/`lg:` add enhancements.
- No `max-width` media queries unless absolutely necessary (avoid reversing cascade).
- Bottom tab bar (app) appears below `lg`; sidebar appears at `lg` and up.
- Admin sidebar collapses to a drawer below `lg`.

---

## 11. Buttons

### 11.1 Variants

| Variant    | Background              | Text     | Border              | Usage                       |
| ---------- | ----------------------- | -------- | ------------------- | --------------------------- |
| Primary    | `--color-primary`       | White    | none                | Main action on a screen.    |
| Secondary  | `--color-surface`       | Primary  | 1px `--color-primary` | Alternate action.        |
| Ghost      | transparent             | Body     | none                | Tertiary actions, toolbars. |
| Danger     | `--color-danger`        | White    | none                | Destructive actions.        |
| Success    | `--color-success`       | White    | none                | Confirmations.              |

### 11.2 Sizes

| Size    | Height | Padding (y/x)        | Font      | Radius          |
| ------- | ------ | -------------------- | --------- | --------------- |
| `sm`    | 36px   | 8px / 14px           | 14px/500  | `--radius-button` |
| `md`    | 44px   | 10px / 18px          | 14px/500  | `--radius-button` |
| `lg`    | 52px   | 12px / 22px          | 16px/600  | `--radius-button` |
| `xl`    | 56px   | 14px / 24px          | 16px/600  | `--radius-button` |

### 11.3 States

| State     | Treatment                                                 |
| --------- | --------------------------------------------------------- |
| Hover     | `:hover` → `--color-primary-hover` (primary); bg tint for others. |
| Focus     | `:focus-visible` → 2px ring `--color-primary` at 2px offset. |
| Active    | `:active` → translateY(1px), slightly darker bg.           |
| Disabled  | `opacity-60`, `cursor-not-allowed`, no hover.             |
| Loading   | Replace label with spinner (same width); button non-interactive. |
| Full width| `w-full` modifier available on all sizes.                 |

### 11.4 TypeScript API

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;       // default 'primary'
  size?: ButtonSize;             // default 'md'
  isLoading?: boolean;
  leftIcon?: React.ReactNode;    // Lucide icon
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

### 11.5 Button Rules

- One primary button per screen region; others are secondary/ghost.
- Destructive actions require explicit `danger` variant + confirmation for irreversible ops.
- Icons in buttons are 20px, `--space-2` gap to label.
- Never use a button as a link to non-action navigation; use a Link styled as a button instead (a `Button asChild` pattern).

---

## 12. Inputs & Forms

### 12.1 Text Input

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| Height          | 56px (default), 44px (compact `sm`)     |
| Radius          | `--radius-button` (14px)                |
| Border (rest)   | 1px `--color-border`                    |
| Border (focus)  | 2px `--color-primary` + ring            |
| Border (error)  | 1px `--color-danger`                    |
| Border (success)| 1px `--color-success`                   |
| Background      | `--color-surface`                       |
| Placeholder     | `--color-muted`                         |
| Label           | Above input, `--text-small`/600, `--color-heading` |
| Help text       | Below input, `--text-small`, `--color-muted` |
| Error text      | Below input, `--text-small`, `--color-danger` |
| Padding         | 14px / 16px                             |

### 12.2 Form Layout

- Labels always above inputs (no floating labels in MVP).
- Required fields marked with `*` in `--color-danger` after the label.
- Help text below input, before error text.
- Form field gap: `--space-4` (16px).
- Form sections separated by `--space-8` (32px).
- Submit button aligned to the primary action side (right on desktop, full-width on mobile).

### 12.3 Input Variants

| Variant      | Usage                                            |
| ------------ | ------------------------------------------------ |
| Text         | Single-line text.                                |
| Email        | Email validation.                                |
| Password     | Toggle show/hide; strength meter on registration.|
| Number       | Numeric; tabular-nums.                           |
| Textarea     | Multi-line; min-height 120px.                    |
| Select       | Radix UI Select styled with tokens.              |
| Checkbox     | Radix UI Checkbox; 20px; label right-aligned.    |
| Radio        | Radix UI RadioGroup; 20px.                       |
| Switch       | Radix UI Switch; for settings toggles.           |
| Search       | With leading Lucide `Search` icon, 20px.         |

### 12.4 TypeScript API

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;     // e.g., password toggle
  isRequired?: boolean;
}

interface FormFieldProps {
  name: string;
  label?: string;
  helpText?: string;
  isRequired?: boolean;
  children: React.ReactNode;       // input/control
}
```

### 12.5 Form Rules

- Use `react-hook-form` + `zod` for validation (Book 16).
- Validation messages are affirmative and actionable ("Enter a valid email", not "Invalid").
- Never disable submit on invalid; validate on submit and on blur after first attempt.
- Never store or transmit recovery phrases/private keys in any field (Book 02 BR-03/BR-04).

---

## 13. Cards

### 13.1 Base Card

| Property        | Value                            |
| --------------- | -------------------------------- |
| Background      | `--color-surface`                |
| Radius          | `--radius-card` (20px)           |
| Border          | 1px `--color-border`             |
| Shadow (rest)   | `--shadow-md`                    |
| Shadow (hover)  | `--shadow-lg` + translateY(-2px) |
| Padding         | `--space-8` (32px)               |

### 13.2 Card Variants

| Variant        | Usage                                       |
| -------------- | ------------------------------------------- |
| Default        | Content cards.                              |
| Stat           | Dashboard statistics (see §15).             |
| Interactive    | Clickable; full-card hover lift.            |
| Highlight      | Tinted header (e.g., primary-light banner). |
| Outline        | No shadow, border only.                     |

### 13.3 TypeScript API

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stat' | 'interactive' | 'highlight' | 'outline';
  padding?: 'default' | 'compact' | 'none';
  asChild?: boolean;              // Radix asChild pattern
}
```

### 13.4 Card Rules

- Hover lift applies only to `interactive` cards (never static content cards).
- Cards do not nest cards; use panels/dividers inside.
- Card titles use `--text-card-title`; body uses `--text-body`.

---

## 14. Tables

### 14.1 Properties

| Property          | Value                                              |
| ----------------- | -------------------------------------------------- |
| Container         | `--radius-card` wrapper, 1px border, `--shadow-sm` |
| Header row        | `--color-bg` background, `--color-heading` text, `--text-small`/600 |
| Body rows         | `--color-surface` background, `--text-small` body  |
| Row hover         | `--color-bg` tint                                  |
| Row dividers      | 1px `--color-border`                               |
| Header            | Sticky on vertical scroll                          |
| Cell padding      | 14px / 16px                                        |

### 14.2 Features

- Pagination (page size + page numbers + jump).
- Search input (top-right).
- Column filters (dropdown or range).
- Bulk actions (checkbox column + action bar).
- Responsive: horizontal scroll with sticky first column on mobile.
- Sortable columns with visible sort indicator.
- Empty state inside the table (see §23).

### 14.3 TypeScript API

```ts
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pageSize?: number;
  searchable?: boolean;
  bulkActions?: { label: string; onClick: (rows: T[]) => void }[];
  emptyState?: React.ReactNode;
  rowKey: (row: T) => string;
}
```

### 14.4 Table Rules

- Numbers in financial columns are right-aligned with tabular-nums.
- Status cells use status badges (§16), not colored text alone.
- Row actions appear on row hover (desktop) or in a cell menu (mobile).

---

## 15. Dashboard / Stat Cards

### 15.1 Metrics (MVP)

| Metric              | Source                       |
| ------------------- | ---------------------------- |
| Revenue             | Verified payments sum.       |
| Orders              | Order count by status.       |
| Wallet Balance      | Read-only on-chain (display).|
| Transactions        | Tx count.                    |
| Completion Rate     | Paid / total orders.         |
| Growth              | Period-over-period delta.    |

### 15.2 Stat Card Layout

- Label (`--text-small`, `--color-muted`, caps).
- Value (`--text-card-title`/700, `--color-heading`, tabular-nums).
- Delta badge (up = success, down = danger) optional.
- Icon top-right (Lucide, 24px, `--color-primary` at 20% opacity bg circle).
- Sparkline (optional, 60px tall) using Recharts.

### 15.3 TypeScript API

```ts
interface StatCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  icon?: React.ReactNode;
  sparkline?: number[];
}
```

---

## 16. Badges & Tags

### 16.1 Variants

| Variant   | Background              | Text            | Usage                       |
| --------- | ----------------------- | --------------- | --------------------------- |
| Neutral   | `--color-bg`            | `--color-body`  | Default labels.             |
| Primary   | `--color-primary-light` | `--color-primary` | Informational, new.       |
| Success   | `#DCFCE7`               | `--color-success` | Verified, paid, delivered. |
| Warning   | `#FEF3C7`               | `--color-warning` | Pending, in review.       |
| Danger    | `#FEE2E2`               | `--color-danger`  | Failed, cancelled.        |
| Info      | `#E0F2FE`               | `--color-info`    | Informational.            |

### 16.2 Properties

- Radius: `--radius-pill`.
- Padding: 4px / 10px.
- Font: `--text-caption` (12px), 600 weight, caps off.
- Optional leading dot (8px) in the badge color.

### 16.3 TypeScript API

```ts
type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}
```

---

## 17. Modals & Dialogs

### 17.1 Properties

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| Backdrop        | Black at 50% opacity, blur(4px)         |
| Surface         | `--color-surface`, `--radius-modal`     |
| Shadow          | `--shadow-hero`                         |
| Max width       | 480px (sm), 640px (md), 800px (lg)      |
| Padding         | `--space-8`                             |
| Animation       | Fade + scale(0.96→1), 200ms ease-out    |

### 17.2 Behavior

- One modal at a time (no stacking).
- Close on backdrop click and Esc; focus trapped inside.
- Focus moves to first interactive element on open; restored to trigger on close.
- Destructive actions use `danger` button and require explicit confirmation text for irreversible ops.
- Built on Radix UI Dialog.

### 17.3 TypeScript API

```ts
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

---

## 18. Navigation Components

### 18.1 Public Header

- Sticky, white, 1px bottom border, `--shadow-xs`.
- Logo left, primary nav center/right, CTA + Login right.
- Mobile: hamburger → full-width drawer.

### 18.2 Public Footer

- Dark navy (`--color-footer`), white text, 4-column links.
- Logo + tagline + newsletter on top row.
- Legal row at bottom with copyright + legal links.

### 18.3 App Sidebar (Customer)

- Fixed left on `lg+`, 260px wide, white, 1px right border.
- Brand at top, nav items with Lucide icons (24px).
- Active item: `--color-primary-light` bg, `--color-primary` text, left 3px primary bar.
- Collapses to bottom tab bar on mobile (Overview, Cards, Orders, Wallet) + "More" drawer.

### 18.4 Admin Sidebar

- Same shell as App sidebar but with admin nav (Book 03 §11.4).
- Role badge at top (Admin / Super Admin).
- Collapses to drawer on mobile.

### 18.5 Breadcrumbs

- `Home / Section / Page`, `--text-small`, `--color-muted`, last item `--color-heading`.
- Separators: Lucide `ChevronRight` 14px.
- Hidden on mobile unless deeply nested.

### 18.6 Tabs

- Radix UI Tabs; underline style; active = `--color-primary` 2px underline.
- Used in dashboards for sub-sections (e.g., Orders: All / Pending / Paid / Shipped).

---

## 19. Icons

### 19.1 Library

- **Lucide React** (outline style only).
- Default size: **24px** (context-aware: 16px inline, 20px in buttons, 14px in breadcrumbs).
- Stroke width: 1.5px (Lucide default).
- Color: inherits currentColor; accent uses `--color-primary`.

### 19.2 Icon Rules

- Icons are always accompanied by a text label in nav and buttons.
- Decorative icons get `aria-hidden="true"`; meaningful icons get `aria-label`.
- No emoji as functional icons.
- No mixed icon libraries.

---

## 20. Animations & Motion

### 20.1 Library

- **Framer Motion** for all animation.
- Duration default: **0.3s**.
- Easing: `easeOut` for entrances, `easeInOut` for transitions.

### 20.2 Motion Tokens

| Token            | Duration | Easing    | Usage                          |
| ---------------- | -------- | --------- | ------------------------------ |
| `--motion-fast`  | 150ms    | easeOut   | Hover, tap feedback.           |
| `--motion-base`  | 300ms    | easeOut   | Default transitions.           |
| `--motion-slow`  | 500ms    | easeInOut | Page reveals, large sections.  |

### 20.3 Patterns

| Pattern   | Implementation                                            |
| --------- | --------------------------------------------------------- |
| Fade      | opacity 0→1, 300ms.                                       |
| Slide     | translateY(8px→0) + opacity, 300ms.                       |
| Scale     | scale(0.96→1) + opacity, 200ms (modals).                  |
| Stagger   | Children fade with 60ms delay each (max 8 items).         |
| Hover lift| translateY(-2px) + shadow swap, 150ms.                    |

### 20.4 Motion Rules

- No excessive motion; every animation must explain a change.
- Respect `prefers-reduced-motion`: disable non-essential motion (fade-only fallback).
- No infinite spinners except inline button loading and skeleton shimmer.
- Page transitions: 200ms fade; no slide on route change (keeps it fast).
- Stagger is capped (8 items max) to avoid long reveals.

---

## 21. Images & Media

### 21.1 Formats

| Format | Usage                                      |
| ------ | ------------------------------------------ |
| SVG    | Icons, illustrations, logos (preferred).  |
| WebP   | Photos, card imagery.                      |
| PNG    | Only when transparency + WebP unavailable. |
| AVIF   | Allowed via Next.js Image auto-detection.  |

### 21.2 Rules

- Use `next/image` for all raster images (auto format negotiation + sizing).
- Lazy-load below-the-fold images (`loading="lazy"` via next/image default).
- Responsive `sizes` attribute required on every `next/image`.
- Always provide `alt` text; decorative images get `alt=""`.
- No images over 200KB on initial page load.
- Card imagery uses `--radius-card` matching its container.

---

## 22. Component API Contract

Every component in the system must satisfy this contract.

| Requirement          | Rule                                                        |
| -------------------- | ----------------------------------------------------------- |
| Reusable             | Props-driven; no hardcoded copy in the component body.      |
| Responsive           | Works at 320px first; uses tokens, not fixed px.            |
| Typed                | TypeScript with explicit props interface; no `any`.         |
| States               | Loading, empty, error, success where applicable.           |
| Accessible           | WCAG 2.1 AA; keyboard + screen reader tested.               |
| Dark-mode ready      | Uses semantic tokens, not raw colors.                       |
| Forwarded refs       | Forwards `ref` when it wraps a DOM element.                 |
| `asChild` support    | When composition is needed (Radix pattern).                 |
| No side effects      | Pure presentational; data fetching lives in hooks/pages.    |
| Documented           | One JSDoc line + props table in story (Book 16).            |

---

## 23. State System (Loading / Empty / Error / Success)

Every data-driven component must implement all four states.

### 23.1 Loading States

| Pattern        | Usage                                        |
| -------------- | -------------------------------------------- |
| Skeleton loader| Cards, tables, lists, page sections.         |
| Spinner        | Inline buttons, small areas.                 |
| Progress bar   | Long operations (verification, upload).      |
| Button loading | Replace label with spinner, button disabled. |
| Card loading   | Skeleton matching final card shape.          |

- Skeletons use `--color-bg` blocks with a subtle shimmer (no harsh gray).
- Never use a spinner for page-level loading; use skeletons (prevents CLS).

### 23.2 Empty States

| Element          | Spec                                            |
| ---------------- | ----------------------------------------------- |
| Illustration     | SVG, 120px, muted tone.                         |
| Title            | `--text-card-title`, `--color-heading`.         |
| Message          | `--text-body`, `--color-body`, 1–2 sentences.   |
| Primary CTA      | Button (primary) to take the next action.       |

- Never show a blank area; always guide the user to the next step.

### 23.3 Error States

| Element          | Spec                                            |
| ---------------- | ----------------------------------------------- |
| Icon             | Lucide `AlertCircle` or `TriangleAlert`, danger color. |
| Message          | Friendly, non-technical, actionable.            |
| Retry button     | Primary button, retries the failed operation.   |
| Support link     | Secondary link to `/support`.                   |

- Never expose stack traces or technical error codes to users.
- Log technical detail server-side (Book 15).

### 23.4 Success States

| Element          | Spec                                            |
| ---------------- | ----------------------------------------------- |
| Icon             | Lucide `Check` in a success-colored circle.     |
| Message          | Confirmation of what succeeded.                 |
| Continue button  | Primary button to the next step.                |

---

## 24. Accessibility

WCAG 2.1 AA is the floor.

### 24.1 Requirements

| Area                  | Requirement                                                |
| --------------------- | ---------------------------------------------------------- |
| Keyboard navigation   | All interactive elements reachable + operable via keyboard.|
| Focus visibility      | `:focus-visible` ring on every interactive element.       |
| Focus order           | Logical DOM order; no positive tabindex except exceptions.|
| ARIA labels           | On icon-only buttons, form fields without visible labels. |
| Screen reader         | Semantic HTML; landmarks (header/nav/main/footer).         |
| Color contrast        | 4.5:1 body, 3:1 large text and UI components.              |
| Color not alone       | Status conveyed with icon + text, not color alone.         |
| Motion                | Respect `prefers-reduced-motion`.                          |
| Forms                 | Label associated with input; errors announced via `aria-live`. |
| Tables                | `<th scope>`; caption for data tables.                     |
| Images                | Meaningful `alt`; decorative `alt=""`.                     |
| Links                 | Distinguishable by more than color; underlined or icon.    |

### 24.2 Testing

- Axe DevTools run in CI on key flows.
- Keyboard-only walkthrough of registration, order, payment, support.
- Screen reader spot-checks (NVDA + VoiceOver) on auth + checkout.

---

## 25. Content & Copy Guidelines

### 25.1 Voice

- Professional, confident, calm.
- Short sentences; active voice.
- "You" for the user; "we" for the platform.
- No hype words ("revolutionary", "game-changing").
- No FUD; no dark patterns.

### 25.2 UX Copy Rules

| Element          | Rule                                                  |
| ---------------- | ----------------------------------------------------- |
| Buttons          | Verb + object ("Place Order", not "Submit").          |
| Headings         | Sentence case ("How it works", not "How It Works" in body). |
| Form labels      | Noun, short ("Email", not "Your email address").      |
| Errors           | Affirmative + actionable ("Enter a valid email").     |
| Empty states     | Tell the user what to do next.                        |
| Numbers          | Tabular-nums; consistent decimals.                    |
| Currency         | Always with currency code (USD, EUR) or symbol.       |

### 25.3 Prohibited Content

- Never request a recovery phrase or private key in any copy or field.
- Never promise guaranteed returns or financial advice.
- Never use fear-based messaging.

---

## 26. Theming & Dark Mode Hooks

Dark mode is **not shipped in MVP**, but the token system is structured so it can be added without rework.

### 26.1 Token Strategy

- All components reference semantic tokens (`--color-bg`, `--color-surface`, etc.).
- Tokens are defined as CSS custom properties on `:root`.
- A future `[data-theme="dark"]` selector remaps the same semantic tokens to dark values.
- No component ever hardcodes a hex value.

### 26.2 Tailwind v4 Strategy

- Tailwind v4 uses CSS-first config with `@theme`.
- Semantic color tokens are mapped to Tailwind utilities (e.g., `bg-surface`, `text-body`, `border-border`).
- Switching to dark mode = re-mapping the custom properties; no class changes in components.

### 26.3 What NOT to Do

- Do not use Tailwind's `dark:` variant in components (couples to a single strategy).
- Do not ship partial dark mode (all-or-nothing).
- Do not introduce dark mode before the light theme is fully stable.

---

## 27. Canonical Tailwind Configuration

The canonical Tailwind v4 theme (in `src/styles/globals.css` via `@theme`):

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: "Geist", "Inter", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Color tokens (semantic) */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #DBEAFE;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-heading: #0F172A;
  --color-body: #475569;
  --color-muted: #94A3B8;
  --color-footer: #020817;
  --color-hero: #020817;
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-danger: #DC2626;
  --color-info: #0EA5E9;

  /* Spacing scale (4px base) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-30: 120px;

  /* Radius */
  --radius-sm: 8px;
  --radius-button: 14px;
  --radius-card: 20px;
  --radius-modal: 24px;
  --radius-pill: 999px;

  /* Type scale */
  --text-hero: clamp(2.5rem, 6vw, 4rem);
  --text-hero-sub: 1.375rem;
  --text-section: clamp(1.75rem, 5vw, 2.5rem);
  --text-card-title: 1.5rem;
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-caption: 0.75rem;

  /* Layout */
  --container-max: 1280px;
  --content-max: 1200px;

  /* Motion */
  --motion-fast: 150ms;
  --motion-base: 300ms;
  --motion-slow: 500ms;
}
```

### 27.1 Usage in Components

```tsx
// Example: a primary button
<button className="bg-primary text-white rounded-button h-11 px-4
                   hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary
                   transition-[transform,background-color] duration-150 active:translate-y-px">
  Place Order
</button>
```

- Utilities derive from tokens (`bg-primary`, `rounded-button`, `text-body`).
- No raw hex, no raw px for spacing/radius.

---

## 28. Design Tokens Export

Tokens are defined once in CSS (`@theme`) and are the single source. They may be exported to:

| Consumer        | Source of truth                 | Sync mechanism        |
| --------------- | ------------------------------- | --------------------- |
| Tailwind v4     | `@theme` in `globals.css`       | Native                |
| Figma           | Styles matching token names     | Manual / Tokens Studio|
| Storybook       | Reads from `globals.css`        | Native                |
| Docs (Book 16)  | Reads from this book            | Manual                |

> Figma libraries must use the same token names as `@theme` so designers and developers share vocabulary.

---

## 29. Component Inventory

The full component inventory (names, props, stories, status) lives in **Book 16 — Components** (`16-Components/`). This book defines the design system; Book 16 implements it as a library.

### 29.1 Component Categories (Preview)

| Category     | Components                                                       |
| ------------ | ---------------------------------------------------------------- |
| Primitives   | Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Label, Avatar |
| Layout       | Container, Section, Grid, Stack, Divider, Card                  |
| Navigation   | Header, Footer, Sidebar, Tabs, Breadcrumbs, BottomTabBar, Drawer|
| Overlays     | Modal, Drawer, Popover, Tooltip, AlertDialog                     |
| Data display | DataTable, StatCard, KeyValue, Timeline, List                   |
| Feedback     | Toast, Alert, Skeleton, Spinner, ProgressBar, EmptyState, ErrorState, SuccessState |
| Wallet       | WalletConnectButton, WalletPicker, WalletAddress, NetworkBadge  |
| Charts       | Sparkline, BarChart, LineChart (Recharts, themed)               |

> Each component in Book 16 references this design system for tokens, states, and accessibility.

---

## 30. Glossary

| Term            | Definition                                                   |
| --------------- | ------------------------------------------------------------ |
| Design token    | A named design decision (color, size, radius) stored as a variable. |
| Semantic token  | A token named by purpose (`--color-danger`), not by value.   |
| RSC             | React Server Component.                                       |
| Tailwind v4     | CSS-first config via `@theme`.                                |
| WCAG            | Web Content Accessibility Guidelines.                        |
| CLS             | Cumulative Layout Shift (Core Web Vital).                    |
| Tabular-nums    | Monospaced digits for aligned numeric columns.               |
| Skeleton        | Placeholder block matching final content shape.              |
| asChild         | Radix pattern for composition without extra DOM nodes.       |

---

## 31. References

- `01-Foundation/BOOK_01_PROJECT_FOUNDATION.md`
- `01-Foundation/BOOK_02_BUSINESS_REQUIREMENTS.md`
- `03-Architecture/BOOK_03_INFORMATION_ARCHITECTURE.md` — page compositions and navigation patterns
- `00-Project/TECH_STACK.md`
- `00-Project/CHANGELOG.md`

### Downstream Books

| Book | Title              | Consumes Book 04 as...                |
| ---- | ------------------ | ------------------------------------- |
| 05   | UI/UX System       | Visual tokens for interaction patterns|
| 06   | Database Design    | (indirect) data shapes for UI         |
| 11   | Customer Dashboard | Component specs for `/app/*`          |
| 12   | Admin Dashboard    | Component specs for `/admin/*`        |
| 16   | Components         | Implements the component library from this system |
| 17   | Animations         | Implements the motion tokens          |
| 18   | SEO                | Visual/typography for metadata preview|

---

## Next Book

**Book 05 — Software Requirements Specification** (`01-Foundation/BOOK_05_SOFTWARE_REQUIREMENTS_SPECIFICATION.md`): defines the technical system-level requirements — system interfaces, state machines, data flows, security mechanisms, performance budgets, error handling, logging, monitoring, and acceptance criteria. Complements Book 02 (business requirements) with system-level depth.

---

> End of Book 04 — Design System. This document is the visual contract for the platform. Any change to tokens, colors, typography, spacing, component APIs, or accessibility rules requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
