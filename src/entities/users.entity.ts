import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';
import { User } from '@interfaces/users.interface';
import { DateTime } from './DateTime.entity';

@Entity()
export class Customer extends DateTime implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;
}
