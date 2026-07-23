import type { Metadata } from "next";
import "@/styles/globals.css";
import { WalletProviders } from "@/components/wallet-providers";

export const metadata: Metadata = {
  title: {
    default: "TWALLET — Non-Custodial Crypto Card",
    template: "%s | TWALLET",
  },
  description:
    "Order a crypto-funded card. Non-custodial — you keep control of your keys.",
  openGraph: {
    title: "TWALLET",
    description: "Your crypto, your card. Non-custodial.",
    siteName: "TWALLET",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
