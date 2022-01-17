import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DateAudit } from './DateTime.entity';
import { customerOrder } from './order.entity';
import { RobotLocationHistory } from './robotMovement.entity';

@Entity()
export class Robot extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  availability: boolean;

  @OneToMany(() => customerOrder, order => order.robots)
  order: customerOrder[];

  @OneToMany(() => RobotLocationHistory, history => history.robot)
  history: RobotLocationHistory[];

  @Column(() => DateAudit)
  audit: DateAudit;
}
