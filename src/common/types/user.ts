import { Item } from '@/modules/items/item.entity';

export type UserUpdateAmount = {
  userId: number;
  amount: number;
  item: Item;
};
