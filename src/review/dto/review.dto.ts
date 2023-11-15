import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'name of the reviewer',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'comment of the review',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  comment: string;

  @ApiProperty({
    description: 'rating of the review',
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Type(() => Number)
  @Max(5)
  @Min(0)
  rating: number;
}
