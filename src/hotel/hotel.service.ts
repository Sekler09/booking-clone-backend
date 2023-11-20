import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomService } from 'src/room/room.service';
import { ReviewService } from 'src/review/review.service';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';
import { GetAvailableHotelsQuery } from './dto/get-hotels.query.dto';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    private readonly roomService: RoomService,
    private readonly reviewService: ReviewService,
  ) {}

  async findAllAvailable({
    city,
    from,
    to,
    adults,
    children,
    rooms,
  }: GetAvailableHotelsQuery) {
    const hotelsInCity = await this.hotelsRepository.find({
      where: { city },
      relations: {
        rooms: true,
      },
    });

    const availableHotels = hotelsInCity.filter(async (hotel) => {
      const hotelRooms = await this.roomService.getAvailableRoomsByHotel(
        hotel.id,
        {
          from,
          to,
          adults,
          children,
          rooms,
        },
      );
      return hotelRooms.length;
    });

    const result = availableHotels.map(async (hotel) => ({
      ...hotel,
      reviews: await this.reviewService.getReviewsByHotel(hotel.id),
    }));
    return result;
  }

  async findAvailableById(
    id: number,
    queryFilters: Omit<GetAvailableHotelsQuery, 'city'>,
  ) {
    const hotel = await this.hotelsRepository.findOneBy({ id });
    if (!hotel) {
      throw new NotFoundException('no hotel with such id');
    }
    return {
      ...hotel,
      reviews: await this.reviewService.getReviewsByHotel(id),
      rooms: await this.roomService.getAvailableRoomsByHotel(id, queryFilters),
    };
  }

  bookRoom(id: number, roomId: number, userId: number, dto: BookRoomDto) {
    return this.roomService.book(roomId, id, userId, dto);
  }

  async postReview(id: number, roomId: number, userId: number, dto: ReviewDto) {
    const doesRoomExist = await this.roomService.doesRoomExist(id, roomId);
    if (!doesRoomExist) {
      throw new NotFoundException('Room does not exist');
    }
    return this.reviewService.postReview(roomId, userId, dto);
  }
}
