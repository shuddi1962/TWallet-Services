"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bell, Wallet, CreditCard, ArrowUpRight, ArrowDownRight, CircleCheck, Package, TrendingUp, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { name: "Amazon.com", amount: "$84.50", type: "payment", date: "Today, 2:34 PM", status: "completed" },
  { name: "Spotify Premium", amount: "$9.99", type: "payment", date: "Yesterday", status: "completed" },
  { name: "Top-up", amount: "+$500.00", type: "deposit", date: "Jul 20, 2026", status: "completed" },
  { name: "Uber Ride", amount: "$23.40", type: "payment", date: "Jul 19, 2026", status: "completed" },
];

const timeline = [
  { title: "Order Placed", time: "Jul 18, 2026", done: true },
  { title: "Payment Verified", time: "Jul 18, 2026", done: true },
  { title: "Card Issued", time: "Jul 19, 2026", done: true },
  { title: "Shipped", time: "Expected Jul 25", done: false },
  { title: "Delivered", time: "—", done: false },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-brand-950/20 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
            <LayoutDashboard className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-brand-300">Dashboard Preview</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your control center
          </h2>
          <p className="mt-4 text-lg text-surface-400">
            Manage your cards, track orders, and monitor spending — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-white/10 bg-surface-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-brand-500/5"
        >
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-surface-400">Welcome back</p>
                <h3 className="text-xl font-bold text-white">Alex Johnson</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-surface-400 hover:text-white hover:bg-white/10 transition-all">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-error" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
                  AJ
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
              {[
                { label: "Balance", value: "$12,840", icon: Wallet, change: "+$840" },
                { label: "Orders", value: "3", icon: Package, change: "+1" },
                { label: "Cards", value: "2", icon: CreditCard, change: "" },
                { label: "Spent", value: "$1,240", icon: TrendingUp, change: "+$230" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-surface-500">{stat.label}</span>
                    <stat.icon className="h-3.5 w-3.5 text-surface-500" />
                  </div>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-success mt-0.5">{stat.change}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white">Your Card</h4>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">Active</Badge>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-[1px] shadow-lg shadow-brand-600/20">
                    <div className="rounded-xl bg-gradient-to-br from-surface-900 to-dark p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-white/60">TWallet Services</span>
                        <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none">
                          <rect x="0.5" y="0.5" width="23" height="15" rx="2.5" fill="#00579F" />
                        </svg>
                      </div>
                      <p className="font-mono text-sm tracking-[0.2em] text-white/80">
                        •••• •••• •••• 4582
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[10px] text-white/40">Exp. 06/28</p>
                        <p className="text-[10px] text-white/40">Y. NAME</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
                    <CircleCheck className="h-3.5 w-3.5 text-success" />
                    <span>Connected to MetaMask</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
                  <h4 className="text-sm font-semibold text-white mb-4">Order Tracking</h4>
                  <div className="space-y-0">
                    {timeline.map((step, i) => (
                      <div key={step.title} className="flex items-start gap-3 pb-4 relative">
                        {i < timeline.length - 1 && (
                          <div className={`absolute left-[7px] top-4 h-full w-px ${step.done ? "bg-brand-500/30" : "bg-white/5"}`} />
                        )}
                        <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full mt-1 ${step.done ? "bg-brand-500" : "bg-white/10"}`}>
                          {step.done && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm ${step.done ? "text-white" : "text-surface-500"}`}>{step.title}</p>
                          <p className="text-xs text-surface-600">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white">Recent Transactions</h4>
                    <Link href="/dashboard/transactions" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={`${tx.name}-${tx.date}`} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tx.type === "deposit" ? "bg-success/10" : "bg-white/5"}`}>
                            {tx.type === "deposit" ? (
                              <ArrowDownRight className="h-4 w-4 text-success" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-surface-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{tx.name}</p>
                            <p className="text-xs text-surface-500">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${tx.type === "deposit" ? "text-success" : "text-white"}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5 flex flex-col">
                <h4 className="text-sm font-semibold text-white mb-4">Wallet Connection</h4>
                <div className="rounded-xl bg-white/5 p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20">
                      <Wallet className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">MetaMask</p>
                      <p className="text-xs text-surface-500 font-mono">0x7a9...f3e2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-success">
                    <CircleCheck className="h-3.5 w-3.5" />
                    <span>Connected to Ethereum</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-surface-500 mb-1">Available Balance</p>
                    <p className="text-lg font-bold text-white">2.45 ETH</p>
                    <p className="text-xs text-surface-500">$8,240.00</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-surface-500">Gas Price</p>
                      <span className="text-xs text-surface-400">12 Gwei</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-brand-500 to-brand-400" />
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="sm"
                  className="mt-4 bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0 shadow-lg shadow-brand-500/20"
                  asChild
                >
                  <Link href="/dashboard/cards">
                    Order Another Card
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
