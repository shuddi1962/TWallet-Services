"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Minus, Plus, Wallet, Check } from "lucide-react";

const networks = [
  { id: "ethereum", name: "Ethereum", color: "#627EEA", icon: "⟠" },
  { id: "bnb", name: "BNB Chain", color: "#F0B90B", icon: "◆" },
  { id: "polygon", name: "Polygon", color: "#8247E5", icon: "⬡" },
];

const cardTypes = [
  { id: "black", name: "Premium Black Card" },
  { id: "titanium", name: "Titanium Card" },
  { id: "gold", name: "Gold Card" },
];

const countries = [
  { code: "🇳🇬", name: "Nigeria" },
  { code: "🇺🇸", name: "United States" },
  { code: "🇬🇧", name: "United Kingdom" },
  { code: "🇪🇺", name: "European Union" },
  { code: "🇨🇦", name: "Canada" },
  { code: "🇸🇬", name: "Singapore" },
  { code: "🇦🇪", name: "UAE" },
];

const tokens = ["USDT", "USDC", "ETH", "BNB", "MATIC"];

type DropdownProps = {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: { id: string; name: string; icon?: string; color?: string }[];
  icon?: React.ReactNode;
};

function Dropdown({ label, value, onSelect, options, icon }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-white/45 text-xs font-medium mb-2">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 h-11 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-all"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          {selected?.icon && <span className="text-sm">{selected.icon}</span>}
          <span className="text-white text-sm font-medium">
            {selected?.name || value}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 rounded-xl bg-[#12141c] border border-white/10 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                <span className="flex-1">{opt.name}</span>
                {opt.id === value && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NetworkGrid({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div>
      <label className="block text-white/45 text-xs font-medium mb-2">Select Network</label>
      <div className="grid grid-cols-3 gap-2">
        {networks.map((net) => (
          <button
            key={net.id}
            onClick={() => onSelect(net.id)}
            className={`flex flex-col items-center gap-1.5 h-14 rounded-lg text-[10px] font-semibold transition-all border ${
              selected === net.id
                ? "bg-[#0066FF]/15 border-[#0066FF]/50 text-white"
                : "bg-white/5 border-white/8 text-white/50 hover:border-white/20"
            }`}
          >
            <span
              className="text-lg"
              style={selected === net.id ? { color: net.color } : undefined}
            >
              {net.icon}
            </span>
            <span className="leading-none">{net.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function OrderWidget() {
  const [activeTab, setActiveTab] = useState("Physical Card");
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [cardType, setCardType] = useState("black");
  const [country, setCountry] = useState("nigeria");
  const [quantity, setQuantity] = useState(1);
  const [token, setToken] = useState("USDT");

  const price = activeTab === "Physical Card" ? 50 : 5;
  const total = price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0c0e14] border border-white/[0.07] rounded-2xl p-5 lg:p-6 shadow-2xl shadow-black/50 w-full max-w-sm backdrop-blur-sm"
    >
      <div className="flex gap-6 border-b border-white/[0.06] mb-5">
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
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0066FF] to-[#3b82f6] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <Dropdown
        label="Select Card Type"
        value={cardType}
        onSelect={setCardType}
        options={cardTypes}
      />

      <div className="mt-4">
        <NetworkGrid selected={selectedNetwork} onSelect={setSelectedNetwork} />
      </div>

      <div className="mt-4">
        <label className="block text-white/45 text-xs font-medium mb-2">Quantity</label>
        <div className="flex items-center justify-between px-2 h-11 rounded-lg bg-white/5 border border-white/[0.06]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <motion.span
            key={quantity}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-sm font-semibold w-8 text-center"
          >
            {quantity}
          </motion.span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Dropdown
          label="Shipping Country"
          value={country}
          onSelect={setCountry}
          options={countries.map((c) => ({ id: c.name.toLowerCase(), name: c.name, icon: c.code }))}
        />
      </div>

      <div className="flex items-center justify-between py-4 my-5 border-t border-b border-white/[0.06]">
        <div>
          <div className="text-white/45 text-xs font-medium">You Will Pay</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <motion.span
              key={total}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-xl font-bold"
            >
              {total}
            </motion.span>
            <span className="text-white/40 text-xs font-medium">USDT</span>
          </div>
        </div>
        <Dropdown
          label=""
          value={token}
          onSelect={setToken}
          options={tokens.map((t) => ({ id: t, name: t }))}
        />
      </div>

      <button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0044aa] transition-all text-white font-semibold text-sm shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/40 flex items-center justify-center gap-2.5">
        <Wallet className="w-4 h-4" strokeWidth={2} />
        Connect Wallet to Continue
      </button>
    </motion.div>
  );
}
