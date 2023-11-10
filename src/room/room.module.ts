import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
  imports: [UserModule, AuthModule, JwtModule],
})
export class RoomModule {}
