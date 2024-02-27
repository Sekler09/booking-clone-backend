import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAvailableHotelsQuery } from 'src/hotel/dto/get-hotels';
import { BookingService } from 'src/booking/service';

import BookRoomDto from './dto/book-room';
import { Room } from './entities/room';
import { CreateRoomDto } from './dto/create-room';
import { Hotel } from 'src/hotel/entities/hotel';
import { User } from 'src/user/entities/user';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private readonly bookingService: BookingService,
  ) {}

  findOne(opts: Partial<Omit<Room, 'reviews'>>) {
    return this.roomsRepository.findOneBy(opts);
  }

  async getRoomsByHotel(hotelId: number, relations = {}): Promise<Room[]> {
    return this.roomsRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
      },
      relations,
    });
  }

  async getAvailableRoomsByHotel(
    hotelId: number,
    {
      from,
      to,
      children,
      adults,
      rooms,
    }: Omit<GetAvailableHotelsQuery, 'city'>,
  ): Promise<Room[]> {
    const hotelRooms = await this.getRoomsByHotel(hotelId);

    if (hotelRooms.length < rooms) {
      return [];
    }

    const availability = await Promise.all(
      hotelRooms.map(
        async (room) =>
          await this.bookingService.isRoomAvailable(room.id, from, to),
      ),
    );

    const availableRooms = hotelRooms.filter((_, i) => availability[i]);

    if (availableRooms.length < rooms) {
      return [];
    }

    if (
      availableRooms
        .sort((a, b) => b.capacity - a.capacity)
        .slice(0, rooms)
        .reduce((sum, room) => sum + room.capacity, 0) >=
      children + adults
    ) {
      if (rooms === 1) {
        return availableRooms.filter(
          (room) => room.capacity >= children + adults,
        );
      }
      return availableRooms;
    }

    return [];
  }

  async book(
    roomId: number,
    hotelId: number,
    user: User,
    { from, to }: BookRoomDto,
  ) {
    const room = await this.roomsRepository.findOne({
      where: {
        id: roomId,
        hotel: {
          id: hotelId,
        },
      },
    });

    if (!room) {
      throw new NotFoundException('this room not exists');
    }

    await this.bookingService.book(room, user, new Date(from), new Date(to));
  }

  doesRoomExist(hotelId: number, roomId: number) {
    return this.roomsRepository.exist({
      where: {
        id: roomId,
        hotel: {
          id: hotelId,
        },
      },
    });
  }

  async createRoom(hotel: Hotel, dto: CreateRoomDto) {
    await this.roomsRepository.save({ hotel, ...dto });
  }

  async updateRoom(roomId: number, dto: CreateRoomDto) {
    await this.roomsRepository.update({ id: roomId }, dto);
  }

  async deleteRoom(roomId: number) {
    await this.roomsRepository.delete(roomId);
  }
}
