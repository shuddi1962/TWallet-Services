# BOOK-19 — UI COMPONENT LIBRARY

**Version:** 1.0.0 · **Status:** Production Ready · **Priority:** Critical

## Overview

This book defines every reusable UI component in the TWallet Services application. All components live under `src/components/ui/` with a companion `packages/ui/` monorepo package for cross-project reuse.

### Objectives

- **Consistent Design** — every component follows the same tokens, patterns, and conventions
- **Reusable** — no duplicate implementations across the app
- **Accessible** — WCAG 2.1 AA minimum on every component
- **Performant** — tree-shakeable, lazy-loaded, minimal bundle impact
- **Maintainable** — fully typed (TypeScript strict), documented, tested

### Technology

| Tech | Role |
|------|------|
| React 19 | Rendering |
| Next.js 15 | Framework |
| Tailwind CSS | Styling |
| shadcn/ui | Base component patterns |
| Radix UI | Headless primitives (a11y) |
| Framer Motion | Animations |
| Lucide React | Icons |
| class-variance-authority | Variant management |
| react-hook-form + zod | Forms |

## Component Index

| ID | Component | Variants | Radix Primitive |
|----|-----------|----------|-----------------|
| UI-001 | Button `src/components/ui/button/button.tsx` | 7 variants × 5 sizes × 5 states | Radix Slot |
| UI-002 | Input `src/components/ui/input/input.tsx` | 6 types, 7 states | — |
| UI-003 | Textarea `src/components/ui/textarea/textarea.tsx` | 2 sizes, 6 states | — |
| UI-004 | Select `src/components/ui/select/select.tsx` | 3 sizes, searchable | Radix Select |
| UI-005 | Checkbox `src/components/ui/checkbox/checkbox.tsx` | 2 sizes, indeterminate | Radix Checkbox |
| UI-006 | Switch `src/components/ui/switch/switch.tsx` | 2 sizes, 2 labels | Radix Switch |
| UI-007 | Badge `src/components/ui/badge/badge.tsx` | 7 variants, 3 sizes | — |
| UI-008 | Avatar `src/components/ui/avatar/avatar.tsx` | 5 sizes, status dot | Radix Avatar |
| UI-009 | Tooltip `src/components/ui/tooltip/tooltip.tsx` | 4 positions | Radix Tooltip |
| UI-010 | Dialog `src/components/ui/dialog/dialog.tsx` | 4 sizes | Radix Dialog |
| UI-011 | Drawer `src/components/ui/drawer/drawer.tsx` | 4 positions | Radix Dialog |
| UI-012 | Dropdown `src/components/ui/dropdown/dropdown.tsx` | Search, icons, nested | Radix DropdownMenu |
| UI-013 | Tabs `src/components/ui/tabs/tabs.tsx` | 3 variants, scrollable | Radix Tabs |
| UI-014 | Accordion `src/components/ui/accordion/accordion.tsx` | 2 variants | Radix Accordion |
| UI-015 | Table `src/components/ui/table/table.tsx` | Sort, filter, select | — |
| UI-016 | Data Grid `src/components/ui/data-grid/data-grid.tsx` | Virtualized, column resize | — |
| UI-017 | Card `src/components/ui/card/card.tsx` | 10 variants | — |
| UI-018 | Chart `src/components/ui/chart/chart.tsx` | 5 chart types | Recharts |
| UI-019 | Timeline `src/components/ui/timeline/timeline.tsx` | Vertical, horizontal | — |
| UI-020 | Empty State `src/components/ui/empty-state/empty-state.tsx` | 6 illustrations | — |
| UI-021 | Skeleton `src/components/ui/skeleton/skeleton.tsx` | 5 shapes | — |
| UI-022 | Pagination `src/components/ui/pagination/pagination.tsx` | 5 variants | — |
| UI-023 | Toast `src/components/ui/toast/toast.tsx` | 5 types, position | Radix Toast |
| UI-024 | Alert `src/components/ui/alert/alert.tsx` | 5 variants, dismissible | — |
| UI-025 | Spinner `src/components/ui/spinner/spinner.tsx` | 3 sizes, fullscreen | — |
| UI-026 | File Upload `src/components/ui/file-upload/file-upload.tsx` | Drag & drop, preview | — |
| UI-027 | Wallet Card `src/components/ui/wallet/wallet-card.tsx` | Connected, disconnected | — |
| UI-028 | Payment Card `src/components/ui/crypto/payment-card.tsx` | Status, tx hash | — |
| UI-029 | Navigation `src/components/ui/layout/navigation.tsx` | Sidebar, top, bottom | — |

## Design Principles

| Principle | Value |
|-----------|-------|
| Spacing | 8pt grid system (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64) |
| Radius | 8px (default), 12px, 16px, 24px, full (9999px) |
| Shadows | sm, md, lg, xl (soft only, no harsh shadows) |
| Animations | 200ms–300ms ease-out |
| Typography | Inter (body), JetBrains Mono (code/monospace) |
| Colors | brand, semantic (success/warning/error/info), neutral, chart |

## Folder Structure

```
src/components/ui/
├── button/          button.tsx, button.stories.tsx, button.test.tsx
├── input/           input.tsx, input.test.tsx
├── textarea/        textarea.tsx
├── select/          select.tsx
├── checkbox/        checkbox.tsx
├── switch/          switch.tsx
├── badge/           badge.tsx
├── avatar/          avatar.tsx
├── tooltip/         tooltip.tsx
├── dialog/          dialog.tsx
├── drawer/          drawer.tsx
├── dropdown/        dropdown.tsx
├── tabs/            tabs.tsx
├── accordion/       accordion.tsx
├── table/           table.tsx
├── data-grid/       data-grid.tsx
├── card/            card.tsx
├── chart/           chart.tsx
├── timeline/        timeline.tsx
├── empty-state/     empty-state.tsx
├── skeleton/        skeleton.tsx
├── pagination/      pagination.tsx
├── toast/           toast.tsx
├── alert/           alert.tsx
├── spinner/         spinner.tsx
├── file-upload/     file-upload.tsx
├── wallet/          wallet-card.tsx
├── crypto/          payment-card.tsx
└── layout/          navigation.tsx, top-nav.tsx, sidebar.tsx, bottom-nav.tsx, breadcrumbs.tsx
```

## Senior Engineering Recommendation

For a project of this size, maintain a dedicated `packages/ui/` package:

```
packages/ui/
├── src/             (same components as src/components/ui/)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── index.ts         (barrel exports)
```

**Benefits:** single source of truth, easy reuse across future projects, consistent styling, simpler testing, ready to publish as a private npm package.

## Files

All component source code: `src/components/ui/`
Per-component documentation: `docs/components/`
Monorepo package: `packages/ui/`
