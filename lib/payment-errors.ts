import { ErrorCodes, type ErrorCode } from "./errors";

export const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  [ErrorCodes.INVALID_AMOUNT]: "The payment amount is invalid. Please try again.",
  [ErrorCodes.INVALID_ADDRESS]: "The recipient address is invalid. Please verify and try again.",
  [ErrorCodes.INVALID_CHAIN]: "The selected network is not supported. Please choose a different network.",
  [ErrorCodes.INSUFFICIENT_CONFIRMATIONS]:
    "Transaction is still pending. Please wait for more confirmations.",
  [ErrorCodes.TX_HASH_ALREADY_USED]: "This transaction has already been used. Please submit a new one.",
  [ErrorCodes.TX_NOT_FOUND]: "Transaction not found on-chain. Please verify the transaction hash.",
  [ErrorCodes.AMOUNT_MISMATCH]: "The sent amount doesn't match the expected amount. Please send the exact amount.",
  [ErrorCodes.RECIPIENT_MISMATCH]:
    "The recipient address doesn't match. Please send to the correct address.",
  [ErrorCodes.PAYMENT_EXPIRED]: "This payment session has expired. Please create a new order.",
  [ErrorCodes.VERIFICATION_FAILED]: "Payment verification failed. Please contact support.",
  WALLET_REJECTED: "Transaction was rejected in your wallet. Please try again.",
  WALLET_NOT_CONNECTED: "Please connect your wallet first.",
  UNSUPPORTED_NETWORK: "Please switch to a supported network.",
  NETWORK_ERROR: "A network error occurred. Please check your connection and try again.",
  INSUFFICIENT_FUNDS: "Insufficient funds in your wallet for this transaction.",
  TX_FAILED: "Transaction failed on-chain. Please try again.",
  TX_PENDING: "Transaction is pending. Please wait for confirmation.",
  HASH_ALREADY_USED: "This transaction hash has already been used for another payment.",
};

export type PaymentErrorSeverity = "error" | "warning" | "info";

export interface FormattedPaymentError {
  message: string;
  severity: PaymentErrorSeverity;
  actionable: boolean;
  retryable: boolean;
}

export const SEVERITY_MAP: Record<string, PaymentErrorSeverity> = {
  [ErrorCodes.INVALID_AMOUNT]: "warning",
  [ErrorCodes.INVALID_ADDRESS]: "error",
  [ErrorCodes.INVALID_CHAIN]: "warning",
  [ErrorCodes.INSUFFICIENT_CONFIRMATIONS]: "info",
  [ErrorCodes.TX_HASH_ALREADY_USED]: "error",
  [ErrorCodes.TX_NOT_FOUND]: "error",
  [ErrorCodes.AMOUNT_MISMATCH]: "error",
  [ErrorCodes.RECIPIENT_MISMATCH]: "error",
  [ErrorCodes.PAYMENT_EXPIRED]: "warning",
  [ErrorCodes.VERIFICATION_FAILED]: "error",
};

export function formatPaymentError(
  error: Error | { code?: string; message?: string } | string,
): FormattedPaymentError {
  const code = typeof error === "object" && error !== null && "code" in error
    ? (error as { code: string }).code
    : null;
  const message = typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : (error as { message?: string }).message ?? "An unexpected error occurred";

  const userMessage = code ? PAYMENT_ERROR_MESSAGES[code] ?? message : message;
  const severity = code ? SEVERITY_MAP[code] ?? "error" : "error";
  const actionable = severity !== "info";
  const retryable = ["warning", "info"].includes(severity);

  return { message: userMessage, severity, actionable, retryable };
}

export function isRetryableError(error: unknown): boolean {
  const formatted = formatPaymentError(
    error instanceof Error ? error : { message: String(error) },
  );
  return formatted.retryable;
}

export function shouldBlockPayment(errorCode: ErrorCode): boolean {
  const blockingCodes: ErrorCode[] = [
    ErrorCodes.INVALID_ADDRESS,
    ErrorCodes.TX_HASH_ALREADY_USED,
    ErrorCodes.RECIPIENT_MISMATCH,
    ErrorCodes.PAYMENT_EXPIRED,
    ErrorCodes.VERIFICATION_FAILED,
  ];
  return blockingCodes.includes(errorCode);
}
