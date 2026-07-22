import { CreditCard, Smartphone, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function CardShowcase() {
  return (
    <section className="bg-surface-900 py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <Badge variant="info" className="mb-6">
              Card Showcase
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One card. Every use case.
            </h2>
            <p className="mt-4 text-lg text-surface-300">
              Whether you're shopping online, paying in-store, or traveling
              abroad, your TWallet card works wherever major card networks are
              accepted.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Physical Card</h3>
                  <p className="mt-1 text-sm text-surface-300">
                    Contactless payments, ATM withdrawals, and in-store
                    purchases. Shipped globally.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Virtual Card</h3>
                  <p className="mt-1 text-sm text-surface-300">
                    Instant issuance for online shopping, subscriptions, and
                    digital purchases. Ready in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Global Acceptance</h3>
                  <p className="mt-1 text-sm text-surface-300">
                    Accepted at 100M+ merchants worldwide. Spend in 150+
                    currencies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-56 w-96 max-w-full rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-surface-800 p-6 shadow-2xl">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">
                    TWallet
                  </span>
                  <div className="h-8 w-12 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600" />
                </div>
                <div>
                  <div className="mb-4 h-8 w-12 rounded-sm bg-yellow-400/80" />
                  <p className="font-mono text-lg tracking-widest text-white/90">
                    **** **** **** 2026
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-white/70">CARDHOLDER</span>
                    <span className="text-sm font-semibold text-white">
                      VISA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
