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

describe("getPaymentDetails", () => {
  it("returns error if not authenticated", async () => {
    const sb = makeSupabase();
    sb.auth.getUser.mockResolvedValue({ data: { user: null } });
    (createServerSupabaseClient as any).mockResolvedValue(sb);

    const result = await getPaymentDetails("order-1");
    expect(result).toEqual({ error: "Not authenticated", data: null });
  });

  it("returns payment details", async () => {
    const sb = makeSupabase();
    (createServerSupabaseClient as any).mockResolvedValue(sb);

    pushResult({ id: "order-1", amount_usdc: 100, status: "pending", network: "ethereum", token: "USDC" });
    pushResult([{ name: "ethereum" }]);
    pushResult([{ address: "0xabc" }]);
    pushResult([{ symbol: "USDC" }]);
    pushResult(null);

    const result = await getPaymentDetails("order-1");
    expect(result.error).toBeNull();
    expect(result.data?.order.amount_usdc).toBe(100);
  });
});

describe("submitPaymentTx", () => {
  it("validates required fields", async () => {
    (createServerSupabaseClient as any).mockResolvedValue(makeSupabase());
    const fd = new FormData();
    expect(await submitPaymentTx(null, fd)).toEqual({ error: "Order ID is required" });
    fd.set("orderId", "o1");
    expect(await submitPaymentTx(null, fd)).toEqual({ error: "Transaction hash is required" });
    fd.set("txHash", "0xabc");
    expect(await submitPaymentTx(null, fd)).toEqual({ error: "From address is required" });
  });

  it("submits payment tx", async () => {
    const sb = makeSupabase();
    (createServerSupabaseClient as any).mockResolvedValue(sb);

    pushResult({ id: "order-1", amount_usdc: 100, network: "ethereum" });
    pushResult(null, null);

    const fd = new FormData();
    fd.set("orderId", "order-1");
    fd.set("txHash", "0xabc");
    fd.set("fromAddress", "0x123");
    const result = await submitPaymentTx(null, fd);
    expect(result).toEqual({ success: true, message: "Payment submitted for verification" });
  });
});
