"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";

const faqs = [
  {
    question: "Is TWallet really non-custodial?",
    answer:
      "Yes. We never collect, store, or request your recovery phrase or private keys. You connect your wallet using standard protocols (WalletConnect, MetaMask, etc.), and you sign every transaction yourself. The platform never signs or broadcasts on your behalf.",
  },
  {
    question: "How does payment verification work?",
    answer:
      "When you place an order, we generate a unique receiving wallet address and the exact crypto amount. After you send the payment, our system independently verifies the transaction on-chain — checking the correct address, amount, chain, and required confirmations. Only then is your order marked as paid.",
  },
  {
    question: "Which wallets are supported?",
    answer:
      "MetaMask, WalletConnect v2, Coinbase Wallet, and Trust Wallet. Any wallet that supports WalletConnect v2 can connect to the platform.",
  },
  {
    question: "Which crypto networks are supported?",
    answer:
      "Ethereum, Polygon, Arbitrum, Optimism, Base, BNB Chain, and Avalanche. More networks will be added in future updates.",
  },
  {
    question: "How long does card activation take?",
    answer:
      "Virtual cards are issued instantly after payment verification. Physical cards are shipped within 3-5 business days globally. On-chain verification typically completes within minutes, depending on network congestion and required confirmations.",
  },
  {
    question: "What happens if I send the wrong amount?",
    answer:
      "If the amount doesn't match the order total, the payment won't be verified and the order won't be marked as paid. You can contact support to resolve the issue. Always double-check the receiving address and exact amount before sending.",
  },
  {
    question: "Can I use the card for ATM withdrawals?",
    answer:
      "Yes, physical card holders can use ATMs that accept major card networks. Virtual cards are limited to online purchases only.",
  },
  {
    question: "Is there a monthly fee?",
    answer:
      "Virtual cards have no monthly fee. Physical cards have a $3/month maintenance fee. Premium cards have an $8/month maintenance fee with additional benefits like zero top-up fees and higher limits.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-surface-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-surface-900">
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-surface-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-5 text-sm text-surface-600">{faq.answer}</div>
      )}
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container size="md">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            Everything you need to know about TWallet.
          </p>
        </div>

        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
