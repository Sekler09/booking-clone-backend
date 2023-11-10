import { IsString, Matches } from 'class-validator';

const DATE_STRING_PATTERN =
  /^(20[2-9][1-9])\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

export default class BookRoomDto {
  @IsString()
  @Matches(DATE_STRING_PATTERN)
  from: string;

  @IsString()
  @Matches(DATE_STRING_PATTERN)
  to: string;
}
