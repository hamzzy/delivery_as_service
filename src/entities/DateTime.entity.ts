import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class DateTime {
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
