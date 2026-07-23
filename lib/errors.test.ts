import { describe, it, expect } from "vitest";
import { AppError, ErrorCodes } from "./errors";

describe("AppError", () => {
  it("creates error with code and message", () => {
    const err = new AppError("AUTH_001", "Invalid email", 400);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AppError");
    expect(err.code).toBe("AUTH_001");
    expect(err.message).toBe("Invalid email");
    expect(err.status).toBe(400);
  });

  it("defaults status to 400", () => {
    const err = new AppError("GEN_001", "Not found");
    expect(err.status).toBe(400);
  });

  it("serializes to JSON", () => {
    const err = new AppError("PAY_001", "Invalid amount", 422);
    expect(err.toJSON()).toEqual({
      error: { code: "PAY_001", message: "Invalid amount" },
    });
  });
});

describe("ErrorCodes", () => {
  it("has auth error codes", () => {
    expect(ErrorCodes.INVALID_EMAIL).toBe("AUTH_001");
    expect(ErrorCodes.WEAK_PASSWORD).toBe("AUTH_002");
    expect(ErrorCodes.EMAIL_ALREADY_EXISTS).toBe("AUTH_003");
    expect(ErrorCodes.INVALID_CREDENTIALS).toBe("AUTH_004");
    expect(ErrorCodes.SESSION_EXPIRED).toBe("AUTH_006");
  });

  it("has wallet error codes", () => {
    expect(ErrorCodes.WALLET_NOT_CONNECTED).toBe("WALLET_001");
    expect(ErrorCodes.UNSUPPORTED_NETWORK).toBe("WALLET_002");
    expect(ErrorCodes.WALLET_REJECTED).toBe("WALLET_003");
  });

  it("has payment error codes", () => {
    expect(ErrorCodes.INVALID_AMOUNT).toBe("PAY_001");
    expect(ErrorCodes.TX_HASH_ALREADY_USED).toBe("PAY_005");
    expect(ErrorCodes.VERIFICATION_FAILED).toBe("PAY_010");
  });

  it("has general error codes", () => {
    expect(ErrorCodes.NOT_FOUND).toBe("GEN_001");
    expect(ErrorCodes.UNAUTHORIZED).toBe("GEN_002");
    expect(ErrorCodes.FORBIDDEN).toBe("GEN_003");
    expect(ErrorCodes.INTERNAL_ERROR).toBe("GEN_006");
  });
});
