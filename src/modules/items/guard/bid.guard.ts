import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import ThrottleUtil from 'src/common/utils/throttle.util';

@Injectable()
export class BidGuard implements CanActivate {
  private readonly throttleUtil = new ThrottleUtil(10000);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // Assuming there's a user object on the request
    const itemId = req.params.id;

    // Check if user has already bid on item within the last 5 seconds
    const key = `${user.id}-${itemId}`;
    const canBid = await this.throttleUtil.tryAcquire(key);
    return canBid;
  }
}
