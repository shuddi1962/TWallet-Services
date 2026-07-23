const RPC_URLS: Record<string, string> = {
  "1": "https://eth-mainnet.g.alchemy.com/v2/",
  "11155111": "https://eth-sepolia.g.alchemy.com/v2/",
  "137": "https://polygon-mainnet.g.alchemy.com/v2/",
  "80001": "https://polygon-mumbai.g.alchemy.com/v2/",
  "42161": "https://arb-mainnet.g.alchemy.com/v2/",
  "421614": "https://arb-sepolia.g.alchemy.com/v2/",
  "10": "https://opt-mainnet.g.alchemy.com/v2/",
  "8453": "https://base-mainnet.g.alchemy.com/v2/",
  "84532": "https://base-sepolia.g.alchemy.com/v2/",
};

export function getRpcUrl(chainId: string): string | null {
  const base = RPC_URLS[chainId];
  if (!base) return null;
  const key = Deno.env.get("ALCHEMY_API_KEY");
  if (!key) return null;
  return `${base}${key}`;
}

export async function rpcCall(
  rpcUrl: string,
  method: string,
  params: unknown[],
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: controller.signal,
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getTransaction(
  rpcUrl: string,
  txHash: string,
): Promise<Record<string, unknown> | null> {
  const result = await rpcCall(rpcUrl, "eth_getTransactionByHash", [txHash]);
  if (!result || (result as Record<string, unknown>).blockNumber === null) return null;
  return result as Record<string, unknown>;
}

export async function getTransactionReceipt(
  rpcUrl: string,
  txHash: string,
): Promise<Record<string, unknown> | null> {
  const result = await rpcCall(rpcUrl, "eth_getTransactionReceipt", [txHash]);
  if (!result) return null;
  return result as Record<string, unknown>;
}

export async function getBlockNumber(rpcUrl: string): Promise<bigint> {
  const result = await rpcCall(rpcUrl, "eth_blockNumber", []);
  return BigInt(result as string);
}
