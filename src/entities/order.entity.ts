import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';
import { DeliveryQuote } from './quote.entity';
import { Robot } from './robot.entity';
import { DateAudit } from './DateTime.entity';
import { IsNotEmpty } from 'class-validator';
import { Customer } from './users.entity';

@Entity()
export class customerOrder extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  reciever_name: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsNotEmpty()
  country: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @ManyToOne(() => DeliveryQuote, qoute => qoute.order, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quote: DeliveryQuote;

  @ManyToOne(() => Customer, customer => customer.orders)
  customers: Customer;

  @ManyToOne(() => Robot, robot => robot.order)
  robots: Robot;

  @Column(() => DateAudit)
  audit: DateAudit;
}
