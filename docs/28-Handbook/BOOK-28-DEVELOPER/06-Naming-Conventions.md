# Naming Conventions

## File & Folder Names

| Category | Convention | Example |
|----------|------------|---------|
| React components | PascalCase + kebab-case file | `wallet-card.tsx`, `OrderList.tsx` |
| Hooks | `use` prefix, camelCase file | `use-wallet.ts`, `useMediaQuery.ts` |
| Services | kebab-case | `order-service.ts`, `payment-service.ts` |
| Utilities | kebab-case | `format-currency.ts`, `validate-email.ts` |
| Types | PascalCase file | `user.ts`, `payment-types.ts` |
| Constants | kebab-case | `api-endpoints.ts`, `error-codes.ts` |
| Config | kebab-case | `supabase.ts`, `analytics.ts` |
| Providers | PascalCase file | `AuthProvider.tsx`, `ThemeProvider.tsx` |
| Middleware | kebab-case | `middleware.ts` |

## Code Identifiers

| Category | Convention | Example |
|----------|------------|---------|
| Components | PascalCase | `WalletCard`, `OrderList` |
| Functions | camelCase | `getOrders()`, `formatCurrency()` |
| Variables | camelCase | `userName`, `orderCount` |
| Hooks | camelCase with `use` prefix | `useWallet()`, `useOrders()` |
| Interfaces | PascalCase | `UserProfile`, `OrderResponse` |
| Type aliases | PascalCase | `PaymentStatus`, `ApiResponse<T>` |
| Enums | PascalCase | `OrderStatus`, `UserRole` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `SESSION_COOKIE_NAME` |
| Environment variables | UPPER_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY` |
| Database tables | snake_case | `users`, `card_products`, `order_items` |
| Database columns | snake_case | `user_id`, `created_at`, `amount_usd` |
| Events | snake_case | `user_registered`, `wallet_connected` |

## Folder Naming

| Folder | Convention | Example |
|--------|------------|---------|
| Component folders | kebab-case | `ui/`, `features/`, `providers/` |
| Feature folders | kebab-case | `authentication/`, `wallet/`, `orders/` |
| Route segments | kebab-case | `(marketing)/`, `blog/`, `faq/` |

## Database Naming

| Object | Convention | Example |
|--------|------------|---------|
| Tables | plural snake_case | `users`, `card_products`, `order_items` |
| Columns | snake_case | `first_name`, `created_at` |
| Primary keys | `id` | Always `id` (UUID) |
| Foreign keys | `{table}_id` | `user_id`, `card_product_id` |
| Indexes | `idx_{table}_{column}` | `idx_orders_user_id` |
| Functions | snake_case | `get_user_orders()`, `verify_payment()` |
| Triggers | `trg_{table}_{event}` | `trg_users_updated_at` |

## File Extensions

| File Type | Extension |
|-----------|-----------|
| TypeScript | `.ts` |
| React TypeScript | `.tsx` |
| CSS/Tailwind | `.css` (global only) |
| SQL | `.sql` |
| JSON | `.json` |
| Markdown | `.md` |
| Environment | `.env`, `.env.local` |
