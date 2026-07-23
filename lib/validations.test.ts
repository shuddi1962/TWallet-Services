import { describe, it, expect } from "vitest";
import {
  emailSchema, passwordSchema, uuidSchema, addressSchema,
  txHashSchema, chainIdSchema, paginationSchema, amountSchema,
} from "./validations";

describe("emailSchema", () => {
  it("accepts valid email", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
  });
  it("rejects empty string", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
  });
  it("rejects invalid email", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts valid password", () => {
    expect(passwordSchema.safeParse("StrongP1ss").success).toBe(true);
  });
  it("rejects short password", () => {
    expect(passwordSchema.safeParse("Ab1").success).toBe(false);
  });
  it("rejects missing uppercase", () => {
    expect(passwordSchema.safeParse("strongpass1").success).toBe(false);
  });
  it("rejects missing lowercase", () => {
    expect(passwordSchema.safeParse("STRONGPASS1").success).toBe(false);
  });
  it("rejects missing number", () => {
    expect(passwordSchema.safeParse("StrongPass").success).toBe(false);
  });
});

describe("uuidSchema", () => {
  it("accepts valid UUID", () => {
    expect(uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
  });
  it("rejects non-UUID string", () => {
    expect(uuidSchema.safeParse("not-a-uuid").success).toBe(false);
  });
});

describe("addressSchema", () => {
  it("accepts valid Ethereum address", () => {
    expect(addressSchema.safeParse("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18").success).toBe(true);
  });
  it("rejects short address", () => {
    expect(addressSchema.safeParse("0x123").success).toBe(false);
  });
  it("rejects without 0x prefix", () => {
    expect(addressSchema.safeParse("742d35Cc6634C0532925a3b844Bc9e7595f2bD18").success).toBe(false);
  });
});

describe("txHashSchema", () => {
  it("accepts valid transaction hash", () => {
    expect(txHashSchema.safeParse("0x" + "a".repeat(64)).success).toBe(true);
  });
  it("rejects short hash", () => {
    expect(txHashSchema.safeParse("0x123").success).toBe(false);
  });
});

describe("chainIdSchema", () => {
  it("accepts valid chain ID", () => {
    expect(chainIdSchema.safeParse(1).success).toBe(true);
  });
  it("rejects zero", () => {
    expect(chainIdSchema.safeParse(0).success).toBe(false);
  });
  it("rejects negative", () => {
    expect(chainIdSchema.safeParse(-1).success).toBe(false);
  });
});

describe("paginationSchema", () => {
  it("provides default limit of 20", () => {
    const r = paginationSchema.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.limit).toBe(20);
  });
  it("accepts custom limit", () => {
    const r = paginationSchema.safeParse({ limit: "50" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.limit).toBe(50);
  });
  it("rejects limit over 100", () => {
    expect(paginationSchema.safeParse({ limit: "200" }).success).toBe(false);
  });
});

describe("amountSchema", () => {
  it("accepts whole number", () => {
    expect(amountSchema.safeParse("100").success).toBe(true);
  });
  it("accepts decimal", () => {
    expect(amountSchema.safeParse("100.50").success).toBe(true);
  });
  it("accepts 18 decimal places", () => {
    expect(amountSchema.safeParse("0.000000000000000001").success).toBe(true);
  });
  it("rejects invalid format", () => {
    expect(amountSchema.safeParse("abc").success).toBe(false);
  });
});
