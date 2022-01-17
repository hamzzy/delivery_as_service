import { IsNotEmpty, IsString } from 'class-validator';

export class CancelOrderDto {
  @IsNotEmpty()
  order_id: string;
}
