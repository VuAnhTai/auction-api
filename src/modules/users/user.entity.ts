import { StatusEnum } from '@/common/enums';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Item } from '@/modules/items/item.entity';
import { History } from '@/modules/histories/history.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 0 })
  @Exclude()
  amount: number;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  udpatetAt: Date;

  @Column({ default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @OneToMany(() => Item, item => item.owner)
  items: Item[];

  @OneToMany(() => History, history => history.user)
  histories: History[];
}
