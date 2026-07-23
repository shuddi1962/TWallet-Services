import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib", () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createServerSupabaseClient } from "@/lib";
import { createOrder, getOrders, getOrder } from "./actions";

const mockUser = { id: "user-1" };
let mockTables = new Map<string, any>();

function getTable(name: string) {
  if (!mockTables.has(name)) {
    const chain: any = {};
    const methods = ["select", "insert", "eq", "single", "order", "limit", "or", "range", "is", "not", "in", "gte", "update"];
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

  it("returns error if product not found", async () => {
    getTable("card_products").single.mockResolvedValue({ data: null, error: new Error("Not found") });
    const fd = new FormData();
    fd.set("productId", "bad-id");
    fd.set("network", "ethereum");
    fd.set("token", "USDC");
    const result = await createOrder(null, fd);
    expect(result).toEqual({ error: "Product not found" });
  });

  it("creates order on success", async () => {
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
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const result = await getOrders();
    expect(result).toEqual({ error: "Not authenticated", data: null });
  });

  it("returns user orders", async () => {
    getTable("card_orders").order.mockResolvedValue({
      data: [{ id: "order-1", order_number: "TW-123", status: "pending" }],
      error: null,
    });
    const result = await getOrders();
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data![0].order_number).toBe("TW-123");
  });
});

describe("getOrder", () => {
  it("returns error if not authenticated", async () => {
    const supabase = await (createServerSupabaseClient as any)();
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const result = await getOrder("order-1");
    expect(result).toEqual({ error: "Not authenticated", data: null });
  });

  it("returns single order", async () => {
    getTable("card_orders").single.mockResolvedValue({
      data: { id: "order-1", status: "paid" },
      error: null,
    });
    const result = await getOrder("order-1");
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });
});
