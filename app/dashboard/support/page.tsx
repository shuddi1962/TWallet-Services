"use client";

import { useState, useActionState, useEffect } from "react";
import {
  CreditCard, DollarSign, Truck, User,
  HelpCircle, Ticket, CheckCircle2, ChevronRight, LifeBuoy,
  Loader2,
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
import { createTicket, getMyTickets } from "@/features/support/server/actions";
import { formatDistanceToNow } from "date-fns";

type Tab = "open" | "resolved" | "create" | "kb";
type Category = "shipping" | "payment" | "card" | "account" | "other";
type Priority = "low" | "medium" | "high" | "urgent";
type Status = "open" | "pending" | "resolved" | "closed";

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  category: Category;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string | null;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "Open Tickets", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "Create Ticket", value: "create" },
  { label: "Knowledge Base", value: "kb" },
];

const CATEGORY_META: Record<Category, { label: string; icon: React.ElementType }> = {
  shipping: { label: "Shipping", icon: Truck },
  payment: { label: "Payment", icon: DollarSign },
  card: { label: "Card", icon: CreditCard },
  account: { label: "Account", icon: User },
  other: { label: "Other", icon: HelpCircle },
};

const PRIORITY_VARIANT: Record<Priority, "outline" | "info" | "warning" | "error"> = {
  low: "outline", medium: "info", high: "warning", urgent: "error",
};

const STATUS_VARIANT: Record<Status, "outline" | "info" | "warning" | "success"> = {
  open: "warning", pending: "info", resolved: "success", closed: "outline",
};

const FAQS: { q: string; a: string }[] = [
  { q: "How do I order a TWallet Card?", a: "Open the Cards page, pick your preferred card variant, and complete checkout. You pay with crypto from a connected wallet and can follow progress under Orders." },
  { q: "Which cryptocurrencies can I pay with?", a: "TWallet supports stablecoin payments (USDC, USDT) across Ethereum, Polygon, Base, Arbitrum, Optimism, and BNB Smart Chain." },
  { q: "How long does card delivery take?", a: "Virtual cards are issued instantly after payment confirmation. Physical cards ship within 3–7 business days with tracking in Orders." },
  { q: "How do I connect my wallet?", a: "Click 'Connect Wallet' in the header. Your wallet will open to approve the connection. TWallet never holds your keys — every transaction is approved in your wallet." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled while still 'pending'. Once 'processing', contact support for help." },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [state, formAction, pending] = useActionState(createTicket, undefined);

  useEffect(() => {
    void (async () => {
      const res = await getMyTickets();
      if (res.error === null && res.data) {
        setTickets(res.data as Ticket[]);
      }
      setTicketsLoading(false);
    })();
  }, []);

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "pending");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  const renderTicketCard = (t: Ticket) => {
    const cat = CATEGORY_META[t.category] ?? CATEGORY_META.other;
    const CategoryIcon = cat.icon;
    return (
      <Card key={t.id} className="transition-colors hover:border-slate-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-slate-400">#{t.ticket_number}</p>
              <h3 className="mt-1 truncate text-base font-semibold text-slate-900">{t.subject}</h3>
            </div>
            <span className="shrink-0 text-xs text-slate-400">
              {formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 border-slate-200 text-slate-600">
              <CategoryIcon className="h-3 w-3" aria-hidden="true" />
              {cat.label}
            </Badge>
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
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-500">Get help with your orders, cards, and account</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Support sections">
        {TABS.map((tab) => (
          <button
            key={tab.value} type="button" onClick={() => setActiveTab(tab.value)}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
              activeTab === tab.value
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-600",
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
          {ticketsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : openTickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No open tickets"
              description="You don't have any tickets awaiting a response right now."
              action={<Button onClick={() => setActiveTab("create")}>Create a Ticket</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{openTickets.map(renderTicketCard)}</div>
          )}
        </div>
      )}

      {activeTab === "resolved" && (
        <div id="support-panel-resolved" role="tabpanel" aria-labelledby="support-tab-resolved" className="space-y-4">
          {ticketsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : resolvedTickets.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No resolved tickets"
              description="Tickets that have been resolved or closed will appear here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{resolvedTickets.map(renderTicketCard)}</div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div id="support-panel-create" role="tabpanel" aria-labelledby="support-tab-create">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200">
                  <LifeBuoy className="h-5 w-5 text-brand-600" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle>Create a Ticket</CardTitle>
                  <CardDescription>Tell us what&apos;s going on. We&apos;ll get back to you within 24 hours.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <div className="mb-4 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success" role="alert">{state.success}</div>
              )}
              {state?.error && (
                <div className="mb-4 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">{state.error}</div>
              )}

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="redirect" value="/dashboard/support" />
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-error">*</span></Label>
                  <Input id="subject" name="subject" placeholder="Briefly describe your issue" maxLength={200} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-error">*</span></Label>
                    <select id="category" name="category" defaultValue="other" className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                      {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select id="priority" name="priority" defaultValue="medium" className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
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
                <div className="flex justify-end">
                  <Button type="submit" loading={pending}>Submit Ticket</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "kb" && (
        <div id="support-panel-kb" role="tabpanel" aria-labelledby="support-tab-kb" className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-slate-500">{faq.a}</div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
