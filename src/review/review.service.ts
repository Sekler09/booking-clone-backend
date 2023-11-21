import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewDto } from './dto/review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';

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

    const review = new Review();
    review.comment = reviewDto.comment;
    review.rating = reviewDto.rating;
    review.room = room;
    review.user = user;
    await this.reviewsRepository.save(review);
  }
}
