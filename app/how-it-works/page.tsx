import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { UserPlus, MailCheck, Wallet, CreditCard, Coins, ShieldCheck, PackageCheck, ArrowRight } from "lucide-react";

const steps = [
  { number: "01", icon: UserPlus, title: "Create Account", description: "Sign up with your email and create a secure password to get started.", duration: "~1 min" },
  { number: "02", icon: MailCheck, title: "Verify Email", description: "Confirm your email address to activate your account and enable all features.", duration: "Instant" },
  { number: "03", icon: Wallet, title: "Connect Wallet", description: "Open Trust Wallet on your phone and scan the QR code to connect securely via WalletConnect.", duration: "~1 min" },
  { number: "04", icon: CreditCard, title: "Choose Card", description: "Browse available card designs and select the one that suits your needs — virtual or physical.", duration: "~2 min" },
  { number: "05", icon: Coins, title: "Pay with Crypto", description: "Send the exact amount in USDC or USDT from Trust Wallet to the provided receiving address on your chosen network.", duration: "~2 min" },
  { number: "06", icon: ShieldCheck, title: "On-Chain Verification", description: "Our system automatically verifies the transaction on-chain — correct address, amount, chain, and confirmations.", duration: "Minutes" },
  { number: "07", icon: PackageCheck, title: "Receive Card", description: "Virtual cards are available instantly. Physical cards ship within 5-7 business days.", duration: "5–7 days" },
];

const iconsByStep = [UserPlus, MailCheck, Wallet, CreditCard, Coins, ShieldCheck, PackageCheck];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="How It Works"
          title={
            <>
              Your card in <span className="text-gradient-blue">7 simple steps</span>
            </>
          }
          subtitle="From sign-up to spending — a clear, secure flow built around your wallet. No custody, no seed phrases, no surprises."
        />

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="relative mt-6">
            <div className="pointer-events-none absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-brand-500/50 via-white/10 to-transparent lg:block" aria-hidden="true" />

            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = iconsByStep[i] ?? step.icon;
                return (
                  <div
                    key={step.number}
                    className="group relative flex gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-brand-500/40 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-brand-500/10 sm:gap-6 sm:p-6"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/30 to-accent-500/20 ring-1 ring-brand-400/40 transition-transform duration-300 group-hover:scale-110 lg:h-14 lg:w-14">
                        <Icon className="h-6 w-6 text-brand-300" aria-hidden="true" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="mt-2 h-full w-px bg-white/10 lg:hidden" aria-hidden="true" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold tracking-widest text-brand-400">{step.number}</span>
                          <h2 className="text-lg font-semibold text-white sm:text-xl">{step.title}</h2>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-surface-400">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-surface-400 sm:text-base">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Ready to get your card?</h3>
              <p className="mt-1 text-sm text-surface-400">Create your free account and connect your wallet in minutes.</p>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110"
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
