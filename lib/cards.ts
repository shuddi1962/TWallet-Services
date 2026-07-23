export type CardFinish = "sapphire" | "obsidian" | "cyber" | "gold" | "holographic";

export interface CardConfig {
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  finish: CardFinish;
  isVirtual: boolean;
  pin: string;
  contactlessEnabled: boolean;
  limitDaily: number;
}

export interface PerkItem {
  icon: string;
  title: string;
  description: string;
  value: string;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  shippingAddress: string;
  city: string;
  country: string;
  cardTier: "virtual" | "physical" | "metal";
  agreedToTerms: boolean;
}

export interface CardFinishVisual {
  label: string;
  tagline: string;
  gradient: string;
  chipColor: string;
  accent: string;
  borderGlow: string;
  chipBorder: string;
  textColor?: string;
  bgPattern: string;
  logoColor: string;
}

export const cardFinishes: Record<CardFinish, CardFinishVisual> = {
  sapphire: {
    label: "Sapphire",
    tagline: "Deep Blue Elegance",
    gradient: "from-[#0c1833] via-[#162a6b] to-[#0c1833]",
    chipColor: "from-amber-300 to-amber-500",
    accent: "from-blue-400 to-blue-600",
    borderGlow: "rgba(59,130,246,0.5)",
    textColor: "text-white",
    chipBorder: "border-amber-400/40",
    bgPattern:
      "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(37,99,235,0.06) 0%, transparent 50%)",
    logoColor: "#3b82f6",
  },
  obsidian: {
    label: "Obsidian",
    tagline: "Stealth Black Power",
    gradient: "from-[#050505] via-[#141414] to-[#050505]",
    chipColor: "from-gray-400 to-gray-600",
    accent: "from-gray-400 to-gray-600",
    borderGlow: "rgba(148,163,184,0.3)",
    textColor: "text-white",
    chipBorder: "border-gray-500/30",
    bgPattern:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
    logoColor: "#94a3b8",
  },
  cyber: {
    label: "Cyber",
    tagline: "Neon Future Edge",
    gradient: "from-[#070714] via-[#140a2e] to-[#070714]",
    chipColor: "from-cyan-300 to-cyan-500",
    accent: "from-cyan-400 to-purple-500",
    borderGlow: "rgba(6,182,212,0.5)",
    textColor: "text-white",
    chipBorder: "border-cyan-400/40",
    bgPattern:
      "radial-gradient(circle at 30% 40%, rgba(6,182,212,0.06) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(168,85,247,0.06) 0%, transparent 40%)",
    logoColor: "#06b6d4",
  },
  gold: {
    label: "Gold",
    tagline: "Timeless Prestige",
    gradient: "from-[#1a1200] via-[#3a2a00] to-[#1a1200]",
    chipColor: "from-yellow-200 to-amber-500",
    accent: "from-amber-400 to-yellow-600",
    borderGlow: "rgba(245,158,11,0.5)",
    textColor: "text-white",
    chipBorder: "border-amber-400/40",
    bgPattern:
      "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(245,158,11,0.03) 20px, rgba(245,158,11,0.03) 40px)",
    logoColor: "#f59e0b",
  },
  holographic: {
    label: "Holographic",
    tagline: "Iridescent Vision",
    gradient: "from-[#08081a] via-[#180a2e] to-[#081a2e]",
    chipColor: "from-pink-300 via-purple-300 to-cyan-300",
    accent: "from-pink-400 via-purple-400 to-cyan-400",
    borderGlow: "rgba(168,85,247,0.5)",
    textColor: "text-white",
    chipBorder: "border-purple-400/40",
    bgPattern:
      "radial-gradient(circle at 25% 35%, rgba(236,72,153,0.06) 0%, transparent 35%), radial-gradient(circle at 75% 65%, rgba(168,85,247,0.06) 0%, transparent 35%)",
    logoColor: "#a855f7",
  },
};

export const cardOrder: CardFinish[] = [
  "sapphire",
  "obsidian",
  "cyber",
  "gold",
  "holographic",
];

export const sampleCards: Record<CardFinish, CardConfig> = {
  sapphire: {
    holderName: "ALEX JOHNSON",
    cardNumber: "4532015112893647",
    expiryDate: "06/28",
    cvc: "123",
    finish: "sapphire",
    isVirtual: false,
    pin: "4567",
    contactlessEnabled: true,
    limitDaily: 10000,
  },
  obsidian: {
    holderName: "ALEX JOHNSON",
    cardNumber: "5424180123456789",
    expiryDate: "09/27",
    cvc: "456",
    finish: "obsidian",
    isVirtual: false,
    pin: "7890",
    contactlessEnabled: true,
    limitDaily: 25000,
  },
  cyber: {
    holderName: "ALEX JOHNSON",
    cardNumber: "4916123456789012",
    expiryDate: "12/28",
    cvc: "789",
    finish: "cyber",
    isVirtual: true,
    pin: "2345",
    contactlessEnabled: true,
    limitDaily: 15000,
  },
  gold: {
    holderName: "ALEX JOHNSON",
    cardNumber: "4532015187654321",
    expiryDate: "03/29",
    cvc: "321",
    finish: "gold",
    isVirtual: false,
    pin: "6789",
    contactlessEnabled: true,
    limitDaily: 50000,
  },
  holographic: {
    holderName: "ALEX JOHNSON",
    cardNumber: "6011123456789012",
    expiryDate: "08/28",
    cvc: "654",
    finish: "holographic",
    isVirtual: true,
    pin: "1234",
    contactlessEnabled: true,
    limitDaily: 20000,
  },
};
