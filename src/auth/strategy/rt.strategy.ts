import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import cookieExtractor from './extractors/cookie.extractor';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor('refreshToken'),
      secretOrKey: 'rt-secret',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
