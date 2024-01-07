import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ type: () => Review })
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ApiProperty({ type: () => Booking })
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
