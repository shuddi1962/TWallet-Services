import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform">
          <div className="h-[500px] w-[500px] rounded-full bg-brand-200/40 blur-3xl" />
        </div>
      </div>

      <Container size="xl">
        <div className="py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-brand-600" />
              Non-custodial crypto card platform
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
              Your crypto.
              <span className="block text-brand-600">Your card.</span>
            </h1>

            <p className="mt-6 text-lg text-surface-600 sm:text-xl">
              Order a physical or virtual card funded by your crypto. Connect
              your wallet, pay on-chain, and spend anywhere cards are accepted.
              No custodian. No middleman. Your keys stay yours.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Your Card
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#how-it-works">How It Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-surface-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Non-custodial
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                Instant verification
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand-600" />
                7 EVM networks
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
