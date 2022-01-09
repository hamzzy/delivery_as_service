import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { DateAudit } from './DateTime.entity';

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

  @Column(() => DateAudit)
  audit: DateAudit;
}
