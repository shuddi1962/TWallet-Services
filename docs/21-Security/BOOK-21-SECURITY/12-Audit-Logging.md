# Audit Logging

## Logged Events

| Category | Events |
|----------|--------|
| Authentication | Login, logout, failed login, password reset, email verification |
| Wallet | Connect, disconnect, address change |
| Orders | Create, status change, flag, unflag, refund |
| Payments | Verify, confirm, fail, flag, refund |
| Profile | Update, suspend, reactivate, delete |
| Admin | Create/update/delete admin, role change |
| Support | Ticket create, assign, escalate, close |
| Settings | System setting update |
| Security | Permission change, secret rotation |

## Audit Log Structure

```json
{
  "id": "uuid",
  "admin_id": "uuid | null",
  "action": "order_status_changed",
  "target_type": "card_orders",
  "target_id": "uuid",
  "details": {
    "from": "pending",
    "to": "paid",
    "reason": "Payment confirmed on-chain"
  },
  "ip_address": "203.0.113.1",
  "created_at": "2026-07-20T14:30:00Z"
}
```

## Append-Only Enforcement

The `audit_logs` table is append-only. A trigger prevents UPDATE and DELETE operations:

```sql
CREATE TRIGGER prevent_audit_tampering
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION audit_log_validation();
```

## Reading Audit Logs

- Admins view logs via admin dashboard
- Searchable by action, actor, target, date range
- Exportable as CSV/JSON
- Retention: 365 days

## What Not to Log

- Passwords or password hashes
- Private keys or seed phrases
- Full credit card numbers
- API tokens or session tokens
- Personal messages (log metadata only)
