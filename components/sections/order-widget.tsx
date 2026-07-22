"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderWidget() {
  const [tab, setTab] = useState<"physical" | "virtual">("virtual");
  const [network, setNetwork] = useState("Ethereum");

  return (
    <div className="rounded-xl border border-white/10 bg-surface-900/80 backdrop-blur-xl p-4 w-full max-w-sm shadow-xl">
      <div className="flex rounded-lg bg-white/5 p-0.5 mb-4">
        <button
          onClick={() => setTab("virtual")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === "virtual"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Virtual Card
        </button>
        <button
          onClick={() => setTab("physical")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === "physical"
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Physical Card
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-surface-400 mb-1 block">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none"
          >
            <option value="Ethereum">Ethereum</option>
            <option value="BNB">BNB Chain</option>
            <option value="Polygon">Polygon</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="Base">Base</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-surface-400 mb-1 block">Quantity</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>5</option>
              <option>10</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-surface-400 mb-1 block">Country</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none appearance-none">
              <option>United States</option>
              <option>United Kingdom</option>
              <option>EU</option>
              <option>Canada</option>
              <option>Singapore</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-surface-400 mb-1 block">Price</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="text-base font-bold text-white">
              {tab === "physical" ? "$25" : "$5"}
            </span>
            <span className="text-[10px] text-surface-400 bg-white/5 px-1.5 py-0.5 rounded">USDT</span>
          </div>
        </div>

        <Button
          fullWidth
          size="sm"
          className="bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0 shadow-lg shadow-brand-500/25"
          asChild
        >
          <Link href="/auth/register">
            Connect Wallet
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>

        <p className="text-center text-[10px] text-surface-500">
          Secure · Non-custodial · 2 min setup
        </p>
      </div>
    </div>
  );
}
