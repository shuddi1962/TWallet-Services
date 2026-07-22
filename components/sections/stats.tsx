import { Container } from "@/components/layout/container";

const stats = [
  { value: "10K+", label: "Active cards" },
  { value: "7", label: "EVM networks" },
  { value: "150+", label: "Countries supported" },
  { value: "100M+", label: "Merchants worldwide" },
  { value: "<5min", label: "Average verification" },
  { value: "0", label: "Keys collected" },
];

export function Stats() {
  return (
    <section className="border-y border-surface-200 bg-white py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-brand-600">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-surface-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
