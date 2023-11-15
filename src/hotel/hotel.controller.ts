import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Returns an array of hotels available according to query',
  })
  @ApiOkResponse({
    description: 'Hotels were returned',
    type: [HotelDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  findAllAvailable(@Query() queryFilters: GetAvailableHotelsQuery): HotelDto[] {
    return this.hotelService.findAllAvailable(queryFilters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Returns a hotel applying filter according to query',
  })
  @ApiParam({ name: 'id', description: 'id of the hotel' })
  @ApiOkResponse({
    description: 'Hotel was returned',
    type: HotelDto,
  })
  @ApiNotFoundResponse({
    description: 'Hotel with this id was not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  getHotelById(
    @Param('id') id: number,
    @Query() queryFilters: GetAvailableHotelsQuery,
  ): HotelDto {
    return this.hotelService.findAvailableById(id, queryFilters);
  }

  @Post('/:id/rooms/:roomId/book')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Books a hotel in dates if possible',
  })
  @ApiParam({ name: 'id', description: 'id of the hotel' })
  @ApiParam({ name: 'roomId', description: 'id of the room of hotel' })
  @ApiOkResponse({
    description: 'Hotel was booked',
  })
  @ApiUnauthorizedResponse({
    description: 'User was not authorized',
  })
  @ApiNotFoundResponse({
    description: 'Hotel or room was not found',
  })
  @ApiForbiddenResponse({
    description: 'Hotel is already booked in this dates',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  bookHotel(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() { from, to }: BookRoomDto,
  ) {
    return this.hotelService.bookRoom(id, roomId, { from, to });
  }

  @Post('/:id/rooms/:roomId/reviews')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add review',
  })
  @ApiParam({ name: 'id', description: 'id of the hotel' })
  @ApiParam({ name: 'roomId', description: 'id of the room of hotel' })
  @ApiCreatedResponse({
    description: 'Review was created',
  })
  @ApiNotFoundResponse({
    description: 'Hotel or room was not found',
  })
  @ApiUnauthorizedResponse({
    description: 'User was not authorized',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  postReview(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() reviewDto: ReviewDto,
  ) {
    this.hotelService.postReview(id, roomId, reviewDto);
  }
}
