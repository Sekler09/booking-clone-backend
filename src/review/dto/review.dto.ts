import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ReviewDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  comment: string;

  @IsNumber()
  @Type(() => Number)
  @Max(5)
  @Min(0)
  rating: number;
}
