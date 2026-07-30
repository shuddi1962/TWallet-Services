import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon, base, arbitrum, optimism, sepolia } from "@reown/appkit/networks";

export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "88e524c685bd08403dd2f3123a4fc2f6";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, polygon, base, arbitrum, optimism, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;