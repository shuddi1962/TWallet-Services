import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const steps = [
  { number: "01", title: "Create Account", description: "Sign up with your email and create a secure password to get started." },
  { number: "02", title: "Verify Email", description: "Confirm your email address to activate your account and enable all features." },
  { number: "03", title: "Connect Trust Wallet", description: "Open Trust Wallet on your phone and scan the QR code to connect securely via WalletConnect." },
  { number: "04", title: "Choose Card", description: "Browse available card designs and select the one that suits your needs — virtual or physical." },
  { number: "05", title: "Pay with Crypto", description: "Send the exact amount in USDC or USDT from Trust Wallet to the provided receiving address on your chosen network." },
  { number: "06", title: "On-Chain Verification", description: "Our system automatically verifies the transaction on-chain — correct address, amount, chain, and confirmations." },
  { number: "07", title: "Receive Card", description: "Virtual cards are available instantly. Physical cards ship within 5-7 business days." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950 pt-24">
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-surface-50">How It Works</h1>
            <p className="mt-4 text-lg text-surface-400">Get your crypto-funded card in 7 simple steps.</p>
          </div>
          <div className="mt-16 space-y-12">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex gap-6">
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-12 h-full w-px bg-surface-800" aria-hidden="true" />
                )}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-lg font-bold text-brand-400">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h2 className="text-xl font-semibold text-surface-50">{step.title}</h2>
                  <p className="mt-2 text-surface-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
