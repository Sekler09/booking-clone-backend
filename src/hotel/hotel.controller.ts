import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelDto } from './dto/hotel.dto';
import { GetAvailableHotelsQuery } from './entities/get-hotels-query.entity';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('/')
  findAllAvailable(@Query() queryFilters: GetAvailableHotelsQuery): HotelDto[] {
    return this.hotelService.findAllAvailable(queryFilters);
  }

  @Get('/:id')
  getHotelById(
    @Param('id') id: number,
    @Query() queryFilters: GetAvailableHotelsQuery,
  ): HotelDto {
    return this.hotelService.findAvailableById(id, queryFilters);
  }
}
