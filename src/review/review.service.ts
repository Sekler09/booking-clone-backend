import { Injectable } from '@nestjs/common';
import { reviewDb } from './entities/review.entity';

@Injectable()
export class ReviewService {
  private reviews = [...reviewDb];

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
}
