import { Injectable } from '@nestjs/common';
import { Room, roomsDb } from './entities/room.entity';

@Injectable()
export class RoomService {
  private rooms: Room[] = [...roomsDb];
  getRoomsByHotel(hotelId: number) {
    return this.rooms.filter((room) => room.hotelId === hotelId);
  }
}
