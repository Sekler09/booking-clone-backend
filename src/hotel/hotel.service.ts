import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomService } from 'src/room/room.service';
import { ReviewService } from 'src/review/review.service';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';
import { GetAvailableHotelsQuery } from './dto/get-hotels.query.dto';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    private readonly roomService: RoomService,
    private readonly reviewService: ReviewService,
  ) {}

  async findAll({ withRooms } = { withRooms: false }) {
    const hotels = await this.hotelsRepository.find({
      relations: {
        rooms: withRooms,
      },
    });

    return hotels;
  }

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

    const availability = await Promise.all(
      hotelsInCity.map(async (hotel) => {
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
      }),
    );

    const availableHotels = hotelsInCity.filter((_, i) => availability[i]);

    const result = Promise.all(
      availableHotels.map(async (hotel) => ({
        ...hotel,
        reviews: await this.reviewService.getReviewsByHotel(hotel.id),
      })),
    );
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

  async bookRoom(id: number, roomId: number, userId: number, dto: BookRoomDto) {
    await this.roomService.book(roomId, id, userId, dto);
  }

  async postReview(id: number, roomId: number, userId: number, dto: ReviewDto) {
    const doesRoomExist = await this.roomService.doesRoomExist(id, roomId);
    if (!doesRoomExist) {
      throw new NotFoundException('Room does not exist');
    }
    return this.reviewService.postReview(roomId, userId, dto);
  }

  async deleteById(id: number) {
    const doesHotelExist = await this.hotelsRepository.exist({ where: { id } });
    if (!doesHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }

    await this.hotelsRepository.delete(id);
  }

  async createHotel(hotelDto: CreateHotelDto) {
    const isSameHotelExist = await this.hotelsRepository.findOne({
      where: [
        { city: hotelDto.city, address: hotelDto.address },
        { name: hotelDto.name },
        { image: hotelDto.image },
      ],
    });
    console.log(isSameHotelExist);
    if (isSameHotelExist) {
      throw new ForbiddenException('Hotel with same data already exists');
    }

    const newHotel = new Hotel();
    newHotel.address = hotelDto.address;
    newHotel.name = hotelDto.name;
    newHotel.city = hotelDto.city;
    newHotel.distance = hotelDto.distance;
    newHotel.image = hotelDto.image;

    await this.hotelsRepository.save(newHotel);
  }

  async updateHotel(id: number, data: CreateHotelDto) {
    const isHotelExist = await this.hotelsRepository.exist({ where: { id } });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }

    await this.hotelsRepository.update({ id }, data);
  }
}
