import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({
    description: 'access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'refresh token',
  })
  refreshToken: string;
}
