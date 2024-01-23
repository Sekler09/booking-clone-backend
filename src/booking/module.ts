import { Module } from '@nestjs/common';
import { BookingService } from './service';
import { BookingController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking';
import { UserModule } from 'src/user/module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
