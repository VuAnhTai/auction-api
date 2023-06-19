import { User } from 'src/modules/users/user.entity';
import { StatusEnum, TypeEnum } from '@/common/enums';
import { ManyToOne } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base/base.entity';

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

  @Column({ nullable: true })
  ownerId: number;

  @ManyToOne(() => User, user => user.items)
  owner: Partial<User>;
}
