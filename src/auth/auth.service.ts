import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { Token } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto, res: Response): Promise<Token> {
    const userExists = this.userService.findByEmail(dto.email);
    if (userExists)
      throw new ForbiddenException('User with this email is already exists');

    const hashPass = await this.hashData(dto.password);
    const newUser = this.userService.create({ ...dto, password: hashPass });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    res.cookie('refreshToken', tokens.refresh_token, {
      secure: true,
      httpOnly: true,
    });

    return { access_token: tokens.access_token };
  }

  async signin(dto: AuthDto, res: Response): Promise<Token> {
    const user = this.userService.findByEmail(dto.email);

    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches)
      throw new UnauthorizedException('Email or password is incorrect');

    const tokens = await this.getTokens(user.id, user.email);
    res.cookie('refreshToken', tokens.refresh_token, {
      secure: true,
      httpOnly: true,
    });

    return { access_token: tokens.access_token };
  }

  logout(res: Response) {
    res.clearCookie('refreshToken');
  }

  async refreshTokens(userId: number, res: Response) {
    const user = this.userService.findOne(userId);

    if (!user) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    res.cookie('refreshToken', tokens.refresh_token, {
      secure: true,
      httpOnly: true,
    });

    return { access_token: tokens.access_token };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
