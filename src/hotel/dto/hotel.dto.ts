import { Room } from 'src/room/entities/room.entity';
import { Hotel } from '../entities/hotel.entity';
import { Review } from 'src/review/entities/review.entity';

export class HotelDto extends Hotel {
  reviews: Review[];
  rooms: Room[];
}
