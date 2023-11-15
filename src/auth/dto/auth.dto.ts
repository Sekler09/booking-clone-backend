import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    name: 'email',
    description: 'email of the user',
    minLength: 1,
    example: 'example@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'password of the user',
    minLength: 1,
    example: '1234567',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
