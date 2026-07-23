"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus, Wallet } from "lucide-react";

const networks = ["Ethereum", "BNB Chain", "Polygon"];

export function OrderWidget() {
  const [activeTab, setActiveTab] = useState("Physical Card");
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-[#0c0e14] border border-white/8 rounded-2xl p-5 lg:p-6 shadow-2xl shadow-black/40 w-full max-w-sm">
      <div className="flex gap-6 border-b border-white/8 mb-5">
        {["Physical Card", "Virtual Card"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-white" : "text-white/45 hover:text-white/70"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-white/45 text-xs font-medium mb-2">Select Card Type</label>
        <div className="flex items-center justify-between px-4 h-11 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-colors cursor-pointer">
          <span className="text-white text-sm font-medium">Premium Black Card</span>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-white/45 text-xs font-medium mb-2">Select Network</label>
        <div className="grid grid-cols-3 gap-2">
          {networks.map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net)}
              className={`h-10 rounded-lg text-xs font-semibold transition-all border ${
                selectedNetwork === net
                  ? "bg-[#0066FF]/15 border-[#0066FF]/50 text-white"
                  : "bg-white/5 border-white/8 text-white/50 hover:border-white/20"
              }`}
            >
              {net}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-white/45 text-xs font-medium mb-2">Quantity</label>
        <div className="flex items-center justify-between px-2 h-11 rounded-lg bg-white/5 border border-white/8">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-white text-sm font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-white/45 text-xs font-medium mb-2">Shipping Country</label>
        <div className="flex items-center justify-between px-4 h-11 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-none">🇳🇬</span>
            <span className="text-white text-sm font-medium">Nigeria</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </div>
      </div>

      <div className="flex items-center justify-between py-4 mb-5 border-t border-b border-white/8">
        <div>
          <div className="text-white/45 text-xs font-medium">You Will Pay</div>
          <div className="text-white text-xl font-bold mt-0.5">50 USDT</div>
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/5 border border-white/8 cursor-pointer hover:border-white/15 transition-colors">
          <span className="text-white text-xs font-semibold">USDT</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </div>
      </div>

      <button className="w-full h-12 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] transition-all text-white font-semibold text-sm shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/40 flex items-center justify-center gap-2.5">
        <Wallet className="w-4.5 h-4.5" strokeWidth={2} />
        Connect Wallet to Continue
      </button>
    </div>
  );
}
