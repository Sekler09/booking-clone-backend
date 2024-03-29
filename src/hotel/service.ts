import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { RoomService } from 'src/room/service';
import { ReviewService } from 'src/review/service';
import BookRoomDto from 'src/room/dto/book-room';
import { ReviewDto } from 'src/review/dto/review';
import { GetAvailableHotelsQuery } from './dto/get-hotels';
import { Hotel } from './entities/hotel';
import { CreateHotelDto } from './dto/create-hotel';
import { CreateRoomDto } from 'src/room/dto/create-room';
import { UserService } from 'src/user/service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    private readonly roomService: RoomService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  async findAll(
    { withRooms, search, sort } = { withRooms: false, search: '', sort: '' },
  ) {
    const [field, order] = sort ? sort.split('.') : ['id', 'asc'];
    const hotels = await this.hotelsRepository.find({
      where: {
        name: ILike(`%${search}%`),
      },
      relations: {
        rooms: withRooms,
      },
      order: {
        [field]: order,
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
    const user = await this.userService.findOne({ id: userId });
    await this.roomService.book(roomId, id, user, dto);
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

    if (isSameHotelExist) {
      throw new ForbiddenException('Hotel with same data already exists');
    }

    await this.hotelsRepository.save(hotelDto);
  }

  async updateHotel(id: number, data: CreateHotelDto) {
    const isHotelExist = await this.hotelsRepository.exist({ where: { id } });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }

    await this.hotelsRepository.update({ id }, data);
  }

  async getHotelRooms(id: number, search: string, sort: string) {
    const isHotelExist = await this.hotelsRepository.exist({ where: { id } });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }

    return this.roomService.getRoomsByHotel(id, sort, search, {
      reviews: true,
    });
  }

  async addRoom(hotelId: number, dto: CreateRoomDto) {
    const hotel = await this.hotelsRepository.findOneBy({ id: hotelId });
    if (!hotel) {
      throw new NotFoundException('Hotel does not exist');
    }

    await this.roomService.createRoom(hotel, dto);
  }

  async updateRoom(hotelId: number, roomId: number, dto: CreateRoomDto) {
    const isHotelExist = await this.hotelsRepository.exist({
      where: { id: hotelId },
    });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }
    const isRoomExist = await this.roomService.doesRoomExist(hotelId, roomId);
    if (!isRoomExist) {
      throw new NotFoundException('Room does not exist');
    }
    await this.roomService.updateRoom(roomId, dto);
  }

  async deleteRoom(hotelId: number, roomId: number) {
    const isHotelExist = await this.hotelsRepository.exist({
      where: { id: hotelId },
    });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }
    const isRoomExist = await this.roomService.doesRoomExist(hotelId, roomId);
    if (!isRoomExist) {
      throw new NotFoundException('Room does not exist');
    }
    await this.roomService.deleteRoom(roomId);
  }

  async getRoomReviews(
    hotelId: number,
    roomId: number,
    search = '',
    sort = '',
  ) {
    const isHotelExist = await this.hotelsRepository.exist({
      where: { id: hotelId },
    });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }
    const isRoomExist = await this.roomService.doesRoomExist(hotelId, roomId);
    if (!isRoomExist) {
      throw new NotFoundException('Room does not exist');
    }
    return await this.reviewService.getReviewByRoom(roomId, search, sort);
  }

  async deleteRoomReview(hotelId: number, roomId: number, reviewId: number) {
    const isHotelExist = await this.hotelsRepository.exist({
      where: { id: hotelId },
    });
    if (!isHotelExist) {
      throw new NotFoundException('Hotel does not exist');
    }
    const isRoomExist = await this.roomService.doesRoomExist(hotelId, roomId);
    if (!isRoomExist) {
      throw new NotFoundException('Room does not exist');
    }

    const isReviewExist = await this.reviewService.isReviewExist(
      roomId,
      reviewId,
    );

    if (!isReviewExist) {
      throw new NotFoundException('Review does not exist');
    }

    await this.reviewService.deleteReview(reviewId);
  }
}
