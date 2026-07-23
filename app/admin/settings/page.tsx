"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

const sections = ["General", "Payments", "Security", "Notifications", "KYC"] as const;

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
    { label: "Order Confirmation Email", type: "toggle", default: true },
    { label: "Payment Confirmation Email", type: "toggle", default: true },
    { label: "Shipping Update Email", type: "toggle", default: true },
    { label: "Admin New Order Alert", type: "toggle", default: true },
    { label: "Admin Failed Payment Alert", type: "toggle", default: true },
  ],
  KYC: [
    { label: "Require KYC", type: "toggle", default: false },
    { label: "Tier 1 Limit (USDC)", type: "number", default: 1000 },
    { label: "Tier 2 Limit (USDC)", type: "number", default: 100000 },
  ],
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof sections)[number]>(sections[0]);
  const [values, setValues] = useState<Record<string, SettingValue>>(() => {
    const initial: Record<string, SettingValue> = {};
    for (const [, fields] of Object.entries(settingsConfig)) {
      for (const field of fields) {
        initial[field.label] = field.default ?? "";
      }
    }
    return initial;
  });

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">System Settings</h1>
          <p className="text-sm text-body">Super Admin only</p>
        </div>
      </div>

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

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="space-y-6">
          {settingsConfig[activeTab]?.map((field: SettingField) => (
            <div key={field.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-heading">{field.label}</p>
              </div>
              {field.type === "toggle" ? (
                <button
                  onClick={() => setValues((prev) => ({ ...prev, [field.label]: !prev[field.label] }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    values[field.label] ? "bg-primary" : "bg-surface-200"
                  }`}
                  role="switch"
                  aria-checked={Boolean(values[field.label])}
                  aria-label={field.label}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    values[field.label] ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              ) : field.type === "select" ? (
                <select
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body"
                  value={String(values[field.label] ?? "")}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.label]: e.target.value }))}
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
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.label]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
