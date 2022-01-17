import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';
import { customerOrder } from './order.entity';
import { DateAudit } from './DateTime.entity';
import { Customer } from './users.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class DeliveryQuote extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  pick_up_location: Point;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  drop_off_location: Point;

  @Column()
  @IsNotEmpty()
  estimated_price: number;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer, customer => customer.quote)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => customerOrder, order => order.quote)
  order: customerOrder[];

  @Column(() => DateAudit)
  audit: DateAudit;
}
