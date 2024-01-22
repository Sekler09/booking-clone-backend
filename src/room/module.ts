import { Module } from '@nestjs/common';
import { RoomService } from './service';
import { RoomController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room';
import { BookingModule } from 'src/booking/module';

@Module({
  imports: [BookingModule, TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
