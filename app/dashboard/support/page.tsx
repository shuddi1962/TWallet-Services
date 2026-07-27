"use client";

import { useState, useActionState } from "react";
import {
  MessageCircle, ShoppingCart, CreditCard, DollarSign, Wallet, Wrench,
  HelpCircle, Ticket, CheckCircle2, ChevronRight, LifeBuoy,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";
import { createTicket } from "@/features/support/server/actions";

type Tab = "open" | "resolved" | "create" | "kb";
type Category = "general" | "order" | "card" | "payment" | "wallet" | "technical" | "other";
type Priority = "low" | "medium" | "high" | "urgent";

interface Ticket {
  id: string; ticketNumber: string; subject: string; category: Category;
  priority: Priority; status: "open" | "pending" | "resolved" | "closed";
  createdAt: string; lastReplyAt: string | null;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "Open Tickets", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "Create Ticket", value: "create" },
  { label: "Knowledge Base", value: "kb" },
];

const CATEGORY_META: Record<Category, { label: string; icon: React.ElementType }> = {
  general: { label: "General", icon: MessageCircle },
  order: { label: "Order", icon: ShoppingCart },
  card: { label: "Card", icon: CreditCard },
  payment: { label: "Payment", icon: DollarSign },
  wallet: { label: "Wallet", icon: Wallet },
  technical: { label: "Technical", icon: Wrench },
  other: { label: "Other", icon: HelpCircle },
};

const PRIORITY_VARIANT: Record<Priority, "outline" | "info" | "warning" | "error"> = {
  low: "outline", medium: "info", high: "warning", urgent: "error",
};

const STATUS_VARIANT: Record<string, "outline" | "info" | "warning" | "success"> = {
  open: "warning", pending: "info", resolved: "success", closed: "outline",
};

const FAQS: { q: string; a: string }[] = [
  { q: "How do I order a TWallet Card?", a: "Open the Cards page, pick your preferred card variant, and complete checkout. You pay with crypto from a connected wallet and can follow progress under Orders." },
  { q: "Which cryptocurrencies can I pay with?", a: "TWallet supports stablecoin payments (USDC, USDT) across Ethereum, Polygon, Base, Arbitrum, Optimism, and BNB Smart Chain." },
  { q: "How long does card delivery take?", a: "Virtual cards are issued instantly after payment confirmation. Physical cards ship within 3–7 business days with tracking in Orders." },
  { q: "How do I connect my wallet?", a: "Click 'Connect Wallet' in the header. Trust Wallet will open on your phone to approve the connection. TWallet never holds your keys — every transaction is approved in your wallet." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled while still 'pending'. Once 'processing', contact support for help." },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const [tickets] = useState<Ticket[]>([]);
  const [state, formAction, pending] = useActionState(createTicket, undefined);

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "pending");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  const renderTicketCard = (t: Ticket) => {
    const cat = CATEGORY_META[t.category];
    const CategoryIcon = cat.icon;
    return (
      <Card key={t.id} className="border-surface-800 bg-surface-900 transition-colors hover:border-surface-700">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-surface-500">#{t.ticketNumber}</p>
              <h3 className="mt-1 truncate text-base font-semibold text-white">{t.subject}</h3>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">View</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 border-surface-700 text-surface-300"><CategoryIcon className="h-3 w-3" aria-hidden="true" />{cat.label}</Badge>
            <Badge variant={PRIORITY_VARIANT[t.priority]}>{t.priority}</Badge>
            <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <p className="mt-1 text-sm text-surface-400">Get help with your orders, cards, and account</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Support sections">
        {TABS.map((tab) => (
          <button
            key={tab.value} type="button" onClick={() => setActiveTab(tab.value)}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
              activeTab === tab.value
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-surface-500 hover:border-surface-600 hover:text-surface-300",
            )}
            role="tab" aria-selected={activeTab === tab.value}
            aria-controls={`support-panel-${tab.value}`} id={`support-tab-${tab.value}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "open" && (
        <div id="support-panel-open" role="tabpanel" aria-labelledby="support-tab-open" className="space-y-4">
          {openTickets.length === 0 ? (
            <EmptyState icon={Ticket} title="No open tickets" description="You don't have any tickets awaiting a response right now." action={<Button onClick={() => setActiveTab("create")}>Create a Ticket</Button>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{openTickets.map(renderTicketCard)}</div>
          )}
        </div>
      )}

      {activeTab === "resolved" && (
        <div id="support-panel-resolved" role="tabpanel" aria-labelledby="support-tab-resolved" className="space-y-4">
          {resolvedTickets.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No resolved tickets" description="Tickets that have been resolved or closed will appear here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{resolvedTickets.map(renderTicketCard)}</div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div id="support-panel-create" role="tabpanel" aria-labelledby="support-tab-create">
          <Card className="border-surface-800 bg-surface-900">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                  <LifeBuoy className="h-5 w-5 text-brand-400" aria-hidden="true" />
                </div>
                <div><CardTitle>Create a Ticket</CardTitle><CardDescription>Tell us what&apos;s going on. We&apos;ll get back to you within 24 hours.</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <div className="mb-4 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success" role="alert">{state.success}</div>
              )}
              {state?.error && (
                <div className="mb-4 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">{state.error}</div>
              )}
              <form className="space-y-4" action={formAction}>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-error">*</span></Label>
                  <Input id="subject" name="subject" placeholder="Briefly describe your issue" maxLength={200} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-error">*</span></Label>
                    <select id="category" name="category" defaultValue="general" className="flex h-10 w-full rounded-md border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                      {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select id="priority" name="priority" defaultValue="medium" className="flex h-10 w-full rounded-md border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderId">Related Order ID (optional)</Label>
                  <Input id="orderId" name="orderId" placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-error">*</span></Label>
                  <Textarea id="message" name="message" placeholder="Describe your issue in as much detail as possible..." rows={6} maxLength={5000} required />
                </div>
                <div className="flex justify-end"><Button type="submit" loading={pending}>Submit</Button></div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "kb" && (
        <div id="support-panel-kb" role="tabpanel" aria-labelledby="support-tab-kb" className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-surface-800 bg-surface-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-surface-500 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-surface-400">{faq.a}</div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}