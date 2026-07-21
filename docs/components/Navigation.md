# Navigation (UI-022)

Layout navigation components.

## Sidebar

Fixed left navigation panel with collapsible mode.

| Feature | Description |
|---------|-------------|
| Collapsed | Icon-only (64px) mode |
| Expanded | Full (256px) with labels + badges |
| Nested | Child nav items with indent |
| Active state | Blue highlight |
| Badge | Notification count |

## Top Navigation

Sticky top header bar.

| Feature | Description |
|---------|-------------|
| Sticky | `position: sticky; top: 0` |
| Blur | `backdrop-blur-xl` with white/80 |
| Actions | Right-aligned action buttons |
| Title | Page title |
| Menu toggle | Mobile hamburger button |

## Bottom Navigation (Mobile)

Fixed bottom tab bar, visible only on mobile (`< lg`).

## Breadcrumbs

Navigation path with home icon.

## Props

See `src/components/ui/layout/navigation.tsx` for complete props.

## Implementation

`src/components/ui/layout/navigation.tsx`
