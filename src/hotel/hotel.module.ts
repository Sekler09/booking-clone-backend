import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { RoomModule } from 'src/room/room.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [RoomModule, ReviewModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
