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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Tokens } from './types/tokens.type';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.signup(dto, res);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns tokens if user exists' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User exists' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User tokens are cleared',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('profile')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile returned',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized',
  })
  getProfile(@GetCurrentUser('sub') userId: number): User {
    return this.authService.getProfile(userId);
  }
}
