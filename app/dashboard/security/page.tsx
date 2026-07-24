"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Smartphone, Key, LogOut } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security Center</h1>
        <p className="mt-1 text-sm text-surface-400">
          Manage your account security and connected devices
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-brand-400" aria-hidden="true" />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>
            Last changed 30 days ago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-400" aria-hidden="true" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-surface-400">Status</span>
          <Badge variant="outline" className="text-amber-400 border-amber-400/30">Not Enabled</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-brand-400" aria-hidden="true" />
            <CardTitle>Active Sessions</CardTitle>
          </div>
          <CardDescription>
            Devices currently logged into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { device: "Chrome on Windows", current: true, lastActive: "Now" },
              { device: "Safari on iPhone", current: false, lastActive: "2 hours ago" },
            ].map((session) => (
              <div
                key={session.device}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-surface-900/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 text-surface-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-white">{session.device}</p>
                    <p className="text-xs text-surface-400">{session.lastActive}</p>
                  </div>
                </div>
                {session.current ? (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Current</Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="text-surface-400">Revoke</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
