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
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto, res: Response): Promise<Tokens> {
    const userExists = this.userService.findByEmail(dto.email);
    if (userExists) {
      throw new ForbiddenException('User with this email is already exists');
    }

    const hashPass = await this.hashData(dto.password);
    const newUser = this.userService.create({ ...dto, password: hashPass });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    this.setTokenCookies(res, tokens);

    return tokens;
  }

  async signin(dto: AuthDto, res: Response): Promise<Tokens> {
    const user = this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);
    this.setTokenCookies(res, tokens);

    return tokens;
  }

  logout(res: Response) {
    res.clearCookie('refreshToken', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      path: '/',
    });
    res.clearCookie('accessToken', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 15, // 15min
      path: '/',
    });
  }

  async refreshTokens(userId: number, res: Response): Promise<Tokens> {
    const user = this.userService.findOne(userId);

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    this.setTokenCookies(res, tokens);

    return tokens;
  }

  getProfile(userId: number) {
    return this.userService.findOne(userId);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 15,
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
      accessToken,
      refreshToken,
    };
  }

  setTokenCookies(res: Response, tokens: Tokens) {
    res.cookie('refreshToken', tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      path: '/',
    });
    res.cookie('accessToken', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 15, // 15min
      path: '/',
    });
  }
}
