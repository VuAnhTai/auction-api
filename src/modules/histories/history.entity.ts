import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base/base.entity';
import { User } from '../users/user.entity';
import { Item } from '../items/item.entity';

@Entity()
export class History extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  itemId: number;

  @ManyToOne(() => User, user => user.histories)
  user: Partial<User>;

  @ManyToOne(() => Item, item => item.histories)
  item: Partial<Item>;
}
