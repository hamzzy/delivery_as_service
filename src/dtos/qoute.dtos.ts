import { ValidateNested } from '@/utils/util';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { Point } from 'geojson';

class Schema {
  @IsNotEmpty()
  @IsString()
  lat: number;

  @IsNotEmpty()
  @IsString()
  lng: number;
}

export class QouteDto {
  @ValidateNested(Schema)
  pick_up_location: Schema;

  @ValidateNested(Schema)
  drop_off_location: Schema;
}
