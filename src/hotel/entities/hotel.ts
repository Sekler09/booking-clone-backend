import { ApiProperty } from '@nestjs/swagger';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column';
import { Room } from 'src/room/entities/room.en';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hotel {
  @ApiProperty({
    description: 'id of the hotel',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'name of the hotel',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'city where the hotel locates',
  })
  @Column()
  city: string;

  @ApiProperty({
    description: 'address of the hotel',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'distance from the hotel to the center of the city',
  })
  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  distance: number;

  @ApiProperty({
    description: 'image of the hotel',
  })
  @Column()
  image: string;

  @ApiProperty({
    description: 'list of rooms of the hotel',
    type: () => Room,
  })
  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}
