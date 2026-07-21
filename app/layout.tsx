import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: {
    default: "TWallet Card — Non-Custodial Crypto Card",
    template: "%s | TWallet Card",
  },
  description:
    "Order a physical or virtual card funded by your crypto. Non-custodial — you keep control of your keys.",
  openGraph: {
    title: "TWallet Card",
    description: "Your crypto, your card. Non-custodial card platform.",
    siteName: "TWallet Services",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
