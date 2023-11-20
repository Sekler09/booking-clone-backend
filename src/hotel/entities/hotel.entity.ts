import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';
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
  @Column('decimal')
  distanceFromCenter: number;

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

export const hotelsDb: Hotel[] = [
  // {
  //   id: 1,
  //   name: 'Hotel A',
  //   city: 'paris',
  //   address: '123 Main Street',
  //   distanceFromCenter: 3.5,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/466014443.webp?k=5d05c2f38b420240d795fe164a35801e9f7b696615728d9786a7809ad7087e9d&o=',
  // },
  // {
  //   id: 2,
  //   name: 'Hotel B',
  //   city: 'moscow',
  //   address: '456 Elm Street',
  //   distanceFromCenter: 2,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/482818914.webp?k=956909b72bd50eb028d1327daaa55ff5f5bd2f75e8549fdb0ed705eb57cab621&o=',
  // },
  // {
  //   id: 3,
  //   name: 'Hotel C',
  //   city: 'paris',
  //   address: '789 Ocean Avenue',
  //   distanceFromCenter: 1.1,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/474974813.webp?k=958d39a75f7b81caae2341ebffe3e0d280f1aa7146ee7f4280525fd71f8fc61b&o=',
  // },
  // {
  //   id: 4,
  //   name: 'Hotel D',
  //   city: 'london',
  //   address: '567 Lakeview Drive',
  //   distanceFromCenter: 2.2,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/295688310.webp?k=f71e92e009a9ad7e95810b38af6b50cb456d3bfaf88355bbd60954abf2302a79&o=',
  // },
  // {
  //   id: 5,
  //   name: 'Hotel E',
  //   city: 'madrid',
  //   address: '789 Golden Gate Avenue',
  //   distanceFromCenter: 0.85,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/474887711.webp?k=7e6d429edfe072d48ca0373f75cb4f89658de8c5a18e826effabc3335be78dbc&o=',
  // },
  // {
  //   id: 6,
  //   name: 'Hotel F',
  //   city: 'barcelona',
  //   address: '101 Casino Boulevard',
  //   distanceFromCenter: 1.8,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/136062776.webp?k=cec8fa1472b7e32761c3dadf2eca7f9e27d3b21e5641591eefd8c0a6693d52c1&o=',
  // },
  // {
  //   id: 7,
  //   name: 'Hotel G',
  //   city: 'minsk',
  //   address: '246 Disney Drive',
  //   distanceFromCenter: 1.5,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/387481220.webp?k=59a278c08d9986acffa596567da428a2f493f5e6534a51030fc46f734f014339&o=',
  // },
  // {
  //   id: 8,
  //   name: 'Hotel H',
  //   city: 'rome',
  //   address: '369 Beacon Street',
  //   distanceFromCenter: 3.6,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/31984062.webp?k=3eee5960207be2be7fcfeff15c9da5fa618bd9cbd78b28570bd8a83dbfe0d55f&o=',
  // },
  // {
  //   id: 9,
  //   name: 'Hotel I',
  //   city: 'berlin',
  //   address: '456 Beachfront Drive',
  //   distanceFromCenter: 4.5,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/244503067.webp?k=7945b0b1f97d177f75ced14d0321ac403a6e655c2fa8d8db3fe855f8d0bf4dc9&o=',
  // },
  // {
  //   id: 10,
  //   name: 'Hotel J',
  //   city: 'milan',
  //   address: '789 Rocky Road',
  //   distanceFromCenter: 2,
  //   image:
  //     'https://cf.bstatic.com/xdata/images/hotel/square200/106687932.webp?k=b8025c33bd658950355f333c21eb4f8bd702747e23a30707bbf3b3a9e3b36003&o=',
  // },
];
