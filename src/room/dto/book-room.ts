import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

const DATE_STRING_PATTERN =
  /^(20[2-9][1-9])\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

export default class BookRoomDto {
  @ApiProperty({
    description: 'date from when room will be booked',
    example: '2023-11-23',
  })
  @IsString()
  @Matches(DATE_STRING_PATTERN)
  from: string;

  @ApiProperty({
    description: 'date to when room will be booked',
    example: '2023-11-24',
  })
  @IsString()
  @Matches(DATE_STRING_PATTERN)
  to: string;
}
