import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { RoomModule } from './room/room.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HotelModule,
    RoomModule,
    ReviewModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/entities/*.entity.js'],
      }),
      inject: [ConfigService],
    }),
    BookingModule,
  ],
})
export class AppModule {}
