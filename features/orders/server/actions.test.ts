import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib", () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: (key: string) => {
      const map: Record<string, string> = {
        "x-forwarded-for": "127.0.0.1",
        origin: "http://localhost:3000",
      };
      return map[key] ?? null;
    },
  })),
  cookies: vi.fn(() => ({
    get: vi.fn(() => ({ value: "mock-sb-token" })),
  })),
}));

import { createServerSupabaseClient } from "@/lib";
import { createOrder, getOrders, getOrder } from "./actions";

const mockUser = { id: "user-1" };
let mockTables = new Map<string, any>();

function getTable(name: string) {
  if (!mockTables.has(name)) {
    const chain: any = {};
    const methods = ["select", "insert", "eq", "single", "order", "limit", "or", "range", "is", "not", "in", "gte", "update", "maybeSingle"];
    for (const m of methods) {
      chain[m] = vi.fn(() => chain);
    }
    mockTables.set(name, chain);
  }
  return mockTables.get(name);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockTables.clear();
  const supabase = {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
    from: vi.fn((name: string) => getTable(name)),
  };
  (createServerSupabaseClient as any).mockResolvedValue(supabase);
  globalThis.fetch = vi.fn().mockRejectedValue(new Error("fetch not mocked")) as unknown as typeof globalThis.fetch;
});

describe("createOrder", () => {
  it("returns error if not authenticated", async () => {
    const supabase = await (createServerSupabaseClient as any)();
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const fd = new FormData();
    fd.set("productId", "prod-1");
    fd.set("network", "ethereum");
    fd.set("token", "USDC");
    const result = await createOrder(null, fd);
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error if wallet not connected", async () => {
    getTable("wallets").maybeSingle.mockResolvedValue({ data: null, error: null });
    const fd = new FormData();
    fd.set("productId", "prod-1");
    fd.set("network", "ethereum");
    fd.set("token", "USDC");
    const result = await createOrder(null, fd);
    expect(result).toEqual({ error: expect.stringContaining("Connect your wallet") });
  });

  it("returns error if product not found", async () => {
    getTable("wallets").maybeSingle.mockResolvedValue({ data: { id: "wallet-1" }, error: null });
    getTable("card_products").single.mockResolvedValue({ data: null, error: new Error("Not found") });
    const fd = new FormData();
    fd.set("productId", "bad-id");
    fd.set("network", "ethereum");
    fd.set("token", "USDC");
    const result = await createOrder(null, fd);
    expect(result).toEqual({ error: "Product not found" });
  });

  it("creates order on success", async () => {
    getTable("wallets").maybeSingle.mockResolvedValue({ data: { id: "wallet-1" }, error: null });
    getTable("card_products").single.mockResolvedValue({
      data: { id: "prod-1", name: "Sapphire", price_usdc: 100 },
      error: null,
    });
    getTable("card_orders").single.mockResolvedValue({
      data: { id: "order-1", order_number: "TW-ABC123", amount_usdc: 100 },
      error: null,
    });
    const fd = new FormData();
    fd.set("productId", "prod-1");
    fd.set("network", "ethereum");
    fd.set("token", "USDC");
    const result = await createOrder(null, fd);
    expect(result.success).toBe(true);
    expect((result as any).order.order_number).toMatch(/^TW-/);
  });

  it("returns error for missing fields", async () => {
    const fd = new FormData();
    expect(await createOrder(null, fd)).toEqual({ error: "Product is required" });
    fd.set("productId", "p1");
    expect(await createOrder(null, fd)).toEqual({ error: "Network is required" });
    fd.set("network", "eth");
    expect(await createOrder(null, fd)).toEqual({ error: "Token is required" });
  });
});

describe("getOrders", () => {
  it("returns error if not authenticated", async () => {
    const supabase = await (createServerSupabaseClient as any)();
    supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const result = await getOrders();
    expect(result).toEqual({ error: "Not authenticated", data: null });
  });

  it("returns orders on success", async () => {
    const rows = [{ id: "order-1", order_number: "TW-ABC", status: "pending" }];
    const supabase = await (createServerSupabaseClient as any)();
    supabase.from = vi.fn((name: string) => {
      const table = getTable(name);
      if (name === "card_orders") {
        const chain: any = {
          select: vi.fn(() => chain),
          order: vi.fn(() => ({ error: null, data: rows })),
        };
        return chain;
      }
      return table;
    });
    const result = await getOrders();
    expect(result).toEqual({ data: rows, error: null });
  });

  it("returns error when query fails", async () => {
    const supabase = await (createServerSupabaseClient as any)();
    supabase.from = vi.fn((name: string) => {
      if (name === "card_orders") {
        const chain: any = {
          select: vi.fn(() => chain),
          order: vi.fn(() => ({ error: new Error("boom"), data: null })),
        };
        return chain;
      }
      return getTable(name);
    });
    const result = await getOrders();
    expect(result).toEqual({ error: "boom", data: null });
  });
});

describe("getOrder", () => {
  it("returns error if not authenticated", async () => {
    const supabase = await (createServerSupabaseClient as any)();
    supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const result = await getOrder("order-1");
    expect(result).toEqual({ error: "Not authenticated", data: null });
  });

  it("returns order on success", async () => {
    const row = { id: "order-1", order_number: "TW-ABC", status: "paid" };
    const supabase = await (createServerSupabaseClient as any)();
    supabase.from = vi.fn((name: string) => {
      if (name === "card_orders") {
        const chain: any = {
          select: vi.fn(() => chain),
          eq: vi.fn(() => chain),
          single: vi.fn(() => ({ error: null, data: row })),
        };
        return chain;
      }
      return getTable(name);
    });
    const result = await getOrder("order-1");
    expect(result).toEqual({ data: row, error: null });
  });
});
