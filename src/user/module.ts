import { Module } from '@nestjs/common';

import { UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { BookingModule } from 'src/booking/module';
import { UsersController } from './controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/service';

@Module({
  imports: [BookingModule, JwtModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
