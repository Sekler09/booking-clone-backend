import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @ApiProperty({
    description: 'id of the review',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'user that left the review',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.reviews, {
    eager: true,
  })
  user: User;

  @ApiProperty({
    description: 'id of the room that review belongs to',
    type: () => Room,
  })
  @ManyToOne(() => Room, (room) => room.reviews)
  room: Room;

  @ApiProperty({
    description: 'rating of the review',
  })
  @Column('decimal')
  rating: number;

  @ApiProperty({
    description: 'comment of the review',
  })
  @Column()
  comment: string;
}

export const reviewDb: Review[] = [
  //   {
  //     id: 1,
  //     hotelId: 1,
  //     roomId: 101,
  //     username: 'JohnDoe',
  //     rating: 4,
  //     comment: 'Great room!',
  //   },
  //   {
  //     id: 2,
  //     hotelId: 1,
  //     roomId: 101,
  //     username: 'JaneSmith',
  //     rating: 5,
  //     comment: 'Excellent service!',
  //   },
  //   {
  //     id: 3,
  //     hotelId: 1,
  //     roomId: 102,
  //     username: 'AliceJohnson',
  //     rating: 4,
  //     comment: 'Clean and comfortable!',
  //   },
  //   {
  //     id: 4,
  //     hotelId: 2,
  //     roomId: 201,
  //     username: 'BobAnderson',
  //     rating: 5,
  //     comment: 'Amazing experience!',
  //   },
  //   {
  //     id: 5,
  //     hotelId: 2,
  //     roomId: 202,
  //     username: 'EvaWilliams',
  //     rating: 5,
  //     comment: 'Lovely stay!',
  //   },
  //   {
  //     id: 6,
  //     hotelId: 3,
  //     roomId: 301,
  //     username: 'DavidClark',
  //     rating: 3,
  //     comment: 'Decent stay.',
  //   },
  //   {
  //     id: 7,
  //     hotelId: 4,
  //     roomId: 401,
  //     username: 'SarahBrown',
  //     rating: 4,
  //     comment: 'Good value for money.',
  //   },
  //   {
  //     id: 8,
  //     hotelId: 4,
  //     roomId: 402,
  //     username: 'MarkSmith',
  //     rating: 5,
  //     comment: 'Exceptional service!',
  //   },
  //   {
  //     id: 9,
  //     hotelId: 5,
  //     roomId: 501,
  //     username: 'LauraTaylor',
  //     rating: 5,
  //     comment: 'Luxurious experience!',
  //   },
  //   {
  //     id: 10,
  //     hotelId: 5,
  //     roomId: 501,
  //     username: 'MichaelJones',
  //     rating: 4,
  //     comment: 'Great view!',
  //   },
  //   {
  //     id: 11,
  //     hotelId: 6,
  //     roomId: 602,
  //     username: 'JenniferLee',
  //     rating: 4,
  //     comment: 'Enjoyable stay.',
  //   },
  //   {
  //     id: 12,
  //     hotelId: 7,
  //     roomId: 702,
  //     username: 'DanielSmith',
  //     rating: 3,
  //     comment: 'Average stay.',
  //   },
  //   {
  //     id: 13,
  //     hotelId: 8,
  //     roomId: 802,
  //     username: 'EmilyDavis',
  //     rating: 4,
  //     comment: 'Nice location!',
  //   },
  //   {
  //     id: 14,
  //     hotelId: 9,
  //     roomId: 902,
  //     username: 'SophiaSmith',
  //     rating: 4,
  //     comment: 'Great beach view!',
  //   },
  //   {
  //     id: 15,
  //     hotelId: 10,
  //     roomId: 1001,
  //     username: 'WilliamBrown',
  //     rating: 4,
  //     comment: 'Comfortable stay!',
  //   },
  //   {
  //     id: 16,
  //     hotelId: 10,
  //     roomId: 1002,
  //     username: 'OliviaJohnson',
  //     rating: 5,
  //     comment: 'Fantastic service!',
  //   },
];
