import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { UserService } from 'src/user/user.service';
import { Room } from 'src/room/entities/room.entity';

import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly userService: UserService,
  ) {}

  async isRoomAvailable(roomId: number, from: Date, to: Date) {
    const booking = await this.bookingRepository.findOne({
      where: [
        {
          room: {
            id: roomId,
          },
          startDate: Between(from, to),
        },
        {
          room: {
            id: roomId,
          },
          endDate: Between(from, to),
        },
      ],
    });

    return !!booking;
  }

  async book(room: Room, userId: number, from: Date, to: Date) {
    const isRoomAvailable = await this.isRoomAvailable(
      room.id,
      new Date(from),
      new Date(to),
    );

    if (!isRoomAvailable) {
      throw new ForbiddenException('room is already booked in this dates');
    }

    const booking = new Booking();
    booking.room = room;
    booking.user = await this.userService.findOne({ id: userId });
    booking.startDate = from;
    booking.endDate = to;

    await this.bookingRepository.save(booking);
  }
}
