# Shadows

> Soft shadows only — no harsh shadows. All shadows use `rgba(0, 0, 0, alpha)`.

## Levels

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)` | Cards, stat cards |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.05)` | Dropdowns, tooltips, cards hover |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.08)` | Modals, drawers, dialogs |
| `--shadow-xl` | `0 12px 36px rgba(0,0,0,0.10)` | Large modals, toast |
| `--shadow-glow` | `0 0 20px rgba(37,99,235,0.15)` | Primary buttons, active states |

## Component Mapping

| Component | Shadow |
|-----------|--------|
| Card (default) | `--shadow-sm` |
| Card (hover) | `--shadow-md` |
| Dropdown | `--shadow-md` |
| Modal | `--shadow-lg` |
| Drawer | `--shadow-lg` |
| Toast | `--shadow-lg` |
| Button (primary) | `--shadow-glow` |
| Wallet/Payment card | `--shadow-md` |
