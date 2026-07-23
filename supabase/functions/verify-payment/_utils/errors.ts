export const ErrorCodes = {
  INVALID_REQUEST: "INVALID_REQUEST",
  MISSING_TX_HASH: "MISSING_TX_HASH",
  MISSING_EXPECTED_AMOUNT: "MISSING_EXPECTED_AMOUNT",
  MISSING_EXPECTED_ADDRESS: "MISSING_EXPECTED_ADDRESS",
  MISSING_CHAIN_ID: "MISSING_CHAIN_ID",
  UNSUPPORTED_CHAIN: "UNSUPPORTED_CHAIN",
  TX_NOT_FOUND: "TX_NOT_FOUND",
  TX_FAILED: "TX_FAILED",
  WRONG_TO_ADDRESS: "WRONG_TO_ADDRESS",
  WRONG_AMOUNT: "WRONG_AMOUNT",
  INSUFFICIENT_CONFIRMATIONS: "INSUFFICIENT_CONFIRMATIONS",
  HASH_ALREADY_USED: "HASH_ALREADY_USED",
  RPC_ERROR: "RPC_ERROR",
  RPC_TIMEOUT: "RPC_TIMEOUT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export function errorResponse(code: ErrorCode, message: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: code, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function successResponse(data: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
