"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Shield, Lock, Wallet as WalletIcon, Monitor, AlertTriangle, Clock,
  LogOut, Check, X, Eye, Trash2,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully");
    setChangePasswordOpen(false);
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const handleRevokeSession = () => toast.success("Session revoked");
  const handleLogoutAll = () => toast.success("Logged out of all devices");

  // Password strength
  const strength = newPassword.length < 8 ? 0 : newPassword.length < 10 ? 1 : newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/) && newPassword.match(/[^a-zA-Z0-9]/) ? 3 : 2;
  const strengthLabel = ["Too short", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["text-surface-500", "text-red-400", "text-yellow-400", "text-green-400"][strength];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security</h1>
        <p className="mt-1 text-sm text-surface-400">Manage your account security</p>
      </div>

      {/* 1. Password Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Lock className="h-5 w-5" aria-hidden="true" />Password Status</CardTitle>
          <CardDescription>Keep your account secure with a strong password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-400">Last changed: 2 months ago</p>
              <p className={`text-sm font-medium ${strengthColor}`}>Strength: {strength > 0 ? strengthLabel : "—"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen((v) => !v)}>
              {changePasswordOpen ? "Cancel" : "Change Password"}
            </Button>
          </div>
          {changePasswordOpen && (
            <div className="space-y-4 rounded-lg border border-white/10 bg-surface-800/30 p-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
                {newPassword && <p className={`text-xs ${strengthColor}`}>Strength: {strengthLabel}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button onClick={handleChangePassword}><Check className="h-4 w-4" aria-hidden="true" />Update Password</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><WalletIcon className="h-5 w-5" aria-hidden="true" />Connected Wallets</CardTitle>
          <CardDescription>Wallets linked to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-lg border border-surface-800 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800"><WalletIcon className="h-5 w-5 text-surface-400" aria-hidden="true" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">No wallets connected</p>
              <p className="text-sm text-surface-400">Connect a wallet from the dashboard overview</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Recent Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Clock className="h-5 w-5" aria-hidden="true" />Recent Login Activity</CardTitle>
          <CardDescription>Track sign-in events on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-surface-400" aria-hidden="true" />
                <div><p className="text-sm text-white">Chrome on macOS</p><p className="text-xs text-surface-500">San Francisco, CA · 192.168.1.1</p></div>
              </div>
              <span className="text-xs text-surface-500">2 hours ago</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-surface-400" aria-hidden="true" />
                <div><p className="text-sm text-white">Safari on iOS</p><p className="text-xs text-surface-500">New York, NY · 10.0.0.2</p></div>
              </div>
              <span className="text-xs text-surface-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Shield className="h-5 w-5" aria-hidden="true" />Trusted Devices</CardTitle>
          <CardDescription>Devices that bypass 2FA on future logins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white">MacBook Pro</p><p className="text-xs text-surface-500">Added Jul 20, 2026</p></div>
              <Button variant="ghost" size="sm" onClick={() => toast.success("Device removed")}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white">iPhone 15 Pro</p><p className="text-xs text-surface-500">Added Jul 18, 2026</p></div>
              <Button variant="ghost" size="sm" onClick={() => toast.success("Device removed")}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><AlertTriangle className="h-5 w-5" aria-hidden="true" />Security Alerts</CardTitle>
          <CardDescription>Recent security events on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">New device sign-in</p>
              <p className="text-xs text-surface-400">A new device signed into your account from San Francisco, CA · 2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toast.success("Alert dismissed")}>Dismiss</Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Eye className="h-5 w-5" aria-hidden="true" />Active Sessions</CardTitle>
          <CardDescription>Devices currently signed into your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-surface-400" aria-hidden="true" />
                <div><p className="text-sm text-white">Chrome on macOS <Badge variant="success" className="ml-2">Current</Badge></p><p className="text-xs text-surface-500">San Francisco, CA · 2 hours ago</p></div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-surface-400" aria-hidden="true" />
                <div><p className="text-sm text-white">Safari on iOS</p><p className="text-xs text-surface-500">New York, NY · 3 days ago</p></div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRevokeSession}><X className="h-4 w-4" aria-hidden="true" />Revoke</Button>
            </div>
          </div>
          <Separator />
          <Button variant="outline" onClick={handleLogoutAll}><LogOut className="h-4 w-4" aria-hidden="true" />Logout of All Devices</Button>
        </CardContent>
      </Card>
    </div>
  );
}