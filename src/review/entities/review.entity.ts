import { ApiProperty } from '@nestjs/swagger';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
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
  @ManyToOne(() => User, (user) => user.reviews)
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
  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  rating: number;

  @ApiProperty({
    description: 'comment of the review',
  })
  @Column()
  comment: string;
}
