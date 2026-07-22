import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { OrderWidget } from "@/components/sections/order-widget";
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

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="-mt-28 relative z-20 flex justify-center">
          <OrderWidget />
        </div>
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
