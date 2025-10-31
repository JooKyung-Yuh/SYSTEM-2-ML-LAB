/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based solution like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetAt < now) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Check if the request should be rate limited
   * @param identifier - Unique identifier (e.g., IP address, user ID)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with success status and remaining requests
   */
  async check(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetAt < now) {
      // Create new entry
      const resetAt = now + windowMs;
      this.store.set(identifier, { count: 1, resetAt });
      return { success: true, remaining: limit - 1, reset: resetAt };
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return { success: false, remaining: 0, reset: entry.resetAt };
    }

    // Increment count
    entry.count++;
    return { success: true, remaining: limit - entry.count, reset: entry.resetAt };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Clear all rate limit entries
   */
  clearAll(): void {
    this.store.clear();
  }

  /**
   * Stop the cleanup interval (for graceful shutdown)
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Helper function to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for production with proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';
  return ip.trim();
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Strict rate limit for login attempts (prevent brute force)
  login: async (identifier: string) =>
    rateLimiter.check(identifier, 5, 15 * 60 * 1000), // 5 requests per 15 minutes

  // Moderate rate limit for file uploads
  upload: async (identifier: string) =>
    rateLimiter.check(identifier, 10, 60 * 1000), // 10 requests per minute

  // Standard rate limit for API routes
  api: async (identifier: string) =>
    rateLimiter.check(identifier, 100, 60 * 1000), // 100 requests per minute

  // Relaxed rate limit for public endpoints
  public: async (identifier: string) =>
    rateLimiter.check(identifier, 200, 60 * 1000), // 200 requests per minute
};
