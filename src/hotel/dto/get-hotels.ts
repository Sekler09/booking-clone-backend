import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class GetAvailableHotelsQuery {
  @ApiProperty({
    description: 'city where hotel locates',
    example: 'paris',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  city: string;

  @ApiProperty({
    description: 'Start date from which hotel is being wanted to be available',
    example: '2023-11-23',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  from: Date;

  @ApiProperty({
    description: 'End date before which hotel is being wanted to be available',
    example: '2023-11-25',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  to: Date;

  @ApiProperty({
    description: 'Number of adults that will book a hotel',
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  adults: number;

  @ApiProperty({
    description: 'Number of children that will book a hotel',
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  children: number;

  @ApiProperty({
    description: 'Number of rooms that will be booked in a hotel',
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rooms: number;

  @IsString()
  @IsOptional()
  search: string;
}
