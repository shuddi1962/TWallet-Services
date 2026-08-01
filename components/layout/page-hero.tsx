import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

interface PageHeroProps {
  badge: ReactNode;
  title: ReactNode;
  subtitle: string;
  children?: ReactNode;
}

export function PageHero({ badge, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#03060d] pt-20 pb-12 lg:pt-24 lg:pb-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 65%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.25) 0%, transparent 65%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 65%)" }} aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl pb-8 pt-10 text-center sm:pt-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-brand-300">{badge}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-surface-400 sm:text-lg">
            {subtitle}
          </p>
          {children}
        </div>
      </Container>
    </section>
  );
}
