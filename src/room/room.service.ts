import { Injectable } from '@nestjs/common';
import { Room, roomsDb } from './entities/room.entity';
import { GetAvailableHotelsQuery } from 'src/hotel/entities/get-hotels-query.entity';

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
          (room) => room.capacity === children + adults,
        );
      }
      return availableRooms;
    }
    return [];
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
