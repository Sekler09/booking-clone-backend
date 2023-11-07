import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import cookieExtractor from './extractors/cookie.extractor';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor('accessToken'),
      secretOrKey: 'at-secret',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
