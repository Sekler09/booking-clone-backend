import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
};

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  console.log(token);
  return token;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: 'rt-secret',
    });
  }

  validate(payload: JwtPayload) {
    console.log(payload);
    return payload;
  }
}
