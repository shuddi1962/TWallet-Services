export interface ChainConfig {
  chainId: number;
  name: string;
  nativeCurrency: string;
  nativeDecimals: number;
  requiredConfirmations: number;
  blockTime: number;
  explorerUrl: string;
}

export const chains: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    name: "Ethereum",
    nativeCurrency: "ETH",
    nativeDecimals: 18,
    requiredConfirmations: 12,
    blockTime: 12,
    explorerUrl: "https://etherscan.io",
  },
  11155111: {
    chainId: 11155111,
    name: "Sepolia",
    nativeCurrency: "ETH",
    nativeDecimals: 18,
    requiredConfirmations: 6,
    blockTime: 12,
    explorerUrl: "https://sepolia.etherscan.io",
  },
  137: {
    chainId: 137,
    name: "Polygon",
    nativeCurrency: "MATIC",
    nativeDecimals: 18,
    requiredConfirmations: 100,
    blockTime: 2,
    explorerUrl: "https://polygonscan.com",
  },
  42161: {
    chainId: 42161,
    name: "Arbitrum",
    nativeCurrency: "ETH",
    nativeDecimals: 18,
    requiredConfirmations: 12,
    blockTime: 0.5,
    explorerUrl: "https://arbiscan.io",
  },
  10: {
    chainId: 10,
    name: "Optimism",
    nativeCurrency: "ETH",
    nativeDecimals: 18,
    requiredConfirmations: 20,
    blockTime: 2,
    explorerUrl: "https://optimistic.etherscan.io",
  },
  8453: {
    chainId: 8453,
    name: "Base",
    nativeCurrency: "ETH",
    nativeDecimals: 18,
    requiredConfirmations: 12,
    blockTime: 2,
    explorerUrl: "https://basescan.org",
  },
};
