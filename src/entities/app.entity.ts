import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { DateTime } from './DateTime.entity';
import { Customer } from './users.entity';

@Entity()
export class CustomerApiKey extends DateTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  apiKey: string;

  @OneToOne(() => Customer, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;
}
