import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DateAudit } from './DateTime.entity';
import { customerOrder } from './order.entity';
import { Point } from 'geojson';
import { Robot } from './robot.entity';

@Entity()
export class RobotLocationHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @ManyToOne(() => Robot, robot => robot.order)
  robot: Robot;

  @Column(() => DateAudit)
  audit: DateAudit;
}
