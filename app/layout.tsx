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
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://*.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://*.walletconnect.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://*.supabase.co" />
        <link rel="dns-prefetch" href="https://*.walletconnect.com" />
      </head>
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
