# 03 — Header

> Component ID: LP-002 | Status: Approved
> Sticky navigation with blur effect, scroll behavior, and mobile drawer. Shared across all public pages.

## Purpose
Provide primary navigation throughout the website. Allow users to access key pages and authentication actions from anywhere on the public site.

## UI Specification

### Container
- **Height:** 80px
- **Position:** Sticky top (below announcement bar if present)
- **Container:** `--container-max` (1280px), centered
- **Z-index:** 50 (above content, below modals)

### Scroll Behavior (Critical)
The header transitions through states as the user scrolls:

| Scroll Position | Background | Shadow | Blur | Logo Color |
|----------------|------------|--------|------|------------|
| Top (0px) | Transparent | None | None | White (on hero) |
| Scrolled (>10px) | White (`--color-surface`) | `--shadow-xs` | backdrop-blur(12px) | Dark (`--color-heading`) |

**Implementation:**
```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Apply: scrolled ? 'bg-surface/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
```

> **Note:** When the header is transparent (at top), text is white (over dark hero). When scrolled, text is dark (over white bg). This requires conditional styling.

### Left
- **Logo:** TWallet logo (SVG)
  - At top (transparent): white version
  - Scrolled: dark version (`--color-heading`)
  - Click → `/`

### Center (Desktop — 1024px+)
| Link | Route | Active Style |
|------|-------|-------------|
| Home | `/` | `--color-primary` text + 2px bottom border |
| Cards | `/cards` | Same |
| How It Works | `/how-it-works` | Same |
| Pricing | `/pricing` | Same |
| Security | `/security` | Same |
| Support | `/support` | Same |

- Inactive link color: white (at top) / `--color-body` (scrolled)
- Hover: `--color-primary` text + underline animation (width 0→100%, 200ms, left-to-right)

### Underline Animation (Hover)
```css
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.2s ease-out;
}
.nav-link:hover::after,
.nav-link[aria-current="page"]::after {
  width: 100%;
}
```

### Right (Desktop)
| Element | Style | Route |
|---------|-------|-------|
| Login | Ghost link — white (top) / `--color-body` (scrolled) | `/auth/login` |
| Register | Primary button, `md` | `/auth/register` |
| Dashboard (if authed) | Primary button, `md` | `/app` |

### Mobile (< 1024px)
- Hamburger button (right, 44x44px tap target)
- Logo (left, 32px height)
- No center nav (hidden)
- Drawer: full-width or 300px, slide-in from right
  - Background: `--color-surface`
  - Shadow: `--shadow-lg`
  - Nav links: stacked, full-width, 56px height each, 16px padding
  - Active link: `--color-primary-light` bg, `--color-primary` text
  - Login: ghost link, full-width
  - Register: primary button, full-width
  - Close: X button at top-right (44x44px)
  - Esc to close; tap outside to close; closes on navigation

## Component Tree
```
Header (Client Component — scroll detection + drawer)
├── HeaderContainer (1280px, centered, conditional bg)
│   ├── Logo (left, conditional color — → /)
│   ├── NavLinks (center, desktop only)
│   │   ├── NavLink ("Home" → /)
│   │   ├── NavLink ("Cards" → /cards)
│   │   ├── NavLink ("How It Works" → /how-it-works)
│   │   ├── NavLink ("Pricing" → /pricing)
│   │   ├── NavLink ("Security" → /security)
│   │   └── NavLink ("Support" → /support)
│   └── HeaderActions (right)
│       ├── LoginLink ("Login" → /auth/login)
│       └── RegisterButton ("Register" → /auth/register)
│           (OR DashboardButton ("Dashboard" → /app) if authenticated)
├── HamburgerButton (mobile only)
└── MobileDrawer (mobile only, conditional)
    ├── DrawerHeader (Logo + CloseButton)
    ├── DrawerNav (same links, stacked)
    └── DrawerActions (Login + Register, full width)
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Background transition | Header bg | 200ms | Scroll > 10px |
| Shadow fade-in | Header shadow | 150ms | Scroll > 10px |
| Logo color swap | Logo | 200ms | Scroll > 10px |
| Nav text color swap | Nav links | 200ms | Scroll > 10px |
| Underline draw | Nav link hover | 200ms | Mouse enter |
| Drawer slide-in | Mobile drawer | 250ms easeOut | Hamburger click |
| Drawer slide-out | Mobile drawer | 200ms easeIn | Close / Esc / nav |
| Link hover color | Nav links | 150ms | Mouse enter |

### prefers-reduced-motion
- Disable: background transition, shadow fade, logo swap (instant)
- Keep: drawer slide (essential for UX) or make instant if preferred
- Underline: instant width change

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Landmark | `<header>` element |
| Navigation | `<nav aria-label="Main navigation">` |
| Hamburger | `aria-label="Open menu"` / `aria-label="Close menu"` |
| Drawer | ARIA dialog (`role="dialog"`), `aria-modal="true"`, focus trapped, Esc closes |
| Focus restore | Focus returns to hamburger when drawer closes |
| Active link | `aria-current="page"` on active link |
| Keyboard | Tab through links, Enter to navigate, Esc to close drawer |
| Skip link | Skip-to-content link at very top (before header) |
| Color contrast | White on dark hero: 18:1 (AAA); `--color-body` on white: 9.7:1 (AAA) |

## Behavior

| Rule | Detail |
|------|--------|
| Sticky | `position: sticky; top: 0` (or `top: 44px` if announcement bar present) |
| Scroll detection | `window.scrollY > 10` → add white bg + shadow + blur |
| Auth check | If user session exists, show "Dashboard" button instead of "Login" + "Register" |
| Mobile drawer | Closes on route change (navigation) |
| Click outside | Drawer closes when tapping outside |
| Body scroll lock | When drawer is open, lock body scroll (`overflow: hidden`) |
