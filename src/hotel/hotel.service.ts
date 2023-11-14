import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Hotel, hotelsDb } from './entities/hotel.entity';
import { RoomService } from 'src/room/room.service';
import { ReviewService } from 'src/review/review.service';
import { HotelDto } from './dto/hotel.dto';
import { GetAvailableHotelsQuery } from './entities/get-hotels-query.entity';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';

@Injectable()
export class HotelService {
  constructor(
    private readonly roomService: RoomService,
    private readonly reviewService: ReviewService,
  ) {}
  private hotels: Hotel[] = [...hotelsDb];

  findAllAvailable({
    city,
    from,
    to,
    adults,
    children,
    rooms,
  }: GetAvailableHotelsQuery): HotelDto[] {
    const hotelsInCity = this.hotels.filter((hotel) => hotel.city === city);

    const availableHotels = hotelsInCity.filter((hotel) => {
      const hotelRooms = this.roomService.getAvailableRoomsByHotel(hotel.id, {
        from,
        to,
        adults,
        children,
        rooms,
      });
      return hotelRooms.length;
    });

    return availableHotels.map((hotel) => ({
      ...hotel,
      reviews: this.reviewService.getReviewsByHotel(hotel.id),
      rooms: this.roomService.getRoomsByHotel(hotel.id),
    }));
  }

  findAvailableById(
    id: number,
    queryFilters: Omit<GetAvailableHotelsQuery, 'city'>,
  ) {
    const hotel = this.hotels.find((hotel) => hotel.id === id);
    if (!hotel) {
      throw new BadRequestException('no hotel with such id');
    }
    return {
      ...hotel,
      reviews: this.reviewService.getReviewsByHotel(hotel.id),
      rooms: this.roomService.getAvailableRoomsByHotel(hotel.id, queryFilters),
    };
  }

  bookRoom(id: number, roomId: number, dto: BookRoomDto) {
    return this.roomService.book(roomId, id, dto);
  }

  postReview(id: number, roomId: number, dto: ReviewDto) {
    if (!this.roomService.doesRoomExist(id, roomId)) {
      throw new NotFoundException('Room does not exist');
    }

    return this.reviewService.postReview(id, roomId, dto);
  }
}
