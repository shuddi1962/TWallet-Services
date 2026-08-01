import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { FileText, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge={
            <span className="inline-flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {title}
            </span>
          }
          title={title}
          subtitle={subtitle}
        >
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-surface-400">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            Last updated: {updated}
          </div>
        </PageHero>

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="mt-4 space-y-4">
            {sections.map((section, i) => (
              <div
                key={section.heading}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.04] sm:p-8"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/20 text-sm font-bold text-brand-300 ring-1 ring-brand-400/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-white sm:text-xl">{section.heading}</h2>
                    <div className="mt-3 space-y-3">
                      {section.paragraphs.map((paragraph, j) => (
                        <p key={j} className="text-sm leading-relaxed text-surface-400 sm:text-[15px]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-3xl border border-brand-500/25 bg-gradient-to-br from-brand-500/[0.12] to-transparent p-8 text-center sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-400/30">
                <ShieldCheck className="h-6 w-6 text-brand-300" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Questions about this document?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-surface-400">
                Our team is happy to explain any part of our policies in plain language.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110"
              >
                Contact us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
