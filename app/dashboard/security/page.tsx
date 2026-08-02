"use client";

import { useState, useEffect, useActionState } from "react";
import { toast } from "sonner";
import {
  Shield, Lock, Wallet as WalletIcon, Monitor, AlertTriangle, Clock,
  Check, Eye, Loader2,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getSecurityInfo } from "@/features/dashboard/server/actions";
import { changePassword } from "@/features/auth/server/actions";
import { createClient } from "@/lib/supabase/client";

interface WalletRow {
  id: string;
  address: string;
  network: string;
  network_id: number;
  is_default: boolean;
  connected_at: string;
  last_used_at: string | null;
}

function short(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export default function SecurityPage() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangedAt, setPasswordChangedAt] = useState<Date | null>(null);
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [email, setEmail] = useState("");
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const [pwdState, pwdAction, pwdPending] = useActionState(changePassword, undefined);

  useEffect(() => {
    void (async () => {
      const res = await getSecurityInfo();
      if (res.error === null && res.data) {
        setWallets(res.data.wallets as WalletRow[]);
        setEmail(res.data.email);
        setLastLogin(res.data.lastLogin ? new Date(res.data.lastLogin) : null);
        const ts = (res.data as { passwordChangedAt?: string | null }).passwordChangedAt;
        setPasswordChangedAt(ts ? new Date(ts) : null);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel(`pwd-live-${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
          (payload: unknown) => {
            const p = payload as {
              new?: Record<string, unknown> | null;
              old?: Record<string, unknown> | null;
            };
            const ts = p.new?.password_changed_at;
            const prev = p.old?.password_changed_at;
            if (typeof ts === "string" && ts !== prev) {
              setPasswordChangedAt(new Date(ts));
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("toast", { detail: { title: "Password updated", description: "Synced to your account in real time." } }));
              }
            }
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const handleChangePassword = (formData: FormData) => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    pwdAction(formData);
  };

  const strength = newPassword.length < 8 ? 0 : newPassword.length < 10 ? 1 : newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/) && newPassword.match(/[^a-zA-Z0-9]/) ? 3 : 2;
  const strengthLabel = ["Too short", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["text-slate-400", "text-red-500", "text-amber-500", "text-emerald-600"][strength];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account security</p>
      </div>

      {pwdState?.error && (
        <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">{pwdState.error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" aria-hidden="true" />Password Status</CardTitle>
          <CardDescription>Keep your account secure with a strong password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Account: {email}</p>
              <p className={`text-sm font-medium ${newPassword ? strengthColor : "text-slate-400"}`}>Password strength: {newPassword ? strengthLabel : "—"}</p>
              <p className="mt-1 text-xs text-slate-400">
                Last changed: {passwordChangedAt ? formatDistanceToNow(passwordChangedAt, { addSuffix: true }) : "never"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen((v) => !v)}>
              {changePasswordOpen ? "Cancel" : "Change Password"}
            </Button>
          </div>
          {changePasswordOpen && (
            <form
              action={handleChangePassword}
              className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
                {newPassword && <p className={`text-xs ${strengthColor}`}>Strength: {strengthLabel}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" loading={pwdPending}>
                <Check className="h-4 w-4" aria-hidden="true" />
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><WalletIcon className="h-5 w-5" aria-hidden="true" />Connected Wallets</CardTitle>
          <CardDescription>Wallets linked to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
          ) : wallets.length === 0 ? (
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"><WalletIcon className="h-5 w-5 text-slate-500" aria-hidden="true" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">No wallets connected</p>
                <p className="text-sm text-slate-500">Connect a wallet from the Wallet page</p>
              </div>
              <Button size="sm" asChild>
                <a href="/dashboard/wallet">Connect</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200">
                      <WalletIcon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-medium text-slate-900">{short(w.address)}</p>
                      <p className="text-xs text-slate-500">{w.network} · connected {formatDistanceToNow(new Date(w.connected_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {w.is_default && <Badge variant="secondary">Default</Badge>}
                    <Button variant="outline" size="sm" asChild>
                      <a href="/dashboard/wallet">Manage</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" aria-hidden="true" />Account Activity</CardTitle>
          <CardDescription>Your account timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Last sign-in</p>
                  <p className="text-xs text-slate-500">{lastLogin ? formatDistanceToNow(lastLogin, { addSuffix: true }) : "—"}</p>
                </div>
              </div>
              <Badge variant="success">Current</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email verification</p>
                  <p className="text-xs text-slate-500">Your email is verified and active</p>
                </div>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" aria-hidden="true" />Security Tips</CardTitle>
          <CardDescription>Keep your account safe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Never share your wallet secrets</p>
              <p className="mt-1 text-xs text-slate-600">
                TWallet is a non-custodial platform. We will never ask for your seed phrase, private key,
                or keystore password. Anyone who does is a scammer — do not share them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" aria-hidden="true" />Sessions</CardTitle>
          <CardDescription>Devices signed into your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-900">This device <Badge variant="success" className="ml-2">Current</Badge></p>
                <p className="text-xs text-slate-500">{lastLogin ? formatDistanceToNow(lastLogin, { addSuffix: true }) : "—"}</p>
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-xs text-slate-500">
            Need to sign out everywhere? Use the <strong>Log out</strong> option in the sidebar, then sign in again on each device you want to keep.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
