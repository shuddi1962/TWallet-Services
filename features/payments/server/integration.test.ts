import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from "@/lib";
import { getPaymentDetails, submitPaymentTx } from "./actions";

const mockUser = { id: "user-1" };
let resultsQueue: Array<{ data: any; error: any }>;

function makeSupabase() {
  const chain: Record<string, any> = {};
  const methods = [
    "select", "insert", "eq", "single", "order", "limit",
    "or", "range", "is", "not", "in", "gte", "update",
  ];
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  chain.then = (resolve: any) => resolve(resultsQueue.shift() ?? { data: null, error: null });
  chain.catch = () => {};

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
    from: vi.fn(() => chain),
    chain,
  };
}

function pushResult(data: any, error: any = null) {
  resultsQueue.push({ data, error });
}

beforeEach(() => {
  vi.clearAllMocks();
  resultsQueue = [];
});

describe("Payment Integration", () => {
  it("fetches payment details with all related data", async () => {
    const supabase = makeSupabase();
    (createServerSupabaseClient as any).mockResolvedValue(supabase);

    const order = { id: "order-1", order_number: "TW-ABC", amount_usdc: "50", status: "pending", network: "ethereum", token: "usdc" };
    const networks = [{ id: "net-1", name: "Ethereum", chain_id: 1, active: true }];
    const wallets = [{ id: "wallet-1", address: "0x123", chain: "ethereum", active: true }];
    const tokens = [{ id: "tok-1", symbol: "USDC", network: "ethereum", active: true }];

    pushResult(order);
    pushResult(networks);
    pushResult(wallets);
    pushResult(tokens);
    pushResult(null);

    const result = await getPaymentDetails("order-1");

    expect(result.error).toBeNull();
    expect(result.data?.order).toEqual(order);
    expect(result.data?.networks).toEqual(networks);
    expect(result.data?.receivingWallets).toEqual(wallets);
    expect(result.data?.tokens).toEqual(tokens);
  });

  it("returns error for non-existent order", async () => {
    const supabase = makeSupabase();
    (createServerSupabaseClient as any).mockResolvedValue(supabase);

    pushResult(null, { message: "Not found" });

    const result = await getPaymentDetails("invalid-order");
    expect(result.error).toBe("Order not found");
  });

  it("submits a payment transaction successfully", async () => {
    const supabase = makeSupabase();
    (createServerSupabaseClient as any).mockResolvedValue(supabase);

    const order = { id: "order-1", order_number: "TW-ABC", amount_usdc: "50", status: "pending", network: "ethereum", token: "usdc" };

    pushResult(order);
    pushResult(order);
    pushResult({ id: "tx-1", order_id: "order-1", tx_hash: "0xabc" });
    pushResult({ data: [{ id: "tx-1" }], error: null });

    const formData = new FormData();
    formData.set("orderId", "order-1");
    formData.set("txHash", "0xabc");
    formData.set("fromAddress", "0x123");
    formData.set("network", "ethereum");
    formData.set("token", "usdc");
    formData.set("amount", "50");

    const result = await submitPaymentTx(null, formData);
    expect(result.success).toBe(true);
  });
});
