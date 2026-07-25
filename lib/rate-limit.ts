import { Redis } from "@upstash/redis";

type RateLimitConfig = {
  window: number;
  max: number;
};

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
    })
  : null;

function getKey(identifier: string, endpoint: string): string {
  return `ratelimit:${identifier}:${endpoint}`;
}

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig,
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  if (!redis) return { allowed: true, remaining: config.max, retryAfter: 0 };

  const key = getKey(identifier, endpoint);
  const windowMs = config.window;
  const now = Date.now();

  const raw = await redis.get<{ count: number; resetAt: number }>(key);

  if (!raw || now > raw.resetAt) {
    await redis.set(key, { count: 1, resetAt: now + windowMs }, { ex: Math.ceil(windowMs / 1000) });
    return { allowed: true, remaining: config.max - 1, retryAfter: 0 };
  }

  if (raw.count >= config.max) {
    const retryAfter = Math.ceil((raw.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  await redis.set(key, { count: raw.count + 1, resetAt: raw.resetAt }, { ex: Math.ceil((raw.resetAt - now) / 1000) });
  return { allowed: true, remaining: config.max - raw.count - 1, retryAfter: 0 };
}

export function clearRateLimits() {
  // No-op: Redis-backed rate limits don't need client-side clearing
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