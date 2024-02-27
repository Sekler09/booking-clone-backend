import { Injectable } from '@nestjs/common';
import { Review } from './entities/review';
import { ReviewDto } from './dto/review';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { UserService } from 'src/user/service';
import { RoomService } from 'src/room/service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  async getAverageRatingByHotel(hotelId: number) {
    const hotelReviews = await this.getReviewsByHotel(hotelId);
    return (
      hotelReviews.length &&
      hotelReviews.reduce((sum, r) => (sum += r.rating), 0) /
        hotelReviews.length
    );
  }

  async getReviewsByHotel(hotelId: number) {
    const reviews = await this.reviewsRepository.find({
      where: {
        room: {
          hotel: {
            id: hotelId,
          },
        },
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          email: true,
        },
      },
    });
    return reviews;
  }

  async postReview(roomId: number, userId: number, reviewDto: ReviewDto) {
    const user = await this.userService.findOne({ id: userId });
    const room = await this.roomService.findOne({
      id: roomId,
    });

    await this.reviewsRepository.save({ room, user, ...reviewDto });
  }

  async getReviewByRoom(roomId: number, search = '') {
    return await this.reviewsRepository.find({
      where: {
        room: {
          id: roomId,
        },
        comment: ILike(`%${search}%`),
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          email: true,
        },
      },
    });
  }

  async isReviewExist(roomId: number, reviewId: number) {
    return await this.reviewsRepository.exist({
      where: {
        id: reviewId,
        room: {
          id: roomId,
        },
      },
    });
  }

  async deleteReview(reviewId: number) {
    await this.reviewsRepository.delete({
      id: reviewId,
    });
  }
}
