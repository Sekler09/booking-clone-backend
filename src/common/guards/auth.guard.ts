import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomAuthGuard extends AuthGuard(['jwt', 'jwt-refresh']) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const accessToken = request.cookies['accessToken'];

      if (!accessToken) {
        throw new UnauthorizedException('Access token is not set');
      }

      const isValidAccessToken = await this.jwtService
        .verifyAsync(accessToken, { secret: 'at-secret' })
        .then((data) => {
          return isValidToken(data);
        })
        .catch(() => false);

      if (isValidAccessToken) {
        return this.activate(context);
      }

      const refreshToken = request.cookies['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      const isValidRefreshToken = await this.jwtService
        .verifyAsync(refreshToken, { secret: 'rt-secret' })
        .then((data) => {
          return isValidToken(data);
        })
        .catch(() => false);

      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Refresh token is not valid');
      }
      const userId = this.jwtService.decode(refreshToken).sub;
      const user = await this.userService.findOne({ id: userId });

      if (!user) {
        throw new UnauthorizedException('User not exists');
      }

      const tokens = await this.authService.getTokens(user.id, user.email);

      request.cookies['accessToken'] = tokens.accessToken;
      request.cookies['refreshToken'] = tokens.refreshToken;

      this.authService.setTokenCookies(response, tokens);

      return this.activate(context);
    } catch (err) {
      this.authService.clearTokenCookies(response);
      throw err;
    }
  }
  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}

function isValidToken(token: any) {
  const now = Date.now() / 1000;
  const tokenLifeTime = token.exp - token.iat;
  return token.exp - now > tokenLifeTime * 0.5;
}
