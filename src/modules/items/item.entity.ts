import { User } from '@/modules/users/user.entity';
import { StatusEnum, TypeEnum } from '@/common/enums';
import { ManyToOne } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base/base.entity';
import { History } from '../histories/history.entity';

@Entity()
export class Item extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startPrice: number;

  @Column()
  currentPrice: number;

  @Column({ nullable: true })
  startDate: Date | null;

  @Column({ nullable: true })
  endDate: Date | null;

  @Column()
  duration: number;

  @Column({ default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column({ default: TypeEnum.DRAFT })
  type: TypeEnum;

  @ManyToOne(() => User, user => user.items)
  owner: Partial<User>;

  @ManyToOne(() => History, history => history.item)
  histories: History[];
}
