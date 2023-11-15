import { ApiProperty } from '@nestjs/swagger';

export class Room {
  @ApiProperty({
    description: 'id of the room',
  })
  id: number;

  @ApiProperty({
    description: 'id of the hotel that room belongs to',
  })
  hotelId: number;

  @ApiProperty({
    description: 'type of the room',
  })
  roomType: string;

  @ApiProperty({
    description: 'number of people that can live in the room',
  })
  capacity: number;

  @ApiProperty({
    description: 'price per night of the room',
  })
  pricePerNight: number;

  @ApiProperty({
    description: 'list of dates when room is not available',
  })
  bookedDates: string[];
}

export const roomsDb: Room[] = [
  {
    id: 101,
    hotelId: 1,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 300,
    bookedDates: ['2023-10-1', '2023-10-5'],
  },
  {
    id: 102,
    hotelId: 1,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 150,
    bookedDates: [
      '2023-10-7',
      '2023-11-14',
      '2023-11-15',
      '2023-11-16',
      '2023-11-17',
      '2023-11-18',
    ],
  },
  {
    id: 201,
    hotelId: 2,
    roomType: 'Suite',
    capacity: 3,
    pricePerNight: 250,
    bookedDates: ['2023-09-24'],
  },
  {
    id: 202,
    hotelId: 2,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 180,
    bookedDates: ['2023-09-23'],
  },
  {
    id: 301,
    hotelId: 3,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 50,
    bookedDates: ['2023-09-25'],
  },
  {
    id: 302,
    hotelId: 3,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 200,
    bookedDates: ['2023-11-14', '2023-11-15', '2023-11-16', '2023-11-17'],
  },
  {
    id: 401,
    hotelId: 4,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 110,
    bookedDates: ['2023-09-26'],
  },
  {
    id: 402,
    hotelId: 4,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 180,
    bookedDates: ['2023-09-27'],
  },
  {
    id: 501,
    hotelId: 5,
    roomType: 'Suite',
    capacity: 4,
    pricePerNight: 300,
    bookedDates: [],
  },
  {
    id: 502,
    hotelId: 5,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 160,
    bookedDates: ['2023-09-28', '2023-09-29'],
  },
  {
    id: 601,
    hotelId: 6,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 90,
    bookedDates: [],
  },
  {
    id: 602,
    hotelId: 6,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 140,
    bookedDates: ['2023-09-30'],
  },
  {
    id: 701,
    hotelId: 7,
    roomType: 'Suite',
    capacity: 4,
    pricePerNight: 280,
    bookedDates: [],
  },
  {
    id: 702,
    hotelId: 7,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 110,
    bookedDates: ['2023-10-01'],
  },

  {
    id: 801,
    hotelId: 8,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 170,
    bookedDates: ['2023-10-02'],
  },
  {
    id: 802,
    hotelId: 8,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 100,
    bookedDates: ['2023-10-03'],
  },

  {
    id: 901,
    hotelId: 9,
    roomType: 'Suite',
    capacity: 4,
    pricePerNight: 300,
    bookedDates: [],
  },
  {
    id: 901,
    hotelId: 9,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 120,
    bookedDates: ['2023-10-06'],
  },

  {
    id: 1001,
    hotelId: 10,
    roomType: 'Single',
    capacity: 1,
    pricePerNight: 110,
    bookedDates: ['2023-10-04'],
  },
  {
    id: 1002,
    hotelId: 10,
    roomType: 'Double',
    capacity: 2,
    pricePerNight: 180,
    bookedDates: ['2023-10-05'],
  },
];
