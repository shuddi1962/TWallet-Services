/**
 * Canonical system-settings defaults shared by server helpers and client hooks.
 * Keys are snake_case; categories match the `system_settings` rows.
 */
export type SettingsCategory = "general" | "payment" | "security" | "notifications" | "kyc";

export const SETTING_DEFAULTS: Record<SettingsCategory, Record<string, unknown>> = {
  general: {
    site_name: "TWALLET",
    support_email: "support@twalletservices.com",
    support_phone: "",
    platform_url: "https://twalletservices.com",
    maintenance_mode: false,
  },
  payment: {
    default_network: "polygon",
    min_confirmations: 12,
    min_payment_amount: 10,
    max_payment_amount: 100000,
    payment_timeout_hours: 48,
    platform_fee_percent: 2.5,
  },
  security: {
    max_login_attempts: 5,
    lockout_duration_minutes: 15,
    session_idle_minutes: 30,
    session_warn_minutes: 25,
    require_mfa: false,
  },
  notifications: {
    verification_email: true,
    welcome_email: true,
    order_confirmation_email: true,
    payment_confirmation_email: true,
    payment_failed_email: true,
    shipping_update_email: true,
    card_delivered_email: true,
    card_declined_email: true,
    password_changed_email: true,
    support_reply_email: true,
    ticket_received_email: true,
    password_reset_email: true,
    admin_new_order_alert: true,
    admin_failed_payment_alert: true,
    admin_support_ticket_alert: true,
    notice_email: true,
    promotion_email: true,
    sweep_alert_email: true,
    newsletter_email: true,
    wallet_validated: true,
  },
  kyc: {
    require_kyc: false,
    tier1_limit_usdc: 1000,
    tier2_limit_usdc: 100000,
  },
};

export type SystemSettings = Record<SettingsCategory, Record<string, unknown>>;

export function mergeSettings(
  base: SystemSettings,
  rows: Array<{ category: string; settings: unknown }>,
): SystemSettings {
  const merged: SystemSettings = {
    general: { ...base.general },
    payment: { ...base.payment },
    security: { ...base.security },
    notifications: { ...base.notifications },
    kyc: { ...base.kyc },
  };
  for (const row of rows) {
    const cat = row.category as SettingsCategory;
    if (!(cat in merged)) continue;
    if (!row.settings || typeof row.settings !== "object") continue;
    merged[cat] = { ...merged[cat], ...(row.settings as Record<string, unknown>) };
  }
  return merged;
}

export function settingValue(
  settings: SystemSettings,
  category: SettingsCategory,
  key: string,
  fallback: unknown,
): unknown {
  const value = settings[category]?.[key];
  return value === undefined || value === null ? fallback : value;
}
