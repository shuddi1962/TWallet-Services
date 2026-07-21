# Breakpoints

> Mobile-first responsive design. Use `min-width` in media queries.

## Breakpoint Scale

| Token | PX | Tailwind | Devices |
|-------|----|----------|---------|
| `--bp-xs` | 0 | (base) | Default / small phones |
| `--bp-sm` | 640 | `sm` | Large phones |
| `--bp-md` | 768 | `md` | Tablets |
| `--bp-lg` | 1024 | `lg` | Laptops, landscape tablets |
| `--bp-xl` | 1280 | `xl` | Desktops |
| `--bp-2xl` | 1536 | `2xl` | Wide screens |

## Container Max Widths

| Token | PX | Usage |
|-------|----|-------|
| `--container-sm` | 640 | Small cards, modals |
| `--container-md` | 768 | Medium content |
| `--container-lg` | 1024 | Main content area |
| `--container-xl` | 1280 | Page content |
| `--container-2xl` | 1536 | Full page width |

## Layout Breakpoints

| Breakpoint | Layout Change |
|------------|---------------|
| `< 768px` | Single column, bottom nav, stacked sidebar items |
| `768px – 1023px` | 2-column grid, sidebar collapsed |
| `1024px – 1279px` | Sidebar expanded, 3-column grids possible |
| `1280px+` | Full desktop layout, all features visible |

## Mobile Adaptations

| Component | `< md` (768px) |
|-----------|----------------|
| Sidebar | Hidden (drawer/hamburger) |
| Top nav | Menu button visible |
| Bottom nav | Fixed tab bar visible |
| Data tables | Horizontally scrollable or card view |
| Modals | Full-screen or bottom sheet |
| Multi-column | Single column stack |
