"use client";

import { useState, useActionState, useEffect, useCallback, useRef } from "react";
import {
  CreditCard, DollarSign, Truck, User,
  HelpCircle, Ticket, CheckCircle2, ChevronRight, LifeBuoy,
  Loader2, RefreshCcw, RefreshCw, Coins, Zap, Puzzle,
  FileCheck2, TriangleAlert, HandCoins, Wrench, TrendingUp, Handshake,
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
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import {
  createTicket,
  getMyTickets,
  getCustomerTicketMessages,
  replyToTicket,
} from "@/features/support/server/actions";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type Tab = "open" | "resolved" | "create" | "kb";

type Status = "open" | "pending" | "resolved" | "closed" | "escalated";

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: Status;
  created_at: string;
  updated_at: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  author: "customer" | "admin";
  message: string;
  internal: boolean;
  created_at: string;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "Open Tickets", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "Create Ticket", value: "create" },
  { label: "Knowledge Base", value: "kb" },
];

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType }> = {
  shipping: { label: "Shipping", icon: Truck },
  payment: { label: "Payment", icon: DollarSign },
  card: { label: "Card", icon: CreditCard },
  account: { label: "Account", icon: User },
  order: { label: "Order Card", icon: Ticket },
  transaction: { label: "Transaction", icon: RefreshCw },
  browser: { label: "Browser / Extension", icon: Puzzle },
  gas_fee: { label: "Gas Fee", icon: Zap },
  claims: { label: "Claims", icon: FileCheck2 },
  security: { label: "Security Issues", icon: TriangleAlert },
  token: { label: "Token / NFT", icon: Coins },
  swap: { label: "Swap", icon: RefreshCcw },
  buy_crypto: { label: "Buy Crypto", icon: Coins },
  wallet_connect: { label: "WalletConnect / DApps", icon: HandCoins },
  restore_wallet: { label: "Restoring My Wallet", icon: Wrench },
  staking: { label: "Staking", icon: TrendingUp },
  partnership: { label: "Partnership", icon: Handshake },
  other: { label: "Other", icon: HelpCircle },
};

const PRIORITY_VARIANT: Record<string, "outline" | "info" | "warning" | "error"> = {
  low: "outline", medium: "info", high: "warning", urgent: "error",
};

const STATUS_VARIANT: Record<string, "outline" | "info" | "warning" | "success"> = {
  open: "warning", pending: "info", resolved: "success", closed: "outline",
};

const CATEGORY_ORDER = [
  "order", "payment", "transaction", "card", "shipping", "claims",
  "account", "security", "token", "restore_wallet",
  "wallet_connect", "browser", "buy_crypto", "swap", "staking", "gas_fee", "partnership", "other",
];

const FAQS: { q: string; a: string }[] = [
  { q: "How do I order a TWallet Card?", a: "Open the Cards page, pick your preferred card variant, and complete checkout. You pay with crypto from a connected wallet and can follow progress under Orders." },
  { q: "Which cryptocurrencies can I pay with?", a: "TWallet supports stablecoin payments (USDC, USDT) across Ethereum, Polygon, Base, Arbitrum, Optimism, and BNB Smart Chain." },
  { q: "How long does card delivery take?", a: "Virtual cards are issued instantly after payment confirmation. Physical cards ship within 3–7 business days with tracking in Orders." },
  { q: "How do I connect my wallet?", a: "Click 'Connect Wallet' in the header. Your wallet will open to approve the connection. TWallet never holds your keys — every transaction is approved in your wallet." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled while still 'pending'. Once 'processing', contact support for help." },
  { q: "My transaction shows as failed. What now?", a: "Open a ticket under 'Transaction' and include the tx hash. Our team verifies on-chain and will credit or refund if the payment failed after submission." },
  { q: "Is my wallet a custodial account?", a: "No. TWallet is non-custodial — you keep custody of your funds and approve every transaction from your wallet." },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [state, formAction, pending] = useActionState(createTicket, undefined);

  const [activeThread, setActiveThread] = useState<Ticket | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replyPending, setReplyPending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await getMyTickets();
      if (res.error === null && res.data) {
        setTickets(res.data as Ticket[]);
      }
      setTicketsLoading(false);
    })();
  }, []);

  const lastSuccess = useRef<string | undefined>(undefined);
  useEffect(() => {
    const s = state?.success;
    if (s && s !== lastSuccess.current) {
      lastSuccess.current = s;
      toast.success("Ticket submitted", { description: s });
      setActiveTab("open");
      void (async () => {
        const res = await getMyTickets();
        if (res.error === null && res.data) {
          setTickets(res.data as Ticket[]);
        }
      })();
    }
  }, [state]);

  const applyRealtime = useCallback(
    (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new?: Record<string, unknown> | null;
      old?: Record<string, unknown> | null;
      id?: string;
    }) => {
      const row = payload.eventType === "DELETE" ? payload.old : payload.new;
      if (!row?.id) return;
      const item: Ticket = {
        id: String(row.id),
        ticket_number: String(row.ticket_number ?? ""),
        subject: String(row.subject ?? ""),
        category: String(row.category ?? "other"),
        priority: String(row.priority ?? "medium"),
        status: String(row.status ?? "open") as Status,
        created_at: String(row.created_at),
        updated_at: (row.updated_at as string | null) ?? null,
      };
      setTickets((prev) => {
        if (payload.eventType === "DELETE") {
          return prev.filter((t) => t.id !== item.id);
        }
        const exists = prev.some((t) => t.id === item.id);
        const next = exists
          ? prev.map((t) => (t.id === item.id ? item : t))
          : [item, ...prev];
        return next.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      });
    },
    [],
  );

  const applyRealtimeRef = useRef(applyRealtime);
  applyRealtimeRef.current = applyRealtime;

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel(`support-live-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "support_tickets",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: unknown) => {
            applyRealtimeRef.current?.(
              payload as Parameters<typeof applyRealtime>[0],
            );
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const openThread = useCallback(async (ticket: Ticket) => {
    setActiveThread(ticket);
    setThreadLoading(true);
    setMessages([]);
    setReplyError(null);
    const res = await getCustomerTicketMessages(ticket.id);
    if (res.error === null && res.messages) {
      setMessages(res.messages as TicketMessage[]);
    }
    setThreadLoading(false);
  }, []);

  const closeThread = useCallback(() => {
    setActiveThread(null);
    setMessages([]);
    setReplyText("");
    setReplyError(null);
  }, []);

  const activeThreadRef = useRef<Ticket | null>(null);
  activeThreadRef.current = activeThread;

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel(`support-thread-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ticket_messages",
          },
          (payload: unknown) => {
            const p = payload as { new?: Record<string, unknown> | null };
            const row = p.new;
            if (!row?.ticket_id || !row?.author || row.author === "customer") return;
            if (row.ticket_id !== activeThreadRef.current?.id) return;
            if (row.internal === true) return;
            const item: TicketMessage = {
              id: String(row.id),
              ticket_id: String(row.ticket_id),
              author: String(row.author) as TicketMessage["author"],
              message: String(row.message),
              internal: Boolean(row.internal),
              created_at: String(row.created_at),
            };
            setMessages((prev) => {
              if (prev.some((m) => m.id === item.id)) return prev;
              return [...prev, item];
            });
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const handleReply = async () => {
    const text = replyText.trim();
    if (!text || !activeThread) return;
    setReplyPending(true);
    setReplyError(null);
    const res = await replyToTicket(activeThread.id, text);
    setReplyPending(false);
    if (res.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          ticket_id: activeThread.id,
          author: "customer",
          message: text,
          internal: false,
          created_at: new Date().toISOString(),
        },
      ]);
      setReplyText("");
    } else {
      setReplyError(res.error ?? "Could not send reply");
    }
  };

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "pending");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  const renderTicketCard = (t: Ticket) => {
    const cat = CATEGORY_META[t.category] ?? CATEGORY_META.other!;
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
            <Badge variant={PRIORITY_VARIANT[t.priority] ?? "outline"}>{t.priority}</Badge>
            <Badge variant={STATUS_VARIANT[t.status] ?? "outline"}>{t.status}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => void openThread(t)}
          >
            <ChevronRight className="h-4 w-4 mr-1" aria-hidden="true" /> View Conversation
          </Button>
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
                      {CATEGORY_ORDER.map((k) => <option key={k} value={k}>{CATEGORY_META[k]?.label ?? k}</option>)}
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

      <Dialog open={!!activeThread} onOpenChange={(open) => !open && closeThread()}>
        {activeThread && (
          <div>
            <DialogHeader
              title={`${activeThread.ticket_number} — ${activeThread.subject}`}
              description={`${CATEGORY_META[activeThread.category]?.label ?? activeThread.category} · ${activeThread.priority} priority · ${activeThread.status}`}
              onClose={closeThread}
            />

            <div className="max-h-[45vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {threadLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading conversation...
                </div>
              ) : messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No messages yet.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.author === "customer"
                        ? "ml-auto bg-brand-600 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.message}</p>
                    <p className={`mt-1 text-[10px] ${m.author === "customer" ? "text-brand-100" : "text-slate-400"}`}>
                      {m.author === "customer" ? "You" : "Support"} ·{" "}
                      {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2">
              {replyError && (
                <div className="rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">{replyError}</div>
              )}
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a follow-up message..."
                rows={3}
                maxLength={5000}
                aria-label="Reply message"
              />
              <div className="flex justify-end">
                <Button onClick={handleReply} loading={replyPending} disabled={!replyText.trim()}>
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
