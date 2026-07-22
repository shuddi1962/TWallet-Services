"use client";

import { useState } from "react";
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
    <section className="bg-surface-50 py-20">
      <Container size="md">
        <div className="rounded-2xl border border-surface-200 bg-white p-8 text-center shadow-sm lg:p-12">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <Mail className="h-6 w-6 text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mx-auto mt-3 max-w-md text-surface-600">
            Get notified about new network support, product updates, and
            exclusive offers. No spam.
          </p>

          {submitted ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                Thanks! Check your inbox to confirm.
              </span>
            </div>
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
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
