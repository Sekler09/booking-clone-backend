import { Room } from 'src/room/entities/room.entity';
import { Hotel } from '../entities/hotel.entity';
import { Review } from 'src/review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export class HotelDto extends Hotel {
  @ApiProperty({
    description: 'reviews of the hotel',
    type: [Review],
  })
  reviews: Review[];

  @ApiProperty({
    description: 'rooms of the hotel',
    type: [Room],
  })
  rooms: Room[];
}
