import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  udpatetAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
