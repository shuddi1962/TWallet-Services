"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Wallet, CreditCard, ShoppingBag, TrendingUp, Plus, Activity, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { TwalletCard } from "@/components/cards/twallet-card";
import { ShippingCard } from "@/components/dashboard/shipping-card";
import { cn } from "@/lib/utils/cn";

const recentOrders = [
  { id: "1", order_number: "TW-MSAFWLMJ-48YP", name: "Midnight Black", amount: 5.0, status: "delivered", time: "Today", tracking_number: "TWLX4829137751", carrier: "DHL" },
  { id: "2", order_number: "TW-MS5PZIRN-KB15", name: "Titanium", amount: 10.0, status: "delivered", time: "Yesterday", tracking_number: null, carrier: null },
  { id: "3", order_number: "TW-K7D2XQZN-91AH", name: "Sapphire", amount: 5, status: "paid", time: "Jul 28", tracking_number: null, carrier: null },
  { id: "4", order_number: "TW-RM4PVDLZ-62CK", name: "Gold", amount: 25, status: "processing", time: "Jul 26", tracking_number: null, carrier: null },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-sky-50 text-sky-700 ring-sky-200",
  processing: "bg-violet-50 text-violet-700 ring-violet-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  refunded: "bg-slate-100 text-slate-600 ring-slate-200",
};

function PremiumStat({
  label,
  value,
  icon: Icon,
  change,
}: {
  label: string;
  value: string;
  icon: typeof CreditCard;
  change?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-black/5 opacity-20 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 ring-1 ring-neutral-200">
          <Icon className="h-5 w-5 text-black" />
        </div>
        {change && <span className="text-xs font-semibold text-emerald-600">{change}</span>}
      </div>
      <p className="relative mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="relative mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function DashboardPreview() {
  const featuredOrder = recentOrders[0] ?? recentOrders[1] ?? { id: "0", order_number: "TW-XXXX-0000", name: "Card", amount: 0, status: "pending", time: "", tracking_number: null, carrier: null };

  return (
    <section id="dashboard" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-brand-50/30" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs">
            <LayoutDashboard className="h-3.5 w-3.5 text-brand-600" />
            <span className="font-medium text-brand-700">Live Dashboard</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your control center
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Manage your cards, track orders, and monitor spending — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-brand-500/5"
        >
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h3 className="text-xl font-bold text-slate-900">Alex Johnson</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-slate-500">
                  <Activity className="h-4 w-4" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">AJ</div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <PremiumStat label="Active Cards" value="2" icon={CreditCard} change="+1" />
              <PremiumStat label="Total Orders" value="14" icon={ShoppingBag} change="+2" />
              <PremiumStat label="Wallets" value="3" icon={Wallet} />
              <PremiumStat label="Total Spent" value="$1,240" icon={TrendingUp} change="+$230" />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-3">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-neutral-900/10 blur-3xl" />
                  <div className="relative mb-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">My Card</h4>
                      <p className="text-sm text-slate-500">Your latest order status</p>
                    </div>
                    <Button size="sm" className="rounded-full" asChild>
                      <Link href="/dashboard/cards">
                        <Plus className="h-4 w-4" />
                        New card
                      </Link>
                    </Button>
                  </div>

                  <div className="relative grid gap-5 md:grid-cols-2">
                    <TwalletCard
                      finish="obsidian"
                      holderName="ALEX JOHNSON"
                      panDisplay="4532 •••• •••• 4281"
                      expiry="08/29"
                      network="visa"
                      isVirtual={false}
                      balanceLabel="$5.00"
                      className="max-w-none"
                    />

                    <div className="flex flex-col justify-center space-y-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Order number</p>
                        <p className="mt-1 font-mono text-sm text-slate-900">{featuredOrder.order_number}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Status</p>
                        <span
                          className={cn(
                            "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1",
                            STATUS_STYLE[featuredOrder.status] ?? STATUS_STYLE.pending,
                          )}
                        >
                          {featuredOrder.status}
                        </span>
                      </div>
                      <Button variant="outline" className="rounded-xl" asChild>
                        <Link href="/dashboard/cards">Manage card</Link>
                      </Button>
                      <Button variant="ghost" className="rounded-xl" asChild>
                        <Link href="/dashboard/orders">View order details</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ShippingCard
                      order={{
                        id: featuredOrder.id,
                        order_number: featuredOrder.order_number,
                        status: featuredOrder.status,
                        tracking_number: featuredOrder.tracking_number ?? null,
                        carrier: featuredOrder.carrier ?? null,
                      }}
                      trackingHref="/dashboard/orders"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-black" />
                      <h4 className="text-lg font-semibold text-slate-900">Recent Orders</h4>
                    </div>
                    <Link href="/dashboard/orders" className="text-sm text-black hover:text-neutral-700">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {order.name} — ${Number(order.amount).toFixed(2)}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-slate-500">{order.order_number}</p>
                        </div>
                        <span
                          className={cn(
                            "ml-3 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1",
                            STATUS_STYLE[order.status] ?? STATUS_STYLE.pending,
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 text-lg font-semibold text-slate-900">Trust Wallet</h4>
                  <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                        <Wallet className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Trust Wallet</p>
                        <p className="font-mono text-xs text-slate-500">0x7a9...f3e2</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Connected to Ethereum
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-1 text-xs text-slate-500">Available Balance</p>
                      <p className="text-lg font-bold text-slate-900">2.45 ETH</p>
                      <p className="text-xs text-slate-500">$8,240.00</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-xs text-slate-500">Gas Price</p>
                        <span className="text-xs text-slate-500">12 Gwei</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full w-3/5 rounded-full bg-black" />
                      </div>
                    </div>
                  </div>
                  <Button fullWidth className="mt-4 rounded-full" asChild>
                    <Link href="/dashboard/cards?order=1">
                      Order Another Card
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black">
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Real-time tracking</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Payments verified on-chain in minutes with live status updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
