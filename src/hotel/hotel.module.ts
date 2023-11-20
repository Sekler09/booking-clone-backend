import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { RoomModule } from 'src/room/room.module';
import { ReviewModule } from 'src/review/review.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { BookingModule } from 'src/booking/booking.module';

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
