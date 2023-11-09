import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelDto } from './dto/hotel.dto';
import { GetHotelsQuery } from './entities/get-hotels-query.entity';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('/')
  findAvailable(
    @Query() { city, from, to, children, adults, rooms }: GetHotelsQuery,
  ): HotelDto[] {
    return this.hotelService.findAvailable(
      city,
      from,
      to,
      children + adults,
      rooms,
    );
  }

  @Get('/:id')
  getHotelById(@Param('id') id: number): HotelDto {
    return this.hotelService.findById(id);
  }
}
