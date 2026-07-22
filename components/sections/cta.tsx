import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center shadow-xl lg:px-12 lg:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to spend your crypto?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Join thousands of users who&apos;ve already connected their wallets and
            ordered their TWallet cards. No custodian. No middleman. Just your
            crypto on a card.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" variant="secondary" asChild>
              <Link href="/auth/register">
                Get Your Card
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
