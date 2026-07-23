"use client";

import { Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Avatar } from "@/components/ui/avatar";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const testimonials = [
  { name: "Alex Thompson", role: "Crypto Trader", avatar: "AT", rating: 5, content: "Finally a card that doesn't ask for my seed phrase. Connected my MetaMask, paid in USDC on Polygon, and had my virtual card in under 5 minutes. This is how crypto spending should work." },
  { name: "Sarah Chen", role: "DeFi Developer", avatar: "SC", rating: 5, content: "The non-custodial approach is exactly what the space needs. I verified the on-chain payment myself before the platform even confirmed it. Full transparency, zero trust required." },
  { name: "Marcus Johnson", role: "NFT Collector", avatar: "MJ", rating: 5, content: "Got the physical card shipped to me in 4 days. Used it at a coffee shop on day one. The fact that I funded it with ETH on Base and it just works is mind-blowing." },
];

export function Testimonials() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 via-white to-brand-50/20 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">
              Loved by crypto natives
            </h2>
            <p className="mt-4 text-surface-500">
              Join thousands of users spending their crypto with TWALLET.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="group relative rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-surface-600 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar fallback={testimonial.avatar} className="ring-2 ring-brand-500/20" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{testimonial.name}</p>
                    <p className="text-xs text-surface-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
