export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
}

export class InMemoryRateLimiter {
  private readonly clients = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly config: RateLimiterConfig = {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minuto
    }
  ) {}

  public async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.clients.get(identifier);

    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.config.windowMs;
      this.clients.set(identifier, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTimeMs: resetAt,
      };
    }

    if (entry.count < this.config.maxRequests) {
      entry.count += 1;
      return {
        allowed: true,
        remaining: this.config.maxRequests - entry.count,
        resetTimeMs: entry.resetAt,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTimeMs: entry.resetAt,
    };
  }
}
