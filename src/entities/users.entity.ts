import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { DateAudit } from './DateTime.entity';
import { DeliveryQuote } from './quote.entity';
import { customerOrder } from './order.entity';

@Entity()
export class Customer extends BaseEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => DeliveryQuote, quote => quote.customer)
  quote: DeliveryQuote[];

  @OneToMany(() => customerOrder, order => order.customers)
  orders: customerOrder[];

  @Column(() => DateAudit)
  audit: DateAudit;
}
