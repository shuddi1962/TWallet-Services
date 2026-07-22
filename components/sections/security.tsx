import { ShieldCheck, Lock, Eye, Key } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

const securityFeatures = [
  {
    icon: Key,
    title: "Keys Stay Yours",
    description:
      "We never ask for your recovery phrase or private keys. No input field, no email, no support ticket. Ever.",
  },
  {
    icon: Lock,
    title: "Row Level Security",
    description:
      "Every database table has RLS policies. Your data is protected at the database level, not just the application layer.",
  },
  {
    icon: Eye,
    title: "On-Chain Verification",
    description:
      "Payments are verified independently on-chain. No manual checks, no room for error or manipulation.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Custody",
    description:
      "The platform never holds user funds. Crypto flows directly from your wallet to the receiving address.",
  },
];

export function Security() {
  return (
    <section id="security" className="bg-surface-900 py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security first. Always.
          </h2>
          <p className="mt-4 text-lg text-surface-300">
            Built on principles of non-custodial design and bank-grade
            security. Your assets and data are protected at every layer.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <Card
              key={feature.title}
              className="border-surface-700 bg-surface-800"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                  <feature.icon className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-surface-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
