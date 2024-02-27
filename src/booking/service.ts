import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';

import { Room } from 'src/room/entities/room';

import { Booking } from './entities/booking';
import { User } from 'src/user/entities/user';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
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

    return !booking;
  }

  async book(room: Room, user: User, from: Date, to: Date) {
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
    booking.user = user;
    booking.startDate = from;
    booking.endDate = to;

    await this.bookingRepository.save(booking);
  }

  getUserBookings(id: number) {
    return this.bookingRepository.find({
      where: {
        user: { id },
        startDate: MoreThanOrEqual(new Date()),
      },
      relations: {
        room: {
          hotel: true,
        },
      },
      select: {
        room: {
          hotel: {
            name: true,
            city: true,
          },
          price: true,
        },
        startDate: true,
        endDate: true,
        id: true,
      },
    });
  }

  async cancelUserBooking(userId: number, bookingId: number) {
    const isBookingExists = await this.bookingRepository.exist({
      where: {
        id: bookingId,
        user: {
          id: userId,
        },
      },
    });

    if (!isBookingExists) {
      throw new NotFoundException('Such booking does not exist');
    }

    await this.bookingRepository.delete({ id: bookingId });
  }
}
