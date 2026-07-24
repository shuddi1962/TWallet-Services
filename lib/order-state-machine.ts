export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["processing", "cancelled", "failed"],
  processing: ["paid", "cancelled", "failed"],
  paid: ["shipping", "refunded"],
  shipping: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
  failed: ["pending"],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionOrder(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid transition from "${from}" to "${to}"`);
  }
  return to;
}

export const DISPLAY_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

export function getAvailableTransitions(status: OrderStatus): OrderStatus[] {
  return [...TRANSITIONS[status]];
}

export const TERMINAL_STATES: readonly OrderStatus[] = [
  "delivered",
  "cancelled",
  "refunded",
] as const;

export function isTerminal(status: OrderStatus): boolean {
  return (TERMINAL_STATES as readonly string[]).includes(status);
}

export const PAYMENT_REQUIRED_STATES: readonly OrderStatus[] = ["pending", "processing"] as const;

export function requiresPayment(status: OrderStatus): boolean {
  return (PAYMENT_REQUIRED_STATES as readonly string[]).includes(status);
}
