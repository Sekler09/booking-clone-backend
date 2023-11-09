import { Request } from 'express';

export default function cookieExtractor(cookieName: string) {
  return (req: Request) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[cookieName];
    }
    return token;
  };
}
