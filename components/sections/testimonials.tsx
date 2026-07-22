"use client";

import { motion } from "framer-motion";
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
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-accent-950/10 to-surface-950 pointer-events-none" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Loved by crypto natives
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Join thousands of users spending their crypto with TW·CARD.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="group relative rounded-xl border border-white/5 bg-surface-900/50 p-6 transition-all hover:border-white/10 hover:bg-surface-900">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-surface-300">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar fallback={testimonial.avatar} className="ring-2 ring-brand-500/20" />
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
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
