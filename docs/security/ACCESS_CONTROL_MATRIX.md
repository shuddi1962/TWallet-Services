# Access Control Matrix — TWallet Services

## Role Permissions

| Resource | Customer | Support | Ops | Finance | Admin | Super Admin |
|----------|----------|---------|-----|---------|-------|-------------|
| Own profile | CRUD | — | — | — | — | — |
| Other profiles | — | R | R | R | R | CRUD |
| Own wallets | CRUD | — | — | — | — | — |
| All wallets | — | — | — | R | R | CRUD |
| Card products | R | R | R | R | CRUD | CRUD |
| Own orders | CR | R | R | R | R | — |
| All orders | — | R | CRUD | RUD | CRUD | CRUD |
| Payment tx (own) | R | R | R | R | R | — |
| Payment tx (all) | — | R | R | CRUD | CRUD | CRUD |
| Own tickets | CR | R | — | — | — | — |
| All tickets | — | CRUD | R | R | CRUD | CRUD |
| Notifications (own) | R | — | — | — | — | — |
| Notifications (all) | — | R | R | R | R | R |
| Audit logs | — | R | R | R | R | R |
| System settings | — | — | R | R | CRUD | CRUD |
| User preferences | CRUD | — | — | — | — | — |
| Admin management | — | — | — | — | R | CRUD |
| Role assignment | — | — | — | — | — | CRUD |

**Legend:** C=Create, R=Read, U=Update, D=Delete
