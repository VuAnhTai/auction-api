import { RateLimiterService } from '@/modules/base/rateLimit.service';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class BidGuard implements CanActivate {
  rateLimiterService: RateLimiterService;
  constructor() {
    this.rateLimiterService = new RateLimiterService(10000);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // Assuming there's a user object on the request
    const itemId = req.params.id;

    // Check if user has already bid on item within the last 5 seconds
    const key = `${user.id}-${itemId}`;
    const allowed = this.rateLimiterService.checkRateLimit(key);

    if (!allowed) {
      throw new HttpException('Rate limit exceeded', 429);
    }

    return allowed;
  }
}
