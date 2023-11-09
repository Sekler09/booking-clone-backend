import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { RoomModule } from './room/room.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [AuthModule, UserModule, HotelModule, RoomModule, ReviewModule],
})
export class AppModule {}
