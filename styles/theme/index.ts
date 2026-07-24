export const colors = {
  brand: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#2563eb",
    600: "#1d4ed8",
    700: "#1e40af",
    800: "#1e3a5f",
    900: "#172554",
  },
  surface: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryLight: "#dbeafe",
  bg: "#f8fafc",
  border: "#e2e8f0",
  heading: "#0f172a",
  body: "#475569",
  muted: "#94a3b8",
  footer: "#020817",
  hero: "#020817",
  success: "#16a34a",
  warning: "#f59e0b",
  error: "#dc2626",
  info: "#0ea5e9",
} as const;

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const borderRadius = {
  sm: "8px",
  button: "14px",
  md: "8px",
  card: "20px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  modal: "24px",
  pill: "999px",
} as const;

export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 40px -4px rgba(0, 0, 0, 0.15)",
} as const;
