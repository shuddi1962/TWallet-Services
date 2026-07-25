"use client";

import { useActionState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { submitContact } from "@/features/contact/server/actions";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, undefined);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950 pt-24">
        <section className="mx-auto max-w-2xl px-4 py-20">
          <h1 className="text-4xl font-bold text-surface-50">Contact Us</h1>
          <p className="mt-4 text-lg text-surface-400">
            Have a question or need help? Send us a message and we&apos;ll get back to you within 24 hours.
          </p>

          {state?.success && (
            <div className="mt-8 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success" role="alert">
              {state.success}
            </div>
          )}

          {state?.error && (
            <div className="mt-8 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error" role="alert">
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-12 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-300">Name</label>
              <input id="name" name="name" type="text" required className="mt-1 block w-full rounded-xl border border-surface-700 bg-surface-800 px-4 py-3 text-surface-100 placeholder-surface-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-300">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full rounded-xl border border-surface-700 bg-surface-800 px-4 py-3 text-surface-100 placeholder-surface-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-surface-300">Message</label>
              <textarea id="message" name="message" rows={5} required className="mt-1 block w-full rounded-xl border border-surface-700 bg-surface-800 px-4 py-3 text-surface-100 placeholder-surface-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="How can we help?" />
            </div>
            <Button type="submit" loading={pending} className="w-full sm:w-auto">
              {pending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
