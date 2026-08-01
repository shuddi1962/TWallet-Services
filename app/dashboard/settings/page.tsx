"use client";

import { useState, useEffect, useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getPreferences, updatePreferences } from "@/features/dashboard/server/actions";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [paymentConfirmations, setPaymentConfirmations] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loading, setLoading] = useState(true);

  const [state, formAction, pending] = useActionState(updatePreferences, undefined);

  useEffect(() => {
    void (async () => {
      const res = await getPreferences();
      if (res.error === null && res.data) {
        const prefs = res.data as { notifications?: Record<string, boolean> };
        const n = prefs.notifications ?? {};
        setOrderUpdates(n.email_order_confirmed ?? true);
        setPaymentConfirmations(n.email_payment_received ?? true);
        setMarketingEmails(n.push_promotions ?? false);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences
        </p>
      </div>

      {state?.success && (
        <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success" role="alert">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">
          {state.error}
        </div>
      )}

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you want to be notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Order updates</p>
                <p className="text-sm text-slate-500">Get notified about order status changes</p>
              </div>
              <input type="hidden" name="orderUpdates" value={orderUpdates ? "on" : "off"} />
              <input type="hidden" name="paymentConfirmations" value={paymentConfirmations ? "on" : "off"} />
              <input type="hidden" name="marketingEmails" value={marketingEmails ? "on" : "off"} />
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : (
                <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} aria-label="Order updates" />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Payment confirmations</p>
                <p className="text-sm text-slate-500">Get notified when payments are verified</p>
              </div>
              <Switch checked={paymentConfirmations} onCheckedChange={setPaymentConfirmations} aria-label="Payment confirmations" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Marketing emails</p>
                <p className="text-sm text-slate-500">Receive product updates and offers</p>
              </div>
              <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} aria-label="Marketing emails" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={pending}>
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information on the profile page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" disabled />
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
