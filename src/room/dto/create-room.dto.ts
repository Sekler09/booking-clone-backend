import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../entities/room.entity';
import { Column } from 'typeorm';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';

export class CreateRoomDto
  implements Omit<Room, 'id' | 'reviews' | 'hotel' | 'bookings'>
{
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
}
