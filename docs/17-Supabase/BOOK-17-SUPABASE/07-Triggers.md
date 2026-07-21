# Triggers

> Database triggers for automated workflows — profile creation, audit timestamps, notifications.

---

## Trigger Inventory

| Trigger | Event | Function | Purpose |
|---------|-------|----------|---------|
| `trg_set_updated_at` | BEFORE UPDATE | `fn_set_updated_at()` | Auto-update `updated_at` timestamp |
| `trg_handle_new_user` | AFTER INSERT ON auth.users | `fn_handle_new_user()` | Create profile + default preferences |
| `trg_payment_confirmed` | AFTER UPDATE ON payment_transactions | `fn_on_payment_confirmed()` | Update order status + notify customer |
| `trg_order_shipped` | AFTER UPDATE ON card_orders | `fn_on_order_shipped()` | Notify customer of shipping |
| `trg_audit_admin_action` | BEFORE INSERT ON audit_logs | `fn_validate_audit_log()` | Ensure audit log has required fields |
| `trg_prevent_admin_delete` | BEFORE DELETE ON admins | `fn_prevent_last_admin()` | Prevent deleting the last Super Admin |

---

## updated_at Trigger

Applied to every table that has an `updated_at` column.

```sql
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table
CREATE TRIGGER trg_set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_set_updated_at_wallets
  BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Repeat for: card_orders, card_products, payment_transactions, support_tickets,
--              notifications, admin_notifications, system_settings, user_preferences,
--              supported_networks, supported_tokens, supported_wallet_addresses
```

---

## handle_new_user Trigger

Creates a profile row + default preferences when a new user signs up via Supabase Auth.

```sql
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, country)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'country', 'US')
  );

  -- Assign user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Create default preferences
  INSERT INTO public.user_preferences (user_id, preferences)
  VALUES (NEW.id, '{"language":"en","currency":"USD","theme":"light","notifications":{"email_order_confirmed":true,"email_payment_received":true,"email_shipping_update":true,"push_order_status":true,"push_promotions":false}}'::jsonb);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_handle_new_user();
```

---

## payment_confirmed Trigger

When a payment is confirmed, update the associated order status and create a notification.

```sql
CREATE OR REPLACE FUNCTION fn_on_payment_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- Update order status
    UPDATE public.card_orders
    SET status = 'paid', paid_at = now(), tx_hash = NEW.tx_hash
    WHERE id = NEW.order_id;

    -- Create notification
    INSERT INTO public.notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.user_id,
      'payment_confirmed',
      'Payment Confirmed',
      'Your payment of ' || NEW.amount || ' USDC has been confirmed.',
      'order',
      NEW.order_id
    );

    -- Admin alert
    INSERT INTO public.admin_notifications (admin_id, type, title, message, related_type, related_id)
    SELECT id, 'new_payment', 'Payment Confirmed', 'Payment of ' || NEW.amount || ' USDC confirmed.',
           'payment', NEW.id
    FROM public.admins
    WHERE role IN ('super_admin', 'finance');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_payment_confirmed
  AFTER UPDATE OF status ON public.payment_transactions
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status != 'confirmed')
  EXECUTE FUNCTION fn_on_payment_confirmed();
```

---

## order_shipped Trigger

Notify customer when their order status changes to shipped.

```sql
CREATE OR REPLACE FUNCTION fn_on_order_shipped()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
    INSERT INTO public.notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.user_id,
      'shipping_update',
      'Order Shipped',
      'Your order ' || NEW.id || ' has been shipped! Track it with: ' || COALESCE(NEW.tracking_number, 'N/A'),
      'order',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_order_shipped
  AFTER UPDATE OF status ON public.card_orders
  FOR EACH ROW
  WHEN (NEW.status = 'shipped' AND OLD.status != 'shipped')
  EXECUTE FUNCTION fn_on_order_shipped();
```

---

## Migrations

All triggers should be included in Supabase migrations:

```bash
supabase migration new add_triggers
```

Migration file: `supabase/migrations/YYYYMMDDHHMMSS_add_triggers.sql`
