import { Container } from "@/components/layout/container";

const networks = [
  {
    name: "Ethereum",
    chainId: 1,
    symbol: "ETH",
    color: "#627EEA",
  },
  {
    name: "Polygon",
    chainId: 137,
    symbol: "MATIC",
    color: "#8247E5",
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    symbol: "ARB",
    color: "#28A0F0",
  },
  {
    name: "Optimism",
    chainId: 10,
    symbol: "OP",
    color: "#FF0420",
  },
  {
    name: "Base",
    chainId: 8453,
    symbol: "ETH",
    color: "#0052FF",
  },
  {
    name: "BNB Chain",
    chainId: 56,
    symbol: "BNB",
    color: "#F0B90B",
  },
  {
    name: "Avalanche",
    chainId: 43114,
    symbol: "AVAX",
    color: "#E84142",
  },
];

export function Networks() {
  return (
    <section id="networks" className="py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Supported networks
          </h2>
          <p className="mt-4 text-lg text-surface-600">
            Pay on 7 major EVM networks. More coming soon.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
          {networks.map((network) => (
            <div
              key={network.name}
              className="flex flex-col items-center rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: network.color }}
              >
                {network.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-surface-900">
                {network.name}
              </span>
              <span className="mt-1 text-xs text-surface-500">
                {network.symbol}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
