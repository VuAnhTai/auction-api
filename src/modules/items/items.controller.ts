import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '@/modules/auth/guard/auth.guard';
import { BidGuard } from './guard/bid.guard';
import { UsersService } from '../users/users.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard)
  @Get('')
  async findAll(@Req() req) {
    const { type } = req.query;
    const result = await this.itemsService.findAll(type);
    return result.map(item => {
      return {
        ...item,
        duration: item.endDate ? Math.round((+new Date(item.endDate) - Date.now()) / 1000) : 0,
      };
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req) {
    return await this.itemsService.findOne(req.params.id);
  }

  @UseGuards(AuthGuard)
  @Post('')
  async create(@Req() req) {
    return await this.itemsService.create(req.body);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req) {
    return await this.itemsService.update(req.params.id, req.body);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/publish')
  async publicItem(@Req() req) {
    return await this.itemsService.publishedItem(req.params.id);
  }

  @UseGuards(BidGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/bid')
  async bid(@Req() req) {
    const { user } = req;
    await this.usersService.checkBalance(user.id, req.body.amount);
    return await this.itemsService.bid(req.params.id, req.body, user);
  }
}
