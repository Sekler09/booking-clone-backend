import { Review } from 'src/review/entities/review';
import { Hotel } from '../entities/hotel';

export class GetHotelResDto extends Hotel {
  reviews: Review[];
}
