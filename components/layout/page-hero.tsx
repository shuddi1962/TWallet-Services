import { Container } from "@/components/layout/container";

export function PageHero({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl pb-16 pt-14 text-center sm:pt-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
            <span className="font-medium text-surface-200">{badge}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-50 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-surface-400 sm:text-lg">{subtitle}</p>
        </div>
      </Container>
    </section>
  );
}
