import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { FileText, Calendar } from "lucide-react";

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
      <main className="min-h-screen bg-surface-950 pt-24">
        <Container>
          <div className="mx-auto max-w-3xl py-16 lg:py-20">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
                <FileText className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="font-medium text-surface-200">{title}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-surface-50 sm:text-4xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-surface-400">{subtitle}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-surface-400">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                Last updated: {updated}
              </div>
            </div>

            <div className="mt-14 space-y-10">
              {sections.map((section, i) => (
                <section key={section.heading}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-400">
                      {i + 1}
                    </span>
                    <h2 className="text-xl font-semibold text-surface-50">{section.heading}</h2>
                  </div>
                  <div className="space-y-3 pl-11">
                    {section.paragraphs.map((paragraph, j) => (
                      <p key={j} className="text-surface-400 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-surface-800 bg-surface-900/50 p-8 text-center">
              <p className="text-surface-400">
                Questions about this policy?{" "}
                <Link href="/contact" className="font-semibold text-brand-400 hover:text-brand-300">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
