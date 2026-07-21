# Accessibility Checklist — TWallet Services

## Automated Checks (axe-core)

```
☐ Run axe-core on every page
☐ 0 violations (critical + serious)
☐ 0 violations (moderate) — target
```

## Per-Page Checklist

### Landing Page
```
☐ Skip to content link
☐ Heading hierarchy (h1 → h2 → h3)
☐ Image alt text on all cards
☐ Button labels are descriptive
☐ Carousel has pause/play control
☐ Color contrast on CTA buttons
```

### Authentication Pages
```
☐ Form inputs have visible labels
☐ Error messages announced (aria-live)
☐ Password toggle has aria-label
☐ Focus order: email → password → submit
☐ Loading state announced
```

### Customer Dashboard
```
☐ Navigation landmarks (nav, main, footer)
☐ Data tables have column headers
☐ Status badges have accessible labels
☐ Sortable columns indicate sort state
☐ Empty states are announced
☐ Real-time updates announced
```

### Admin Dashboard
```
☐ All interactive elements keyboard accessible
☐ Modal/drawer focus trap works
☐ Toast notifications announced
☐ Charts have data descriptions
☐ Dropdown menus keyboard navigable
```

## Component Checklist

```
☐ Button: focus ring, disabled state, loading state, aria-busy
☐ Input: label, error message, hint, aria-invalid, aria-describedby
☐ Select: keyboard navigation, search announcement
☐ Checkbox: keyboard toggle, indeterminate state
☐ Switch: keyboard toggle, role="switch"
☐ Modal: focus trap, escape close, aria-labelledby
☐ Drawer: focus trap, escape close, role="dialog"
☐ Tabs: role="tablist", role="tab", arrow key navigation
☐ Accordion: button role, aria-expanded
☐ Toast: role="status", aria-live="polite"
☐ Tooltip: role="tooltip", keyboard hover
☐ Table: scope="col", sort indicators
```

## Screen Reader Testing

```
☐ Navigate landing page with NVDA / VoiceOver
☐ Complete registration flow
☐ Create an order
☐ Track an order
☐ Open support ticket
☐ Admin order management
```

## Reduced Motion

```
☐ All animations respect prefers-reduced-motion
☐ No auto-playing animations > 5 seconds
☐ No parallax or continuous motion
☐ Framer Motion: useReduceMotion hook
```
