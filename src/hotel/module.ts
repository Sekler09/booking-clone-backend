import { Module } from '@nestjs/common';
import { HotelService } from './service';
import { HotelController } from './controller';
import { RoomModule } from 'src/room/module';
import { ReviewModule } from 'src/review/module';
import { UserModule } from 'src/user/module';
import { AuthModule } from 'src/auth/module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel';
import { BookingModule } from 'src/booking/module';

@Module({
  imports: [
    RoomModule,
    ReviewModule,
    UserModule,
    BookingModule,
    AuthModule,
    JwtModule,
    TypeOrmModule.forFeature([Hotel]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
