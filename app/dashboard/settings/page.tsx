"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getPreferences, updatePreferences, getProfile } from "@/features/dashboard/server/actions";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface PrefPatch {
  orderUpdates?: boolean;
  paymentConfirmations?: boolean;
  marketingEmails?: boolean;
}

export default function SettingsPage() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [paymentConfirmations, setPaymentConfirmations] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const applyPreferencePatch = useCallback((prefs: Record<string, unknown> | null | undefined) => {
    const n = (prefs?.notifications ?? {}) as Record<string, boolean>;
    setOrderUpdates(n.email_order_confirmed ?? true);
    setPaymentConfirmations(n.email_payment_received ?? true);
    setMarketingEmails(n.push_promotions ?? false);
  }, []);

  const load = useCallback(async () => {
    const [prefRes, profileRes] = await Promise.all([getPreferences(), getProfile()]);
    if (prefRes.error === null) applyPreferencePatch(prefRes.data as Record<string, unknown> | null);
    if (profileRes.error === null && profileRes.data) {
      setFullName(profileRes.data.fullName);
      setEmail(profileRes.data.email);
    }
  }, [applyPreferencePatch]);

  useEffect(() => {
    void (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const userIdRef = useRef<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      userIdRef.current = user.id;
      channel = supabase
        .channel(`prefs-live-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "user_preferences",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: unknown) => {
            const p = payload as { new?: Record<string, unknown> | null };
            applyPreferencePatch((p.new?.preferences as Record<string, unknown>) ?? null);
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
          (payload: unknown) => {
            const p = payload as { new?: Record<string, unknown> | null };
            const row = p.new;
            if (!row) return;
            if (row.full_name != null) setFullName(String(row.full_name));
            if (row.email != null) setEmail(String(row.email));
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const persist = useCallback(async (patch: PrefPatch) => {
    setSaving(true);
    const fd = new FormData();
    const next = {
      orderUpdates: patch.orderUpdates ?? orderUpdates,
      paymentConfirmations: patch.paymentConfirmations ?? paymentConfirmations,
      marketingEmails: patch.marketingEmails ?? marketingEmails,
    };
    fd.append("orderUpdates", next.orderUpdates ? "on" : "off");
    fd.append("paymentConfirmations", next.paymentConfirmations ? "on" : "off");
    fd.append("marketingEmails", next.marketingEmails ? "on" : "off");
    const res = await updatePreferences(undefined, fd);
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setLastSaved(new Date());
    toast.success("Preferences saved", { description: "Synced to your account" });
  }, [orderUpdates, paymentConfirmations, marketingEmails]);

  const toggleOrder = (v: boolean) => { setOrderUpdates(v); void persist({ orderUpdates: v }); };
  const togglePayment = (v: boolean) => { setPaymentConfirmations(v); void persist({ paymentConfirmations: v }); };
  const toggleMarketing = (v: boolean) => { setMarketingEmails(v); void persist({ marketingEmails: v }); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : lastSaved ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <CheckCheck className="h-4 w-4" aria-hidden="true" /> Saved
                </span>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Order updates</p>
              <p className="text-sm text-slate-500">Get notified about order status changes</p>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : (
              <Switch checked={orderUpdates} onCheckedChange={toggleOrder} aria-label="Order updates" />
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Payment confirmations</p>
              <p className="text-sm text-slate-500">Get notified when payments are verified</p>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : (
              <Switch checked={paymentConfirmations} onCheckedChange={togglePayment} aria-label="Payment confirmations" />
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Marketing emails</p>
              <p className="text-sm text-slate-500">Receive product updates and offers</p>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : (
              <Switch checked={marketingEmails} onCheckedChange={toggleMarketing} aria-label="Marketing emails" />
            )}
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-400">
              Changes are saved automatically and sync across your devices.
            </p>
            <Button size="sm" onClick={() => void persist({})} loading={saving}>
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information, synced live with your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={fullName} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </div>
          <Button asChild variant="outline">
            <a href="/dashboard/profile">Edit Profile</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Change password</p>
              <p className="text-sm text-slate-500">Update your password</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/security">Change</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}