import { BadRequestException, Injectable } from '@nestjs/common';
import { Hotel, hotelsDb } from './entities/hotel.entity';
import { RoomService } from 'src/room/room.service';
import { ReviewService } from 'src/review/review.service';
import { HotelDto } from './dto/hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    private readonly roomService: RoomService,
    private readonly reviewService: ReviewService,
  ) {}
  private hotels: Hotel[] = [...hotelsDb];

  findAvailable(
    city: string,
    from: Date,
    to: Date,
    capacity: number,
    count: number,
  ): HotelDto[] {
    const hotelsInCity = this.hotels.filter((hotel) => hotel.city === city);

    const availableHotels = hotelsInCity.filter((hotel) => {
      const rooms = this.roomService.getRoomsByHotel(hotel.id);
      return checkRoomsAvailability(rooms, from, to, capacity, count);
    });

    return availableHotels.map((hotel) => ({
      ...hotel,
      reviews: this.reviewService.getReviewsByHotel(hotel.id),
      rooms: this.roomService.getRoomsByHotel(hotel.id),
    }));
  }

  findById(id: number) {
    const hotel = this.hotels.find((hotel) => hotel.id === id);
    if (!hotel) {
      throw new BadRequestException('no hotel with such id');
    }
    return {
      ...hotel,
      reviews: this.reviewService.getReviewsByHotel(hotel.id),
      rooms: this.roomService.getRoomsByHotel(hotel.id),
    };
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
