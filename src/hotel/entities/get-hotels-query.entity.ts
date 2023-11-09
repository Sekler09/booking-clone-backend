import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetHotelsQuery {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  city: string;

  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;

  @IsNumber()
  @Type(() => Number)
  adults: number;

  @IsNumber()
  @Type(() => Number)
  children: number;

  @IsNumber()
  @Type(() => Number)
  rooms: number;
}
