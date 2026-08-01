"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Avatar } from "@/components/ui/avatar";
import { FadeIn } from "@/components/ui/motion-section";
import { cn } from "@/lib/utils/cn";

const testimonials = [
  { name: "Alex Thompson", role: "Crypto Trader", avatar: "AT", rating: 5, content: "Finally a card that doesn't ask for my seed phrase. Connected my Trust Wallet, paid in USDC on Polygon, and had my virtual card in under 5 minutes. This is how crypto spending should work." },
  { name: "Sarah Chen", role: "DeFi Developer", avatar: "SC", rating: 5, content: "The non-custodial approach is exactly what the space needs. I verified the on-chain payment myself before the platform even confirmed it. Full transparency, zero trust required." },
  { name: "Marcus Johnson", role: "NFT Collector", avatar: "MJ", rating: 4, content: "Got the physical card shipped to me in 4 days. Used it at a coffee shop on day one. The fact that I funded it with ETH on Base and it just works is mind-blowing." },
  { name: "Priya Sharma", role: "Freelance Designer", avatar: "PS", rating: 4, content: "I've been converting client payments in USDT straight to card spend. No bank accounts, no KYC nightmares, no waiting. Just a card that works where I need it." },
  { name: "David Okafor", role: "E-commerce Founder", avatar: "DO", rating: 5, content: "We pay our suppliers in crypto and pay our vendors with the TWALLET card. The order tracking and delivery updates are the best I've seen in this space." },
  { name: "Lena Müller", role: "Digital Nomad", avatar: "LM", rating: 3, content: "Delivery took a bit longer than expected, but the card itself has been flawless across 12 countries so far. Support responded fast when I asked about tracking." },
  { name: "Carlos Rivera", role: "Play-to-Earn Gamer", avatar: "CR", rating: 4, content: "Been cashing out my game earnings for months. The 3% cashback on the premium card pays for itself, and the dashboard makes it easy to see everything." },
  { name: "Aisha Bello", role: "Remittance User", avatar: "AB", rating: 4, content: "Sending money home was expensive before. Now I fund with USDC on Arbitrum and my family uses the card locally. Transaction fees are a fraction of what I paid before." },
  { name: "Tom Becker", role: "SaaS Founder", avatar: "TB", rating: 5, content: "We moved our business expenses to TWALLET. Real-time payment verification, clean audit trail, and the metal card feels premium. Our accountant loves the reports." },
  { name: "Nina Kowalski", role: "Crypto Investor", avatar: "NK", rating: 3, content: "Solid card overall. I'd love more virtual card designs, but the core experience — secure wallet connection and fast top-ups — has been very reliable." },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);

  const prev = useCallback(() => setIndex((i) => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);
  const next = useCallback(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/40 via-white to-brand-50/20" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="font-medium text-brand-700">Testimonials</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
              Loved by crypto natives
            </h2>
            <p className="mt-4 text-surface-500">
              Join thousands of users spending their crypto with TWALLET.
            </p>
          </div>
        </FadeIn>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="shrink-0 px-2"
                  style={{ width: `${100 / perView}%` }}
                >
                  <div className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5">
                    <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-surface-200 text-surface-200",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-surface-600">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <Avatar fallback={testimonial.avatar} className="ring-2 ring-brand-500/20" />
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{testimonial.name}</p>
                        <p className="text-xs text-surface-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 text-surface-600 transition-colors hover:border-brand-500 hover:text-brand-600"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-brand-600" : "w-2 bg-surface-300 hover:bg-surface-400",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 text-surface-600 transition-colors hover:border-brand-500 hover:text-brand-600"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
