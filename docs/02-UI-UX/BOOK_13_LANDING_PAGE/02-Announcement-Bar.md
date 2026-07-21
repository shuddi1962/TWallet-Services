# 02 — Announcement Bar

> Dismissible top bar for promotions, launch announcements, or important updates.

## Purpose
Highlight time-sensitive information (launch, promotion, new feature) without taking up permanent screen space.

## UI Specification
- **Background:** `--color-primary` (#2563EB) or gradient to `--color-primary-hover` (#1D4ED8)
- **Height:** 44px
- **Position:** Fixed top (above header), full width
- **Content (centered):**
  - Text: "TWallet Card is now in beta — Order yours today" (14px, white, 500)
  - Link: "Get Started →" (14px, white, 600, underline)
  - Close button: X icon (white, 20px) — right side
- **Layout:** Text + link centered, close button absolute right

## Behavior
- Dismissible: clicking X hides the bar and sets `localStorage('announcement-dismissed', 'true')`
- On next page load: check localStorage; if dismissed, don't render
- Reset: change the announcement text → new key in localStorage (e.g., `announcement-dismissed-v2`)
- Click on link: navigate to `/auth/register`

## Component Tree
```
AnnouncementBar (Client Component — localStorage check)
├── AnnouncementContent (centered)
│   ├── AnnouncementText ("TWallet Card is now in beta...")
│   └── AnnouncementLink ("Get Started →" → /auth/register)
└── CloseButton (X icon, dismiss)
```

## Animation
- Slide-down on mount (200ms, from translateY(-100%) to 0)
- Slide-up on dismiss (200ms, to translateY(-100%))
- `prefers-reduced-motion`: instant show/hide

## Accessibility
- Role: `role="banner"` or `role="alert"` if urgent
- Close button: `aria-label="Dismiss announcement"`
- Link: descriptive text
- Keyboard: close button reachable via Tab; Enter dismisses

## Responsive
- Mobile: text wraps if needed; close button remains accessible (44x44px tap target)
- If text too long on mobile: truncate with ellipsis or reduce to "Beta is live →"
