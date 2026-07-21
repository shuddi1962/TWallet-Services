# Z-Index Scale

> Minimal z-index stack. Avoid values between defined layers.

## Scale

| Token | Value | Components |
|-------|-------|------------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 100 | Dropdown menus, tooltips |
| `--z-sticky` | 200 | Sticky headers, sticky columns |
| `--z-drawer` | 300 | Drawers, slide-in panels |
| `--z-modal` | 400 | Modals, dialogs |
| `--z-toast` | 500 | Toast notifications |
| `--z-tooltip` | 600 | Tooltips (highest) |
| `--z-loader` | 700 | Full-screen loaders |

## Rules

| Rule | Reason |
|------|--------|
| Never use z-index > 700 | No element needs to exceed tooltip level |
| Never use z-index between defined values | Creates unpredictable stacking |
| Backdrop always = layer - 10 | `--z-modal-backdrop: 390` |
| Keep transitions at same layer | Avoid z-index during animation |
