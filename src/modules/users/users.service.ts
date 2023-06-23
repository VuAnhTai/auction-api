import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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

  async checkBalance(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user.amount;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
}
