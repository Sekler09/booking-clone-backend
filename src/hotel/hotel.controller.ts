import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HotelService } from './hotel.service';
import { HotelDto } from './dto/hotel.dto';
import { GetAvailableHotelsQuery } from './dto/get-hotels.query.dto';
import { CustomAuthGuard } from 'src/common/guards/auth.guard';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';

@ApiTags('hotels')
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

  @Post('/:id/rooms/:roomId/book')
  @UseGuards(CustomAuthGuard)
  bookHotel(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() { from, to }: BookRoomDto,
  ) {
    return this.hotelService.bookRoom(id, roomId, { from, to });
  }

  @Post('/:id/rooms/:roomId/reviews')
  @UseGuards(CustomAuthGuard)
  postReview(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() reviewDto: ReviewDto,
  ) {
    this.hotelService.postReview(id, roomId, reviewDto);
  }
}
