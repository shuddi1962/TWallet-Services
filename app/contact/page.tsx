"use client";

import { useActionState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { submitContact } from "@/features/contact/server/actions";
import { Button } from "@/components/ui/button";
import { Mail, Clock, ShieldCheck, MessageSquare, Send } from "lucide-react";

const infoCards = [
  { icon: Mail, title: "Email us", value: "support@twalletservices.com" },
  { icon: Clock, title: "Response time", value: "Under 24 hours" },
  { icon: ShieldCheck, title: "Priority", value: "Existing orders answered first" },
];

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, undefined);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="Contact"
          title={
            <>
              Let&apos;s <span className="text-gradient-blue">talk</span>
            </>
          }
          subtitle="Have a question or need help? Send us a message and we'll get back to you within 24 hours."
        />

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="mt-4 grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              {infoCards.map((card) => (
                <div key={card.title} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/25 to-accent-500/20 ring-1 ring-brand-400/30">
                    <card.icon className="h-5 w-5 text-brand-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-sm text-surface-400">{card.value}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
                    <MessageSquare className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-950" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Support team online</p>
                    <p className="text-xs text-surface-400">Typically replies within a few hours</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-surface-400">
                  For order-specific questions, include your order number — it helps us resolve your
                  issue faster.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:col-span-3">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />

              {state?.success && (
                <div className="relative mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300" role="alert">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{state.success}</span>
                </div>
              )}

              {state?.error && (
                <div className="relative mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-300" role="alert">
                  {state.error}
                </div>
              )}

              <form action={formAction} className="relative space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-surface-300">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="mt-2 block w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-surface-500 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-surface-300">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="mt-2 block w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-surface-500 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-surface-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="How can we help?"
                    className="mt-2 block w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-surface-500 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-surface-500">We reply to every message — usually within 24 hours.</p>
                  <Button
                    type="submit"
                    loading={pending}
                    className="h-12 shrink-0 gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                  >
                    {!pending && <Send className="h-4 w-4" aria-hidden="true" />}
                    {pending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
