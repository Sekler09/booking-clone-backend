import { Injectable } from '@nestjs/common';
import { Review, reviewDb } from './entities/review.entity';
import { ReviewDto } from './dto/review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private readonly userService: UserService,
  ) {}
  private reviews = [...reviewDb];

  private idCounter = reviewDb.length + 1;

  getAverageRatingByHotel(hotelId: number) {
    const hotelReviews = this.getReviewsByHotel(hotelId);
    return (
      hotelReviews.length &&
      hotelReviews.reduce((sum, r) => (sum += r.rating), 0) /
        hotelReviews.length
    );
  }

  getReviewsByHotel(hotelId: number) {
    return this.reviews.filter((review) => review.hotelId === hotelId);
  }

  async postReview(
    hotelId: number,
    roomId: number,
    userId: number,
    reviewDto: ReviewDto,
  ) {
    const user = await this.userService.findOne({ id: userId });
    const review = new Review();
    review.comment = reviewDto.comment;
    review.rating = reviewDto.rating;
    review.hotelId = hotelId;
    review.roomId = roomId;
    review.user = user;
    await this.reviewsRepository.save(review);
  }
}
