import type { CardConfig, CardFinish } from "@/lib/cards";

const styles: Record<
  CardFinish,
  {
    bodyGradient: string;
    borderColor: string;
    issuerColor: string;
    badgeText: string;
    network: "visa" | "mastercard";
    visaColor?: string;
  }
> = {
  sapphire: {
    bodyGradient: "linear-gradient(135deg, #0a1628 0%, #132552 40%, #1a3066 70%, #0f1f3d 100%)",
    borderColor: "#3b82f6",
    issuerColor: "#60a5fa",
    badgeText: "SAPPHIRE",
    network: "visa",
  },
  obsidian: {
    bodyGradient: "linear-gradient(135deg, #070707 0%, #1a1a1a 40%, #222222 70%, #0d0d0d 100%)",
    borderColor: "#64748b",
    issuerColor: "#94a3b8",
    badgeText: "OBSIDIAN",
    network: "mastercard",
  },
  cyber: {
    bodyGradient: "linear-gradient(135deg, #06061a 0%, #0f0930 40%, #1a0a3a 70%, #08081a 100%)",
    borderColor: "#06b6d4",
    issuerColor: "#22d3ee",
    badgeText: "CYBER",
    network: "mastercard",
  },
  gold: {
    bodyGradient: "linear-gradient(135deg, #1a1200 0%, #2d2208 40%, #3a2a00 70%, #1a1200 100%)",
    borderColor: "#f59e0b",
    issuerColor: "#fbbf24",
    badgeText: "GOLD",
    network: "visa",
    visaColor: "#f59e0b",
  },
  holographic: {
    bodyGradient: "linear-gradient(135deg, #08081a 0%, #1a0a2e 30%, #081a2e 60%, #0a0a1a 100%)",
    borderColor: "#a855f7",
    issuerColor: "#c084fc",
    badgeText: "HOLOGRAPHIC",
    network: "visa",
  },
};

function formatCardNumber(num: string) {
  const g = num.match(/.{1,4}/g);
  return g ? g.join(" ") : num;
}

function cardGlow(f: CardFinish) {
  const map: Record<CardFinish, string> = {
    sapphire: "#3b82f6",
    obsidian: "#64748b",
    cyber: "#06b6d4",
    gold: "#f59e0b",
    holographic: "#a855f7",
  };
  return map[f];
}

export function RealCard({ card }: { card: CardConfig }) {
  const s = styles[card.finish];
  const glow = cardGlow(card.finish);

  return (
    <svg viewBox="0 0 320 202" className="w-full h-full drop-shadow-2xl" fill="none">
      <defs>
        <linearGradient id={`bg-${card.finish}`} x1="0" y1="0" x2="320" y2="202" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a1628" />
          <stop offset="1" stopColor="#0f1f3d" />
        </linearGradient>
        <linearGradient id="chipGold" x1="0" y1="0" x2="28" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd34d" />
          <stop offset="0.3" stopColor="#fbbf24" />
          <stop offset="0.7" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <filter id="chipShadow">
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.3" />
        </filter>
        <radialGradient id="holoGlow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#e879f9" offset="0%" />
          <stop stopColor="#22d3ee" offset="50%" />
          <stop stopColor="#c084fc" offset="100%" />
        </radialGradient>
        <pattern id="grid" width="55" height="50" patternUnits="userSpaceOnUse">
          <rect width="55" height="50" fill="none" />
          <rect x="0" y="0" width="0.5" height="50" fill="white" opacity="0.04" />
          <rect x="0" y="0" width="55" height="0.5" fill="white" opacity="0.04" />
        </pattern>
      </defs>

      <rect x="1" y="1" width="318" height="200" rx="12" fill={`url(#bg-${card.finish})`} stroke={s.borderColor} strokeWidth="1.5" strokeOpacity="0.4" />
      <rect x="1" y="1" width="318" height="200" rx="12" fill="none" stroke={glow} strokeWidth="2" strokeOpacity="0.12" />

      {card.finish === "obsidian" && <rect x="0" y="0" width="320" height="202" rx="12" fill="url(#grid)" />}

      {card.finish === "cyber" && (
        <g opacity="0.06">
          <rect x="40" y="30" width="80" height="1" fill="#06b6d4" transform="rotate(35 40 30)" />
          <rect x="120" y="60" width="100" height="1" fill="#a855f7" transform="rotate(-20 120 60)" />
          <rect x="30" y="100" width="120" height="1" fill="#06b6d4" transform="rotate(15 30 100)" />
          <rect x="200" y="120" width="60" height="1" fill="#c084fc" transform="rotate(-30 200 120)" />
        </g>
      )}

      {card.finish === "gold" && (
        <g opacity="0.05">
          <line x1="0" y1="30" x2="320" y2="30" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="8 6" />
          <line x1="0" y1="170" x2="320" y2="170" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="8 6" />
        </g>
      )}

      {card.finish === "holographic" && (
        <circle cx="160" cy="100" r="140" fill="url(#holoGlow)" opacity="0.08" />
      )}

      {card.finish === "sapphire" && (
        <>
          <circle cx="280" cy="-20" r="120" fill="#3b82f6" opacity="0.06" />
          <circle cx="60" cy="180" r="100" fill="#60a5fa" opacity="0.04" />
        </>
      )}

      <text x="18" y="26" fontFamily="Arial, Helvetica, sans-serif" fontSize="7" fontWeight="700" fill={s.issuerColor} opacity="0.9" letterSpacing="1.5">TWALLET</text>

      <g transform="translate(18, 36)" filter="url(#chipShadow)">
        <rect x="0" y="0" width="28" height="22" rx="2.5" fill="url(#chipGold)" stroke="#a0680a" strokeWidth="0.5" />
        <rect x="2" y="2" width="24" height="18" rx="1.5" fill="none" stroke="#b8860b" strokeWidth="0.2" opacity="0.35" />
        <rect x="10" y="0" width="8" height="22" fill="none" stroke="#b8860b" strokeWidth="0.2" opacity="0.25" />
        <rect x="0" y="9" width="28" height="4" fill="none" stroke="#b8860b" strokeWidth="0.2" opacity="0.25" />
        <rect x="11" y="7" width="6" height="8" rx="0.5" fill="#b8860b" opacity="0.12" />
        <circle cx="14" cy="11" r="1.5" fill="none" stroke="#b8860b" strokeWidth="0.25" opacity="0.2" />
      </g>

      <text x="144" y="100" fontFamily="'Courier New', Courier, monospace" fontSize="14" fill="white" fillOpacity="0.88" letterSpacing="3.5" textAnchor="middle">
        {formatCardNumber(card.cardNumber)}
      </text>

      <text x="18" y="130" fontFamily="Arial, Helvetica, sans-serif" fontSize="5.5" fill="white" fillOpacity="0.3" letterSpacing="1.2">CARDHOLDER</text>
      <text x="18" y="145" fontFamily="Arial, Helvetica, sans-serif" fontSize="8" fill="white" fillOpacity="0.75" fontWeight="600" letterSpacing="1.2">
        {card.holderName}
      </text>

      <text x="155" y="130" fontFamily="Arial, Helvetica, sans-serif" fontSize="5.5" fill="white" fillOpacity="0.3" letterSpacing="1.2">EXPIRES</text>
      <text x="155" y="145" fontFamily="Arial, Helvetica, sans-serif" fontSize="8" fill="white" fillOpacity="0.75" fontWeight="600" letterSpacing="1.2">
        {card.expiryDate}
      </text>

      {card.contactlessEnabled && (
        <g transform="translate(18, 160)" opacity="0.35">
          <path d="M6 0C3 0 0 3 0 6s3 6 6 6" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M6 2C4 2 2.5 3.5 2.5 6s1.5 4 3.5 4" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M6 3.5C5 3.5 4.2 4.5 4.2 6s0.8 2.5 1.8 2.5" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <circle cx="6" cy="6" r="0.7" fill="white" />
        </g>
      )}

      <text x="18" y="177" fontFamily="Arial, Helvetica, sans-serif" fontSize="4.5" fill="white" fillOpacity="0.12" letterSpacing="1.5">{s.badgeText}</text>
      <text x="50" y="177" fontFamily="Arial, Helvetica, sans-serif" fontSize="4.5" fill="white" fillOpacity="0.12" letterSpacing="1">
        {card.isVirtual ? "VIRTUAL" : "PHYSICAL"}
      </text>

      <rect x="256" y="152" width="46" height="14" rx="2" fill="white" />
      <text x="279" y="161.5" fontFamily="Arial, Helvetica, sans-serif" fontSize="8" fontWeight="900" fill={s.network === "visa" ? s.visaColor || "#1a1f71" : "#000000"} textAnchor="middle" letterSpacing="0.3">
        {s.network === "visa" ? "VISA" : "MC"}
      </text>
    </svg>
  );
}
