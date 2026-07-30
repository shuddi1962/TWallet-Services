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
      { "@type": "Offer", name: "Midnight Black", price: "0", priceCurrency: "USD", description: "Classic black metal card" },
      { "@type": "Offer", name: "Titanium", price: "29", priceCurrency: "USD", description: "Premium titanium card" },
      { "@type": "Offer", name: "Gold", price: "99", priceCurrency: "USD", description: "Exclusive gold card" },
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
