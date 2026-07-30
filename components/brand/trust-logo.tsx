import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
};

const sizes = {
  sm: { box: "h-8 w-8", icon: 16, text: "text-base" },
  md: { box: "h-10 w-10", icon: 20, text: "text-lg" },
  lg: { box: "h-12 w-12", icon: 24, text: "text-xl" },
};

export function TrustMark({
  className,
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 3L5 7.5v8.2c0 7.1 4.6 11.8 11 13.3 6.4-1.5 11-6.2 11-13.3V7.5L16 3z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M11.2 16.1l3 3 6.6-6.6"
        stroke="#0b1220"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustLogo({
  className,
  markClassName,
  textClassName,
  showWordmark = true,
  size = "md",
  variant = "light",
}: Props) {
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-surface-900";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 text-white shadow-lg shadow-brand-600/30",
          s.box,
          markClassName,
        )}
      >
        <TrustMark size={s.icon} />
      </span>
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", s.text, textColor, textClassName)}>
          Trust
        </span>
      )}
    </span>
  );
}
