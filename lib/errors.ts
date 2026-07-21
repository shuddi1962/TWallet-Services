// Shared error codes for the entire application

export const ErrorCodes = {
  // Auth
  INVALID_EMAIL: "AUTH_001",
  WEAK_PASSWORD: "AUTH_002",
  EMAIL_ALREADY_EXISTS: "AUTH_003",
  INVALID_CREDENTIALS: "AUTH_004",
  EXPIRED_LINK: "AUTH_005",
  SESSION_EXPIRED: "AUTH_006",

  // Wallet
  WALLET_NOT_CONNECTED: "WALLET_001",
  UNSUPPORTED_NETWORK: "WALLET_002",
  WALLET_REJECTED: "WALLET_003",

  // Payment
  INVALID_AMOUNT: "PAY_001",
  INVALID_ADDRESS: "PAY_002",
  INVALID_CHAIN: "PAY_003",
  INSUFFICIENT_CONFIRMATIONS: "PAY_004",
  TX_HASH_ALREADY_USED: "PAY_005",
  TX_NOT_FOUND: "PAY_006",
  AMOUNT_MISMATCH: "PAY_007",
  RECIPIENT_MISMATCH: "PAY_008",
  PAYMENT_EXPIRED: "PAY_009",
  VERIFICATION_FAILED: "PAY_010",

  // General
  NOT_FOUND: "GEN_001",
  UNAUTHORIZED: "GEN_002",
  FORBIDDEN: "GEN_003",
  VALIDATION_ERROR: "GEN_004",
  RATE_LIMITED: "GEN_005",
  INTERNAL_ERROR: "GEN_006",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}
