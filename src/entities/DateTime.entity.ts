import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateAudit {
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
  
}
