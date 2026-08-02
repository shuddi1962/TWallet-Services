export interface TokenConfig {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
}

export const supportedTokens: TokenConfig[] = [
  { chainId: 1, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
  { chainId: 137, address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", decimals: 6 },
  { chainId: 42161, address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", decimals: 6 },
  { chainId: 10, address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", symbol: "USDC", decimals: 6 },
  { chainId: 8453, address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", decimals: 6 },
];

export function getTokenByAddress(chainId: number, address: string): TokenConfig | undefined {
  return supportedTokens.find((t) => t.chainId === chainId && t.address.toLowerCase() === address.toLowerCase());
}

export function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals) || "0";
  const fracPart = padded.slice(padded.length - decimals);
  return `${intPart}.${fracPart}`;
}
