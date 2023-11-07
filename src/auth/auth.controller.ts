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

import { RtGuard } from 'src/common/guards/rt.guard';
import { AtGuard } from 'src/common/guards/at.guard';

import { Tokens } from './types/tokens.type';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signup(dto, res);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signin(dto, res);
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('sub') userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, res);
  }

  @Get('profile')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser('sub') userId: number): User {
    return this.authService.getProfile(userId);
  }
}
