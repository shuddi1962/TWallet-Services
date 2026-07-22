import { Wallet, Send, CreditCard, ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/container";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "Connect MetaMask, WalletConnect, Coinbase Wallet, or Trust Wallet. Your private keys never leave your device.",
  },
  {
    number: "02",
    icon: Send,
    title: "Pay in Crypto",
    description:
      "Send the exact amount to the platform's receiving wallet address on your preferred network. You sign the transaction.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Get Verified",
    description:
      "Our system verifies your payment on-chain — correct address, amount, chain, and confirmations. No manual checks.",
  },
  {
    number: "04",
    icon: ShoppingBag,
    title: "Start Spending",
    description:
      "Once verified, your card is activated. Use it online or in-store, anywhere major card networks are accepted.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            From wallet connection to card activation in four simple steps. No
            paperwork, no waiting.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-full top-12 hidden h-px w-full bg-surface-200 lg:block" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
                  <step.icon className="h-8 w-8 text-brand-600" />
                  <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-surface-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
