import "server-only";

const WINDOW_MS = 60_000;

type CounterEntry = { count: number; resetAt: number };

const counters = new Map<string, CounterEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const entry = counters.get(key);

  if (!entry || now >= entry.resetAt) {
    counters.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + WINDOW_MS };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of counters) {
    if (now >= entry.resetAt) counters.delete(key);
  }
}, 120_000).unref();
