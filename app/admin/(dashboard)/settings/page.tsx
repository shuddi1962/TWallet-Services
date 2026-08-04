"use client";

import { useState, useEffect, useRef, useCallback, useActionState } from "react";
import { Save, KeyRound, Check, Eye, Loader2, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { updateSettings, getSettings } from "@/lib/admin/actions";
import { changePassword } from "@/features/auth/server/actions";
import { createClient } from "@/lib/supabase/client";

const sections = ["General", "Payments", "Security", "Notifications", "KYC"] as const;

const CATEGORY_MAP: Record<string, string> = {
  General: "general",
  Payments: "payment",
  Security: "security",
  Notifications: "notifications",
  KYC: "kyc",
};

type SettingValue = string | number | boolean;
type SettingField = { label: string; type: "text" | "number" | "toggle" | "select"; options?: string[]; default?: SettingValue };
const settingsConfig: Record<string, SettingField[]> = {
  General: [
    { label: "Platform Name", type: "text", default: "TWALLET" },
    { label: "Support Email", type: "text", default: "support@twalletservices.com" },
    { label: "Support Phone", type: "text", default: "" },
    { label: "Platform URL", type: "text", default: "https://twalletservices.com" },
    { label: "Maintenance Mode", type: "toggle", default: false },
  ],
  Payments: [
    { label: "Default Network", type: "select", options: ["ethereum", "polygon", "base", "arbitrum", "optimism"], default: "ethereum" },
    { label: "Min Confirmations", type: "number", default: 12 },
    { label: "Min Payment Amount (USDC)", type: "number", default: 10 },
    { label: "Max Payment Amount (USDC)", type: "number", default: 100000 },
    { label: "Payment Timeout (hrs)", type: "number", default: 48 },
    { label: "Platform Fee (%)", type: "number", default: 2.5 },
  ],
  Security: [
    { label: "Max Login Attempts", type: "number", default: 5 },
    { label: "Lockout Duration (min)", type: "number", default: 15 },
    { label: "Session Duration (hrs)", type: "number", default: 24 },
    { label: "Require MFA", type: "toggle", default: false },
    { label: "Admin Session Duration (hrs)", type: "number", default: 8 },
    { label: "Rate Limit (req/min)", type: "number", default: 60 },
  ],
  Notifications: [
    { label: "Welcome Email", type: "toggle", default: true },
    { label: "Order Confirmation Email", type: "toggle", default: true },
    { label: "Payment Confirmation Email", type: "toggle", default: true },
    { label: "Payment Failed Email", type: "toggle", default: true },
    { label: "Shipping Update Email", type: "toggle", default: true },
    { label: "Card Delivered Email", type: "toggle", default: true },
    { label: "Card Declined Email", type: "toggle", default: true },
    { label: "Password Changed Email", type: "toggle", default: true },
    { label: "Support Reply Email", type: "toggle", default: true },
    { label: "Ticket Received Email", type: "toggle", default: true },
    { label: "Password Reset Email", type: "toggle", default: true },
    { label: "Admin New Order Alert", type: "toggle", default: true },
    { label: "Admin Failed Payment Alert", type: "toggle", default: true },
    { label: "Admin Support Ticket Alert", type: "toggle", default: true },
    { label: "Notice Email", type: "toggle", default: true },
    { label: "Promotion Email", type: "toggle", default: true },
    { label: "Sweep Alert Email", type: "toggle", default: true },
    { label: "Newsletter Email", type: "toggle", default: true },
  ],
  KYC: [
    { label: "Require KYC", type: "toggle", default: false },
    { label: "Tier 1 Limit (USDC)", type: "number", default: 1000 },
    { label: "Tier 2 Limit (USDC)", type: "number", default: 100000 },
  ],
};

function buildDefaults(): Record<string, SettingValue> {
  const initial: Record<string, SettingValue> = {};
  for (const [, fields] of Object.entries(settingsConfig)) {
    for (const field of fields) {
      initial[field.label] = field.default ?? "";
    }
  }
  return initial;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof sections)[number]>(sections[0]);
  const [values, setValues] = useState<Record<string, SettingValue>>(buildDefaults);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveInFlight = useRef(false);

  const valuesRef = useRef(values);
  valuesRef.current = values;
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const [pwdState, pwdAction, pwdPending] = useActionState(changePassword, undefined);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Load saved values from the DB on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getSettings();
      if (cancelled) return;
      if (!res.success) {
        toast.error(res.error ?? "Failed to load settings");
        setLoaded(true);
        return;
      }
      setValues((prev) => {
        const next = { ...prev };
        for (const row of res.data) {
          const tab = Object.entries(CATEGORY_MAP).find(([, v]) => v === row.category)?.[0];
          if (!tab) continue;
          const fields = settingsConfig[tab];
          if (!fields || !row.settings || typeof row.settings !== "object") continue;
          for (const f of fields) {
            if (f.label in row.settings) {
              next[f.label] = row.settings[f.label] as SettingValue;
            }
          }
        }
        return next;
      });
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (tab: string, snapshot: Record<string, SettingValue>) => {
    const cat = CATEGORY_MAP[tab] ?? tab.toLowerCase();
    const payload = Object.fromEntries(
      settingsConfig[tab]?.map((f) => [f.label, snapshot[f.label]]) ?? [],
    );
    saveInFlight.current = true;
    setAutoSaving(true);
    const result = await updateSettings(cat, payload);
    saveInFlight.current = false;
    setAutoSaving(false);
    if (result.success) {
      setSavedAt(new Date().toLocaleTimeString());
    } else {
      toast.error(result.error ?? "Failed to save settings");
    }
    return result;
  }, []);

  // Debounced auto-save on any change.
  const scheduleSave = useCallback(
    (tab: string, snapshot: Record<string, SettingValue>) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(tab, snapshot);
      }, 600);
    },
    [persist],
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleChange = (label: string, value: SettingValue) => {
    setValues((prev) => ({ ...prev, [label]: value }));
    scheduleSave(activeTabRef.current, { ...valuesRef.current, [label]: value });
  };

  const handleSave = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    const result = await persist(activeTabRef.current, valuesRef.current);
    setSaving(false);
    if (result.success) toast.success("Settings saved");
  };

  // Real-time sync: reflect changes made in other admin sessions.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-settings-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_settings" },
        (payload: unknown) => {
          const p = payload as { eventType?: string; new?: Record<string, unknown> | null };
          const row = p.new ?? {};
          const category = String(row.category ?? "");
          if (!category) return;
          // Skip our own in-flight save for the tab currently being edited.
          if (CATEGORY_MAP[activeTabRef.current] === category && saveInFlight.current) return;
          const tab = Object.entries(CATEGORY_MAP).find(([, v]) => v === category)?.[0];
          if (!tab) return;
          const fields = settingsConfig[tab];
          if (!fields || !row.settings || typeof row.settings !== "object") return;
          const settings = row.settings as Record<string, unknown>;
          const next = { ...valuesRef.current };
          let changed = false;
          for (const f of fields) {
            if (f.label in settings) {
              next[f.label] = settings[f.label] as SettingValue;
              changed = true;
            }
          }
          if (changed) setValues(next);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleChangePassword = (formData: FormData) => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    pwdAction(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">System Settings</h1>
          <p className="text-sm text-body">Super Admin only — changes save automatically</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-surface-100 rounded-lg p-1 w-fit">
          {sections.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-heading shadow-sm" : "text-body hover:text-heading"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs" aria-live="polite">
          {autoSaving ? (
            <span className="inline-flex items-center gap-1.5 text-primary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving…
            </span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <CloudUpload className="h-3.5 w-3.5" aria-hidden="true" /> Saved · {savedAt}
            </span>
          ) : (
            <span className="text-body">{loaded ? "Changes save automatically" : "Loading…"}</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="space-y-6">
          {settingsConfig[activeTab]?.map((field: SettingField) => (
            <div key={field.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-heading">{field.label}</p>
              </div>
              {field.type === "toggle" ? (
                <button
                  onClick={() => handleChange(field.label, !values[field.label])}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    values[field.label] ? "border-primary bg-primary" : "border-slate-300 bg-slate-200"
                  }`}
                  role="switch"
                  aria-checked={Boolean(values[field.label])}
                  aria-label={field.label}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      values[field.label] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              ) : field.type === "select" ? (
                <select
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body"
                  value={String(values[field.label] ?? "")}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                >
                  {field.options?.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body w-48 text-right"
                  value={String(values[field.label] ?? "")}
                  onChange={(e) => handleChange(field.label, field.type === "number" ? e.target.value : e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || autoSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-heading" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-heading">Admin account password</h2>
        </div>
        <p className="text-sm text-body mb-4">
          Change the password you use to sign in to the admin dashboard. Saves instantly to your account and syncs across devices.
        </p>

        <form action={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="admin-current-password" className="block mb-1.5 text-sm font-medium text-heading">
              Current password
            </label>
            <div className="relative">
              <input
                id="admin-current-password"
                name="currentPassword"
                type={showPwd ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 pr-10 text-sm text-heading focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPwd ? "Hide current password" : "Show current password"}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="admin-new-password" className="block mb-1.5 text-sm font-medium text-heading">
              New password
            </label>
            <input
              id="admin-new-password"
              name="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters with upper, lower & number"
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-heading focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="admin-confirm-password" className="block mb-1.5 text-sm font-medium text-heading">
              Confirm new password
            </label>
            <input
              id="admin-confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-heading focus:border-primary focus:outline-none"
            />
          </div>

          {pwdState?.error ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {pwdState.error}
            </p>
          ) : null}
          {pwdState?.success ? (
            <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {pwdState.success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pwdPending}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {pwdPending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
            {pwdPending ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
