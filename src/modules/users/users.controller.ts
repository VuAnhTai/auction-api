import { Body, Controller, HttpException, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

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
}
