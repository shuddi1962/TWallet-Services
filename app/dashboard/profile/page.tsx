"use client";

import { useRef, useState, useEffect, useActionState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays, Camera, Check, Clock, Mail,
  MapPin, Pencil, Plus, ShieldCheck, Trash2, User, X, Wallet,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { getProfile, getSecurityInfo, updateProfile, getUserAddresses, upsertUserAddress, deleteUserAddress, uploadAvatar, removeAvatar } from "@/features/dashboard/server/actions";
import { Loader2 } from "lucide-react";

type Address = {
  id: string; recipient: string; phone: string; line1: string; line2: string;
  city: string; state: string; postalCode: string; country: string;
  landmark: string; isDefault: boolean;
};

const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","Spain","Italy","Netherlands","United Arab Emirates","Singapore","Japan","Brazil","Mexico","India","Nigeria","South Africa"];
const emptyAddress: Address = {id:"",recipient:"",phone:"",line1:"",line2:"",city:"",state:"",postalCode:"",country:"",landmark:"",isDefault:false};

const selectClassName = "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [memberSince, setMemberSince] = useState<Date | null>(null);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [walletCount, setWalletCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>(emptyAddress);

  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    void (async () => {
      const [profileRes, securityRes, addressesRes] = await Promise.all([getProfile(), getSecurityInfo(), getUserAddresses()]);
      if (profileRes.error === null && profileRes.data) {
        setFullName(profileRes.data.fullName);
        setEmail(profileRes.data.email);
        setPhone(profileRes.data.phone);
        setCountry(profileRes.data.country);
        setAvatarUrl(profileRes.data.avatarUrl ?? "");
        setMemberSince(profileRes.data.createdAt ? new Date(profileRes.data.createdAt) : null);
        setLastLogin(profileRes.data.lastLogin ? new Date(profileRes.data.lastLogin) : null);
      }
      if (securityRes.error === null && securityRes.data) {
        setEmailConfirmed(securityRes.data.emailConfirmed);
        setWalletCount(securityRes.data.wallets.length);
      }
      if (addressesRes.error === null && addressesRes.addresses) {
        setAddresses(addressesRes.addresses.map((a) => ({
          id: a.id,
          recipient: a.full_name,
          phone: a.phone ?? "",
          line1: a.line1,
          line2: a.line2 ?? "",
          city: a.city,
          state: a.state ?? "",
          postalCode: a.postal_code,
          country: a.country,
          landmark: "",
          isDefault: a.is_default,
        })));
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
        .channel(`profile-live-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
          (payload: unknown) => {
            const p = payload as { new?: Record<string, unknown> | null; eventType: string };
            const row = p.new;
            if (!row) return;
            setFullName((f) => (row.full_name as string) || f);
            setAvatarUrl((a) => (row.avatar_url as string | null) || a || "");
            if (row.phone != null) setPhone(String(row.phone ?? ""));
            if (row.country != null) setCountry(String(row.country));
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "user_addresses", filter: `user_id=eq.${user.id}` },
          (payload: unknown) => {
            const p = payload as {
              eventType: string;
              new?: Record<string, unknown> | null;
              old?: Record<string, unknown> | null;
            };
            const toAddress = (r: Record<string, unknown>) => ({
              id: String(r.id),
              recipient: String(r.full_name ?? ""),
              phone: String(r.phone ?? ""),
              line1: String(r.line1 ?? ""),
              line2: String(r.line2 ?? ""),
              city: String(r.city ?? ""),
              state: String(r.state ?? ""),
              postalCode: String(r.postal_code ?? ""),
              country: String(r.country ?? ""),
              landmark: "",
              isDefault: Boolean(r.is_default),
            });
            setAddresses((prev) => {
              if (p.eventType === "DELETE") {
                const id = String(p.old?.id);
                const next = prev.filter((a) => a.id !== id);
                return next;
              }
              const row = p.new;
              if (!row?.id) return prev;
              const item = toAddress(row);
              const exists = prev.some((a) => a.id === item.id);
              return exists ? prev.map((a) => (a.id === item.id ? item : a)) : [...prev, item];
            });
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const initials = fullName.trim() ? fullName.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase() : "U";

  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5*1024*1024) { toast.error("Image must be smaller than 5MB."); return; }
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadAvatar(fd);
    if (result.error) { toast.error(result.error); return; }
    if (typeof result.avatarUrl === "string" && result.avatarUrl) setAvatarUrl(result.avatarUrl);
    toast.success("Profile photo updated.");
  };
  const handleRemoveAvatar = async () => {
    const res = await removeAvatar();
    if (res.error) { toast.error(res.error); return; }
    setAvatarUrl(""); toast.success("Profile photo removed.");
  };
  const saveAddress = async () => {
    if (!addressForm.recipient.trim()||!addressForm.line1.trim()||!addressForm.city.trim()||!addressForm.postalCode.trim()||!addressForm.country) { toast.error("Please complete all required address fields."); return; }
    const fd = new FormData();
    if (addressForm.id) fd.append("id", addressForm.id);
    fd.append("full_name", addressForm.recipient);
    fd.append("phone", addressForm.phone);
    fd.append("line1", addressForm.line1);
    fd.append("line2", addressForm.line2);
    fd.append("city", addressForm.city);
    fd.append("state", addressForm.state);
    fd.append("postal_code", addressForm.postalCode);
    fd.append("country", addressForm.country);
    fd.append("is_default", addressForm.isDefault ? "on" : "off");
    const res = await upsertUserAddress(undefined, fd);
    if (res.error) { toast.error(res.error); return; }
    const wasNew = editingId === "new";
    if (addressForm.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }
    setEditingId(null); setAddressForm(emptyAddress);
    toast.success(wasNew ? "Address added." : "Address updated.");
    const refresh = await getUserAddresses();
    if (refresh.error === null && refresh.addresses) {
      setAddresses(refresh.addresses.map((a) => ({
        id: a.id,
        recipient: a.full_name,
        phone: a.phone ?? "",
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state ?? "",
        postalCode: a.postal_code,
        country: a.country,
        landmark: "",
        isDefault: a.is_default,
      })));
    }
  };
  const deleteAddress = async (id: string) => {
    const target = addresses.find(a => a.id===id);
    const res = await deleteUserAddress(id);
    if (res.error) { toast.error(res.error); return; }
    setAddresses(prev => {
      const next = prev.filter(a => a.id!==id);
      if (target?.isDefault && next.length>0) return next.map((a,i)=> i===0?{...a,isDefault:true}:{...a,isDefault:false});
      return next;
    });
    toast.success("Address deleted.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <section aria-label="Profile" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal information and preferences</p>
      </div>

      {state?.success && (
        <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success" role="alert">{state.success}</div>
      )}
      {state?.error && (
        <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">{state.error}</div>
      )}

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" aria-hidden="true" />Personal Information</CardTitle>
            <CardDescription>Update your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} placeholder="you@example.com" disabled />
                <p className="text-xs text-slate-500">Contact support to change your email</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 000 0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select id="country" name="country" className={selectClassName} value={country} onChange={e=>setCountry(e.target.value)}>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <Button type="submit" loading={pending}>Save Changes</Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" aria-hidden="true" />Profile Photo</CardTitle>
          <CardDescription>Upload a profile picture visible across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {avatarUrl ? <img src={avatarUrl} alt="Profile avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">{initials}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={()=>fileInputRef.current?.click()} aria-label="Upload avatar image"><Camera className="h-4 w-4" aria-hidden="true" />Upload</Button>
              {avatarUrl && <Button variant="ghost" size="sm" onClick={handleRemoveAvatar} aria-label="Remove avatar"><X className="h-4 w-4" aria-hidden="true" />Remove Avatar</Button>}
              <p className="text-xs text-slate-500">PNG, JPEG or WebP. Max 5MB.</p>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onUploadAvatar} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" aria-hidden="true" />Shipping Addresses</CardTitle>
          <CardDescription>Used for physical card delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {addresses.length===0 && editingId!=="new" && <p className="text-sm text-slate-500">No saved addresses yet.</p>}
            {addresses.map(addr => (
              <div key={addr.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{addr.recipient}</p>
                      {addr.isDefault && <Badge className="rounded-full border-transparent bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">Default</Badge>}
                    </div>
                    <p className="text-sm text-slate-500">{addr.line1}{addr.line2?`, ${addr.line2}`:""}</p>
                    <p className="text-sm text-slate-500">{addr.city}{addr.state?`, ${addr.state}`:""} {addr.postalCode}</p>
                    <p className="text-sm text-slate-500">{addr.country}</p>
                    {addr.phone && <p className="text-sm text-slate-500">{addr.phone}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={()=>{setAddressForm({...addr}); setEditingId(addr.id);}}><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Edit</Button>
                    <Button variant="ghost" size="xs" onClick={()=>deleteAddress(addr.id)}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingId !== null ? (
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">{editingId==="new"?"Add New Address":"Edit Address"}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="addr-recipient">Recipient Name</Label><Input id="addr-recipient" value={addressForm.recipient} onChange={e=>setAddressForm({...addressForm,recipient:e.target.value})} placeholder="John Doe" /></div>
                <div className="space-y-2"><Label htmlFor="addr-phone">Phone</Label><Input id="addr-phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm,phone:e.target.value})} placeholder="+1 555 000 0000" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="addr-line1">Address Line 1</Label><Input id="addr-line1" value={addressForm.line1} onChange={e=>setAddressForm({...addressForm,line1:e.target.value})} placeholder="123 Market St" /></div>
              <div className="space-y-2"><Label htmlFor="addr-line2">Address Line 2</Label><Input id="addr-line2" value={addressForm.line2} onChange={e=>setAddressForm({...addressForm,line2:e.target.value})} placeholder="Apt 4B (optional)" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="addr-city">City</Label><Input id="addr-city" value={addressForm.city} onChange={e=>setAddressForm({...addressForm,city:e.target.value})} placeholder="San Francisco" /></div>
                <div className="space-y-2"><Label htmlFor="addr-state">State</Label><Input id="addr-state" value={addressForm.state} onChange={e=>setAddressForm({...addressForm,state:e.target.value})} placeholder="CA" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="addr-postal">Postal Code</Label><Input id="addr-postal" value={addressForm.postalCode} onChange={e=>setAddressForm({...addressForm,postalCode:e.target.value})} placeholder="94103" /></div>
                <div className="space-y-2"><Label htmlFor="addr-country">Country</Label><select id="addr-country" className={selectClassName} value={addressForm.country} onChange={e=>setAddressForm({...addressForm,country:e.target.value})}><option value="">Select country</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={saveAddress}><Check className="h-4 w-4" aria-hidden="true" />{editingId==="new"?"Add Address":"Save Address"}</Button>
                <Button variant="ghost" onClick={()=>{setEditingId(null); setAddressForm(emptyAddress);}}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={()=>{setAddressForm({...emptyAddress}); setEditingId("new");}}><Plus className="h-4 w-4" aria-hidden="true" />Add New Address</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" aria-hidden="true" />Connected Wallets</CardTitle>
          <CardDescription>Manage your connected crypto wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200">
                <Wallet className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{walletCount} wallet{walletCount === 1 ? "" : "s"} connected</p>
                <p className="text-xs text-slate-500">Connect or switch your wallet for payments and card orders</p>
              </div>
            </div>
            <Button asChild>
              <a href="/dashboard/wallet">Manage Wallet</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" aria-hidden="true" />Account Status</CardTitle>
          <CardDescription>Your account summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-500"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Email verified</span><Badge variant={emailConfirmed ? "success" : "warning"}>{emailConfirmed ? "Verified" : "Pending"}</Badge></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-500"><Check className="h-4 w-4" aria-hidden="true" />Account status</span><Badge variant="success">Active</Badge></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" aria-hidden="true" />Member since</span><span className="text-sm text-slate-700">{memberSince ? memberSince.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}) : "—"}</span></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-500"><Clock className="h-4 w-4" aria-hidden="true" />Last login</span><span className="text-sm text-slate-700">{lastLogin ? formatDistanceToNow(lastLogin,{addSuffix:true}) : "—"}</span></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" aria-hidden="true" />Country</span><span className="text-sm text-slate-700">{country}</span></div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
