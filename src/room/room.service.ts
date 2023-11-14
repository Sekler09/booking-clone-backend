import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Room, roomsDb } from './entities/room.entity';
import { GetAvailableHotelsQuery } from 'src/hotel/entities/get-hotels-query.entity';
import BookRoomDto from './dto/book-room.dto';

@Injectable()
export class RoomService {
  private rooms: Room[] = [...roomsDb];
  getRoomsByHotel(hotelId: number): Room[] {
    return this.rooms.filter((room) => room.hotelId === hotelId);
  }

  getAvailableRoomsByHotel(
    hotelId: number,
    {
      from,
      to,
      children,
      adults,
      rooms,
    }: Omit<GetAvailableHotelsQuery, 'city'>,
  ): Room[] {
    const hotelRooms = this.getRoomsByHotel(hotelId);

    if (
      checkRoomsAvailability(hotelRooms, from, to, children + adults, rooms)
    ) {
      const availableRooms = hotelRooms.filter(
        (room) =>
          !room.bookedDates.find(
            (date) =>
              new Date(date) >= new Date(from) &&
              new Date(date) <= new Date(to),
          ),
      );

      if (rooms === 1) {
        return availableRooms.filter(
          (room) => room.capacity >= children + adults,
        );
      }

      return availableRooms;
    }
    return [];
  }

  book(roomId: number, hotelId: number, { from, to }: BookRoomDto) {
    const room = this.rooms.find(
      (room) => room.id === roomId && room.hotelId === hotelId,
    );

    if (!room) {
      throw new NotFoundException('this room not exists');
    }

    const isRoomAvailable = !room.bookedDates.find(
      (date) =>
        new Date(date) >= new Date(from) && new Date(date) <= new Date(to),
    );

    if (!isRoomAvailable) {
      throw new ForbiddenException('room is already booked in this dates');
    }

    room.bookedDates.push(...[from, to]);
  }

  doesRoomExist(hotelId: number, roomId: number) {
    return !!this.getRoomsByHotel(hotelId).find((room) => room.id === roomId);
  }
}

function checkRoomsAvailability(rooms, from, to, capacity, count) {
  if (rooms.length < count) {
    return false;
  }

  const availableRooms = rooms.filter(
    (room) =>
      !room.bookedDates.find(
        (date) => new Date(date) >= from && new Date(date) <= to,
      ),
  );

  if (availableRooms.length < count) {
    return false;
  }

  return (
    availableRooms
      .sort((a, b) => b.capacity - a.capacity)
      .slice(0, count)
      .reduce((sum, room) => sum + room.capacity, 0) >= capacity
  );
}
