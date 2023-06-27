import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { UsersService } from './users.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT } from '@/common/constants';
import { UserUpdateAmount } from '@/common/types/user';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const { user } = req;
    const userProfile = await this.userService.getProfile(user.id);

    return {
      id: userProfile.id,
      email: userProfile.email,
      amount: userProfile.amount,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('deposit')
  async deposit(@Req() req, @Body() body) {
    const { amount } = body;
    const { user } = req;

    if (!amount) {
      throw new HttpException('Amount is required', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.userService.depositMoney(user.id, amount);

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        amount: updatedUser.amount,
      },
    };
  }

  @OnEvent(EVENT.USER.UPDATE_AMOUNT)
  handleUserUpdateAmount(payload: UserUpdateAmount) {
    this.userService.updateAmount(payload);
  }

  @OnEvent(EVENT.USER.RESTORE_AMOUNT)
  handleUserRestoreAmount(payload: UserUpdateAmount) {
    this.userService.restoreAmount(payload);
  }
}
