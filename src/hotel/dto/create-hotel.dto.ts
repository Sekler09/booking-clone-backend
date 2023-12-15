import { ApiProperty } from '@nestjs/swagger';
import { Hotel } from '../entities/hotel.entity';
import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHotelDto implements Omit<Hotel, 'id' | 'rooms'> {
  @ApiProperty({
    description: 'name of the hotel',
    example: 'Hotel Z',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: 'city where hotel locates',
    example: 'paris',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Transform(({ value }) => value.toLowerCase())
  city: string;

  @ApiProperty({
    description: 'address of the hotel',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  address: string;

  @ApiProperty({
    description: 'distance from hotel to the center of the city in km',
    example: 2,
  })
  @IsNumber()
  @Min(0)
  @Max(40)
  distance: number;

  @ApiProperty({
    description: 'url that stores hotel image',
    example: 'https://placehold.co/600x400',
  })
  @IsString()
  image: string;
}
