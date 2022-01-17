import { CustomerApi } from '@/interfaces/users.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { DateAudit } from './DateTime.entity';
import { Customer } from './users.entity';

@Entity()
export class CustomerApiKey extends BaseEntity implements CustomerApi {
  customeId: any;
  @PrimaryGeneratedColumn('uuid')
  public id: string;

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

  @Column(() => DateAudit)
  audit: DateAudit;
}
