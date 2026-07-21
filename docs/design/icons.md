# Icons

## Library

- **Lucide React** (recommended) — all UI icons
- **Simple Icons** (brand icons) — networks, wallets, social

## Sizes

| Token | PX | Usage |
|-------|----|-------|
| `--icon-xs` | 16 | Inline, button icon with text |
| `--icon-sm` | 20 | Dropdown items, small actions |
| `--icon-md` | 24 | Default icon size |
| `--icon-lg` | 32 | Feature icons, hero sections |
| `--icon-xl` | 48 | Empty state illustrations |
| `--icon-2xl` | 64 | Large feature graphics |

## Stroke Width

| Token | Value | Usage |
|-------|-------|-------|
| `--stroke-default` | 2 | All UI icons |

## Rules

- Always use `size-4`, `size-5`, `size-6` etc. Tailwind classes (maps to 16, 20, 24px)
- Icons are decorative: use `aria-hidden="true"` on `<span>` wrappers
- Never resize icons with custom CSS — use Tailwind size utilities
- Use filled variants sparingly and only for active/selected states

## Icon Categories

| Category | Icons |
|----------|-------|
| Navigation | Home, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, ArrowRight |
| Actions | Plus, Minus, Pencil, Trash2, Copy, Download, Upload, Search, Filter |
| Status | Check, X, AlertCircle, AlertTriangle, Info, CheckCircle2, Loader2 |
| Commerce | ShoppingCart, CreditCard, Wallet, DollarSign, Package, Truck |
| Communication | Mail, Bell, MessageCircle, Phone, Send, Share2 |
| Users | User, Users, UserPlus, UserCheck, UserX, Shield |
| Crypto | Coins, BarChart3, TrendingUp, TrendingDown, Activity |
| Files | File, FileText, Image, Folder, Paperclip, Download |
