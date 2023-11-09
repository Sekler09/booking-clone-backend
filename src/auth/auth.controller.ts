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

import { Tokens } from './types/tokens.type';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CustomAuthGuard } from '../common/guards/auth.guard';

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
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('profile')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser('sub') userId: number): User {
    return this.authService.getProfile(userId);
  }
}
