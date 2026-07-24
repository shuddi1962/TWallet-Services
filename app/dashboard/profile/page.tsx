"use client";

import { useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays, Camera, Check, Clock, Globe, Hash, Languages, Mail,
  MapPin, Package, Pencil, Plus, ShieldCheck, Trash2, User, X,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Address = {
  id: string; recipient: string; phone: string; line1: string; line2: string;
  city: string; state: string; postalCode: string; country: string;
  landmark: string; isDefault: boolean;
};

const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","Spain","Italy","Netherlands","United Arab Emirates","Singapore","Japan","Brazil","Mexico","India","Nigeria","South Africa"];
const LANGUAGES = [{value:"en",label:"English"},{value:"es",label:"Spanish"},{value:"fr",label:"French"},{value:"de",label:"German"},{value:"pt",label:"Portuguese"},{value:"ar",label:"Arabic"},{value:"hi",label:"Hindi"},{value:"ja",label:"Japanese"},{value:"zh",label:"Chinese"}];
const DATE_FORMATS = [{value:"MMM D, YYYY",label:"MMM D, YYYY (Jul 24, 2026)"},{value:"DD/MM/YYYY",label:"DD/MM/YYYY (24/07/2026)"},{value:"MM/DD/YYYY",label:"MM/DD/YYYY (07/24/2026)"},{value:"YYYY-MM-DD",label:"YYYY-MM-DD (2026-07-24)"}];
const NUMBER_FORMATS = [{value:"1,234.56",label:"1,234.56"},{value:"1.234,56",label:"1.234,56"},{value:"1 234.56",label:"1 234.56"},{value:"1,23,456.78",label:"1,23,456.78"}];
const emptyAddress: Address = {id:"",recipient:"",phone:"",line1:"",line2:"",city:"",state:"",postalCode:"",country:"",landmark:"",isDefault:false};

const selectClassName = "flex h-10 w-full rounded-md border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50";
const textareaClassName = "flex min-h-[80px] w-full rounded-md border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([
    {id:"addr-1",recipient:"John Doe",phone:"+1 555 000 0000",line1:"123 Market St",line2:"Apt 4B",city:"San Francisco",state:"CA",postalCode:"94103",country:"United States",landmark:"",isDefault:true},
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>(emptyAddress);
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MMM D, YYYY");
  const [numberFormat, setNumberFormat] = useState("1,234.56");
  const [lastLogin] = useState(() => new Date("2026-07-22T10:30:00Z"));
  const memberSince = new Date("2026-07-21T00:00:00Z");
  const totalOrders = 5;

  const initials = fullName.trim() ? fullName.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase() : "U";

  const onUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5*1024*1024) { toast.error("Image must be smaller than 5MB."); return; }
    setAvatarUrl(URL.createObjectURL(file)); toast.success("Profile photo updated.");
  };
  const removeAvatar = () => { setAvatarUrl(""); toast.success("Profile photo removed."); };
  const saveAddress = () => {
    if (!addressForm.recipient.trim()||!addressForm.line1.trim()||!addressForm.city.trim()||!addressForm.postalCode.trim()||!addressForm.country) { toast.error("Please complete all required address fields."); return; }
    if (editingId === "new") {
      const newAddr = { ...addressForm, id: crypto.randomUUID() };
      if (addresses.length === 0) newAddr.isDefault = true;
      setAddresses(prev => addressForm.isDefault ? [...prev.map(a=>({...a,isDefault:false})), newAddr] : [...prev, newAddr]);
      toast.success("Address added.");
    } else if (editingId) {
      setAddresses(prev => prev.map(a => a.id===editingId ? (addressForm.isDefault?{...addressForm,isDefault:true}:{...addressForm}) : (addressForm.isDefault?{...a,isDefault:false}:a)));
      toast.success("Address updated.");
    }
    setEditingId(null); setAddressForm(emptyAddress);
  };
  const makeDefault = (id: string) => { setAddresses(prev => prev.map(a => ({...a, isDefault: a.id===id}))); toast.success("Default address updated."); };
  const deleteAddress = (id: string) => {
    const target = addresses.find(a => a.id===id);
    setAddresses(prev => {
      const next = prev.filter(a => a.id!==id);
      if (target?.isDefault && next.length>0) return next.map((a,i)=> i===0?{...a,isDefault:true}:{...a,isDefault:false});
      return next;
    });
    toast.success("Address deleted.");
  };
  const handleDeleteAccount = () => { if (window.confirm("This will permanently delete your account. This action cannot be undone.")) toast.success("Account deletion requested. Check your email to confirm."); };

  return (
    <section aria-label="Profile" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-surface-400">Manage your personal information and preferences</p>
      </div>

      {/* 1. Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><User className="h-5 w-5" aria-hidden="true" />Personal Information</CardTitle>
          <CardDescription>Update your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="John Doe" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" disabled /><p className="text-xs text-surface-500">Contact support to change your email</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 000 0000" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="bio">Bio</Label><textarea id="bio" className={textareaClassName} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell us a bit about yourself" /></div>
          <Button onClick={()=>toast.success("Personal information saved.")}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* 2. Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Camera className="h-5 w-5" aria-hidden="true" />Profile Photo</CardTitle>
          <CardDescription>Upload a profile picture visible across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-surface-800">
              {avatarUrl ? <img src={avatarUrl} alt="Profile avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-surface-300">{initials}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={()=>fileInputRef.current?.click()} aria-label="Upload avatar image"><Camera className="h-4 w-4" aria-hidden="true" />Upload</Button>
              {avatarUrl && <Button variant="ghost" size="sm" onClick={removeAvatar} aria-label="Remove avatar"><X className="h-4 w-4" aria-hidden="true" />Remove Avatar</Button>}
              <p className="text-xs text-surface-500">PNG, JPEG or WebP. Max 5MB.</p>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onUploadAvatar} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Mail className="h-5 w-5" aria-hidden="true" />Contact Details</CardTitle>
          <CardDescription>Alternate ways to reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="contactPhone">Phone</Label><Input id="contactPhone" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="+1 555 000 0000" /></div>
            <div className="space-y-2"><Label htmlFor="alternateEmail">Alternate Email</Label><Input id="alternateEmail" type="email" value={alternateEmail} onChange={e=>setAlternateEmail(e.target.value)} placeholder="backup@example.com" /></div>
          </div>
          <Button onClick={()=>toast.success("Contact details saved.")}>Save Contact Details</Button>
        </CardContent>
      </Card>

      {/* 4. Country & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Globe className="h-5 w-5" aria-hidden="true" />Country &amp; Location</CardTitle>
          <CardDescription>Where you are based</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="country">Country</Label><select id="country" className={selectClassName} value={country} onChange={e=>setCountry(e.target.value)}><option value="">Select country</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="state">State / Province</Label><Input id="state" value={state} onChange={e=>setState(e.target.value)} placeholder="CA" /></div>
            <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="San Francisco" /></div>
          </div>
          <Button onClick={()=>toast.success("Location saved.")}>Save Location</Button>
        </CardContent>
      </Card>

      {/* 5. Shipping Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><MapPin className="h-5 w-5" aria-hidden="true" />Shipping Addresses</CardTitle>
          <CardDescription>Used for physical card delivery — add up to several addresses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {addresses.length===0 && editingId!=="new" && <p className="text-sm text-surface-400">No saved addresses yet.</p>}
            {addresses.map(addr => (
              <div key={addr.id} className="rounded-lg border border-white/10 bg-surface-800/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{addr.recipient}</p>
                      {addr.isDefault && <Badge className="rounded-full border-transparent bg-brand-600/15 px-2 py-0.5 text-xs font-medium text-brand-400">Default</Badge>}
                    </div>
                    <p className="text-sm text-surface-400">{addr.line1}{addr.line2?`, ${addr.line2}`:""}</p>
                    <p className="text-sm text-surface-400">{addr.city}{addr.state?`, ${addr.state}`:""} {addr.postalCode}</p>
                    <p className="text-sm text-surface-400">{addr.country}</p>
                    {addr.phone && <p className="text-sm text-surface-400">{addr.phone}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={()=>{setAddressForm({...addr}); setEditingId(addr.id);}}><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Edit</Button>
                    <Button variant="ghost" size="xs" onClick={()=>deleteAddress(addr.id)}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Delete</Button>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">Set as default address</span>
                  <Switch checked={addr.isDefault} onCheckedChange={()=>makeDefault(addr.id)} />
                </div>
              </div>
            ))}
          </div>

          {editingId !== null ? (
            <div className="space-y-4 rounded-lg border border-white/10 bg-surface-800/30 p-4">
              <p className="text-sm font-medium text-white">{editingId==="new"?"Add New Address":"Edit Address"}</p>
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

      {/* 6. Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><Languages className="h-5 w-5" aria-hidden="true" />Preferences</CardTitle>
          <CardDescription>Localization and display formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="language" className="flex items-center gap-1.5"><Languages className="h-4 w-4" aria-hidden="true" />Language</Label><select id="language" className={selectClassName} value={language} onChange={e=>setLanguage(e.target.value)}>{LANGUAGES.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="dateFormat" className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />Date Format</Label><select id="dateFormat" className={selectClassName} value={dateFormat} onChange={e=>setDateFormat(e.target.value)}>{DATE_FORMATS.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="numberFormat" className="flex items-center gap-1.5"><Hash className="h-4 w-4" aria-hidden="true" />Number Format</Label><select id="numberFormat" className={selectClassName} value={numberFormat} onChange={e=>setNumberFormat(e.target.value)}>{NUMBER_FORMATS.map(n=><option key={n.value} value={n.value}>{n.label}</option>)}</select></div>
          </div>
          <Button onClick={()=>toast.success("Preferences saved.")}>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* 7. Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><ShieldCheck className="h-5 w-5" aria-hidden="true" />Account Status</CardTitle>
          <CardDescription>Your account summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-surface-400"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Email verified</span><Badge variant="success">Verified</Badge></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-surface-400"><Check className="h-4 w-4" aria-hidden="true" />Account status</span><Badge variant="success">Active</Badge></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-surface-400"><CalendarDays className="h-4 w-4" aria-hidden="true" />Member since</span><span className="text-sm text-surface-200">{memberSince.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-surface-400"><Clock className="h-4 w-4" aria-hidden="true" />Last login</span><span className="text-sm text-surface-200">{formatDistanceToNow(lastLogin,{addSuffix:true})}</span></div>
            <Separator />
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-surface-400"><Package className="h-4 w-4" aria-hidden="true" />Total orders</span><span className="text-sm text-surface-200">{totalOrders} orders</span></div>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-medium text-white">Delete account</p><p className="text-sm text-surface-400">Permanently remove your account and data. This cannot be undone.</p></div>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}