import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Review } from 'src/review/entities/review';
import { Booking } from 'src/booking/entities/booking';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column';
import { Hotel } from 'src/hotel/entities/hotel';

@Entity()
export class Room {
  @ApiProperty({
    description: 'id of the room',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'the hotel that room belongs to',
    type: () => Hotel,
  })
  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @ApiProperty({
    description: 'type of the room',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: 'number of people that can live in the room',
  })
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'price per night of the room',
  })
  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  price: number;

  @ApiProperty({
    description: 'list of reviews of the room',
    type: () => Review,
  })
  @OneToMany(() => Review, (review) => review.room)
  reviews: Review[];

  @ApiProperty({
    description: 'list of bookings of the room',
    type: () => Booking,
  })
  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
