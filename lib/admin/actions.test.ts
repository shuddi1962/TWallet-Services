/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createClient } from "@supabase/supabase-js";
import {
  getAdminStats, getRecentOrders, getRecentPayments, getUsers,
  getOrders, getPayments, getCardProducts, getAuditLogs,
  updateOrderStatus, suspendUser, reactivateUser,
} from "./actions";

function makeMock() {
  const table: Record<string, any> = {
    select: vi.fn(() => table),
    insert: vi.fn(() => table),
    eq: vi.fn(() => table),
    single: vi.fn(() => table),
    order: vi.fn(() => table),
    limit: vi.fn(() => table),
    range: vi.fn(() => table),
    is: vi.fn(() => table),
    not: vi.fn(() => table),
    in: vi.fn(() => table),
    gte: vi.fn(() => table),
    or: vi.fn(() => table),
    update: vi.fn(() => table),
  };
  return { from: vi.fn(() => table), table };
}

beforeEach(() => {
  vi.clearAllMocks();
  (createClient as any).mockReturnValue(makeMock());
});

describe("getAdminStats", () => {
  it("returns default zero stats on empty", async () => {
    const stats = await getAdminStats();
    expect(stats.totalUsers).toBe(0);
    expect(stats.revenue).toBe(0);
    expect(stats.pendingOrders).toBe(0);
  });
});

describe("getRecentOrders", () => {
  it("returns empty array", async () => {
    const orders = await getRecentOrders();
    expect(orders).toEqual([]);
  });
});

describe("getRecentPayments", () => {
  it("returns empty array", async () => {
    const payments = await getRecentPayments();
    expect(payments).toEqual([]);
  });
});

describe("getUsers", () => {
  it("returns empty result", async () => {
    const result = await getUsers();
    expect(result.users).toEqual([]);
    expect(result.count).toBe(0);
  });
});

describe("getOrders", () => {
  it("returns empty result", async () => {
    const result = await getOrders();
    expect(result.orders).toEqual([]);
    expect(result.count).toBe(0);
  });
});

describe("getPayments", () => {
  it("returns empty result", async () => {
    const result = await getPayments();
    expect(result.payments).toEqual([]);
    expect(result.count).toBe(0);
  });
});

describe("getCardProducts", () => {
  it("returns empty array", async () => {
    const products = await getCardProducts();
    expect(products).toEqual([]);
  });
});

describe("getAuditLogs", () => {
  it("returns empty result", async () => {
    const result = await getAuditLogs();
    expect(result.logs).toEqual([]);
    expect(result.count).toBe(0);
  });
});

describe("updateOrderStatus", () => {
  it("returns success", async () => {
    const result = await updateOrderStatus("order-1", "paid");
    expect(result).toEqual({ success: true });
  });
});

describe("suspendUser", () => {
  it("returns success", async () => {
    const result = await suspendUser("user-1");
    expect(result).toEqual({ success: true });
  });
});

describe("reactivateUser", () => {
  it("returns success", async () => {
    const result = await reactivateUser("user-1");
    expect(result).toEqual({ success: true });
  });
});
