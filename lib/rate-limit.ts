type RateLimitConfig = {
  window: number;
  max: number;
};

const limits = new Map<string, { count: number; resetAt: number }>();

function getKey(identifier: string, endpoint: string): string {
  return `${identifier}:${endpoint}`;
}

export function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; retryAfter: number } {
  const key = getKey(identifier, endpoint);
  const now = Date.now();
  const entry = limits.get(key);

  if (!entry || now > entry.resetAt) {
    limits.set(key, { count: 1, resetAt: now + config.window });
    return { allowed: true, remaining: config.max - 1, retryAfter: 0 };
  }

  if (entry.count >= config.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { allowed: true, remaining: config.max - entry.count, retryAfter: 0 };
}

export const RATE_LIMITS = {
  login: { window: 15 * 60 * 1000, max: 5 },
  register: { window: 60 * 60 * 1000, max: 3 },
  forgotPassword: { window: 60 * 60 * 1000, max: 3 },
  resetPassword: { window: 15 * 60 * 1000, max: 3 },
  paymentVerify: { window: 10 * 60 * 1000, max: 10 },
  createOrder: { window: 60 * 60 * 1000, max: 10 },
  supportTicket: { window: 60 * 60 * 1000, max: 5 },
  adminGet: { window: 60 * 1000, max: 60 },
  adminPost: { window: 60 * 1000, max: 30 },
  default: { window: 60 * 1000, max: 100 },
} as const;
