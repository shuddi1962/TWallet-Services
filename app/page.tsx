import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/sections/announcement-bar";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Features } from "@/components/sections/features";
import { CardShowcase } from "@/components/sections/card-showcase";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Networks } from "@/components/sections/networks";
import { Security } from "@/components/sections/security";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Newsletter } from "@/components/sections/newsletter";

export default function LandingPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <CardShowcase />
        <HowItWorks />
        <Networks />
        <Security />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
