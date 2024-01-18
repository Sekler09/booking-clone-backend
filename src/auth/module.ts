import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { AuthController } from './controller';
import { UserModule } from 'src/user/module';
import { RtStrategy } from './strategy/rt';
import { AtStrategy } from './strategy/at';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy, AtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
