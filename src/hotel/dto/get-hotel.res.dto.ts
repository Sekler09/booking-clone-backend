import { Review } from 'src/review/entities/review.entity';
import { Hotel } from '../entities/hotel.entity';

export class GetHotelResDto extends Hotel {
  reviews: Review[];
}
