import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Tokens } from './entities/tokens.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CustomAuthGuard } from '../common/guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates the user and returns tokens' })
  @ApiCreatedResponse({
    description: 'User created',
    type: Tokens,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signup(dto, res);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns tokens if user exists' })
  @ApiOkResponse({ description: 'User exists', type: Tokens })
  @ApiUnauthorizedResponse({
    description: 'User not exists',
  })
  signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signin(dto, res);
  }

  @Post('logout')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clears user tokens' })
  @ApiOkResponse({
    description: 'User tokens are cleared',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('profile')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns user profile' })
  @ApiOkResponse({
    description: 'User profile returned',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized',
  })
  getProfile(@GetCurrentUser('sub') userId: number): Promise<User> {
    return this.authService.getProfile(userId);
  }
}
