"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";
import { FadeIn } from "@/components/ui/motion-section";

const faqs = [
  { question: "Is TWallet really non-custodial?", answer: "Yes. We never collect, store, or request your recovery phrase or private keys. You connect your wallet using standard protocols (WalletConnect, MetaMask, etc.), and you sign every transaction yourself. The platform never signs or broadcasts on your behalf." },
  { question: "How does payment verification work?", answer: "When you place an order, we generate a unique receiving wallet address and the exact crypto amount. After you send the payment, our system independently verifies the transaction on-chain — checking the correct address, amount, chain, and required confirmations. Only then is your order marked as paid." },
  { question: "Which wallets are supported?", answer: "MetaMask, WalletConnect v2, Coinbase Wallet, and Trust Wallet. Any wallet that supports WalletConnect v2 can connect to the platform." },
  { question: "Which crypto networks are supported?", answer: "Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Chain, and Avalanche. More networks will be added in future updates." },
  { question: "How long does card activation take?", answer: "Virtual cards are issued instantly after payment verification. Physical cards are shipped within 3-5 business days globally. On-chain verification typically completes within minutes." },
  { question: "What happens if I send the wrong amount?", answer: "If the amount doesn't match the order total, the payment won't be verified and the order won't be marked as paid. You can contact support to resolve the issue." },
  { question: "Can I use the card for ATM withdrawals?", answer: "Yes, physical card holders can use ATMs that accept major card networks. Virtual cards are limited to online purchases only." },
  { question: "Is there a monthly fee?", answer: "Virtual cards have no monthly fee. Physical cards have a $3/month maintenance fee. Premium cards have an $8/month maintenance fee with additional benefits like zero top-up fees and higher limits." },
];

function FAQItem({ faq, isOpen, onToggle, index }: { faq: { question: string; answer: string }; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-white transition-colors group-hover:text-brand-400">
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-surface-500 transition-all duration-300",
            isOpen && "rotate-180 text-brand-400",
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-surface-400">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container size="md">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Everything you need to know about TW·CARD.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
