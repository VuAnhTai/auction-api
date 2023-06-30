import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { History } from '../histories/history.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT } from '@/common/constants';
import { UserUpdateAmount } from '@/common/types/user';
import { Item } from '../items/item.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    private eventEmitter: EventEmitter2
  ) {}

  async depositMoney(id: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    user.amount += +amount;
    return this.userRepository.save(user);
  }

  async drawMoney(id: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (user.amount < amount) {
      throw new BadRequestException('Amount must be less than user amount');
    }

    user.amount -= amount;
    return this.userRepository.save(user);
  }

  async checkBalance(id: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user.amount < amount) {
      throw new BadRequestException('Amount must be less than user amount');
    }

    return true;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async updateAmount(payload: UserUpdateAmount) {
    const { userId, amount, item } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const history = await this.historyRepository.findOne({
      where: { userId: userId, itemId: item.id },
      order: { createdAt: 'DESC' },
    });
    let oldAmount = 0;
    if (history) {
      oldAmount = history.amount || 0;
    }

    user.amount = user.amount - +amount + oldAmount;

    const result = await this.userRepository.save(user);

    this.eventEmitter.emit(EVENT.HISTORY.CREATED, {
      user: result,
      amount: +amount,
      item,
    });

    return result;
  }

  async restoreAmount(payload: UserUpdateAmount) {
    const { userId, amount, item } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.amount = user.amount + amount;
    const result = await this.userRepository.save(user);

    this.eventEmitter.emit(EVENT.HISTORY.CREATED, {
      user: result,
      amount: amount,
      item,
    });

    return result;
  }
}
