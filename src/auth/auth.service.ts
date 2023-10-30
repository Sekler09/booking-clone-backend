import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  signin(dto: AuthDto) {
    const user = this.userService.findByEmail(dto.email);

    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');

    if (dto.password !== user.password)
      throw new UnauthorizedException('Email or password is incorrect');

    return user;
  }

  signup(dto: AuthDto) {
    const user = this.userService.findByEmail(dto.email);
    if (user)
      throw new UnauthorizedException('User with this email is already exists');

    this.userService.create(dto);
  }
}
