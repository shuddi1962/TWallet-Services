"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/5 bg-surface-900/50 p-8 text-center lg:p-12"
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
            <Mail className="h-6 w-6 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mx-auto mt-3 max-w-md text-surface-400">
            Get notified about new network support, product updates, and exclusive offers. No spam.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-success border border-success/20"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Thanks! Check your inbox to confirm.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-surface-800 border-white/10 text-white placeholder:text-surface-500 focus:border-brand-500/50"
              />
              <Button type="submit" className="bg-gradient-to-r from-brand-600 to-accent-600 border-0">
                Subscribe
              </Button>
            </form>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
