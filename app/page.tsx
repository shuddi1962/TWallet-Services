import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Features } from "@/components/sections/features";
import { Benefits } from "@/components/sections/benefits";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CardShowcase } from "@/components/sections/card-showcase";
import { Wallets } from "@/components/sections/wallets";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Trust",
  url: "https://twalletservices.com",
  logo: "https://twalletservices.com/favicon.ico",
  description: "Non-custodial, crypto-funded card platform. Order virtual and physical cards funded with crypto.",
  knowsAbout: ["Crypto Cards", "Crypto Payments", "Non-Custodial Wallet", "Blockchain Payments"],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    offerCount: "3",
    offers: [
      { "@type": "Offer", name: "Sapphire", price: "5", priceCurrency: "USD", description: "Virtual card, issued instantly" },
      { "@type": "Offer", name: "Obsidian", price: "10", priceCurrency: "USD", description: "Metal card, ships worldwide" },
      { "@type": "Offer", name: "Cyber", price: "15", priceCurrency: "USD", description: "Virtual premium card" },
      { "@type": "Offer", name: "Gold", price: "25", priceCurrency: "USD", description: "Premium metal card" },
      { "@type": "Offer", name: "Holographic", price: "50", priceCurrency: "USD", description: "Limited edition metal card" },
    ],
  },
};

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <CardShowcase />
        <Benefits />
        <DashboardPreview />
        <HowItWorks />
        <Wallets />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
