import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class RateLimiterService {
  time = 5000;
  constructor(time?: number) {
    this.resetRateLimits();
    this.time = time || 5000;
  }

  private rateLimits: Map<string, number> = new Map();

  public checkRateLimit(key: string): boolean {
    const now = Date.now();

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, now);
      return true;
    }

    const lastRequestTime = this.rateLimits.get(key);
    const elapsed = now - lastRequestTime;

    if (elapsed < this.time) {
      return false; // Rate limit exceeded
    }

    this.rateLimits.set(key, now);
    return true;
  }

  @Interval(1000) // Reset rate limits every second
  private resetRateLimits() {
    const now = Date.now();

    for (const [key, lastRequestTime] of this.rateLimits.entries()) {
      const elapsed = now - lastRequestTime;

      if (elapsed >= this.time) {
        this.rateLimits.delete(key);
      }
    }
  }
}
