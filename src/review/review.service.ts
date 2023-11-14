import { Injectable } from '@nestjs/common';
import { Review, reviewDb } from './entities/review.entity';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
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

  postReview(hotelId: number, roomId: number, reviewDto: ReviewDto) {
    const review: Review = {
      id: this.idCounter++,
      hotelId,
      roomId,
      ...reviewDto,
    };
    this.reviews.push(review);
  }
}
