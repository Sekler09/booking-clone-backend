import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewService } from './service';
import { ReviewController } from './controller';
import { Review } from './entities/review';
import { UserModule } from 'src/user/module';
import { RoomModule } from 'src/room/module';

@Module({
  imports: [UserModule, RoomModule, TypeOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
