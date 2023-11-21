import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
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
import { Request } from 'express';

import { HotelService } from './hotel.service';
import { GetAvailableHotelsQuery } from './dto/get-hotels.query.dto';
import { CustomAuthGuard } from 'src/common/guards/auth.guard';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';
import { GetHotelResDto } from './dto/get-hotel.res.dto';

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
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async findAllAvailable(
    @Query() queryFilters: GetAvailableHotelsQuery,
  ): Promise<GetHotelResDto[]> {
    const hotels = await this.hotelService.findAllAvailable(queryFilters);
    return hotels;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Returns a hotel applying filter according to query',
  })
  @ApiParam({ name: 'id', description: 'id of the hotel' })
  @ApiOkResponse({
    description: 'Hotel was returned',
  })
  @ApiNotFoundResponse({
    description: 'Hotel with this id was not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getHotelById(
    @Param('id') id: number,
    @Query() queryFilters: GetAvailableHotelsQuery,
  ): Promise<GetHotelResDto> {
    const hotel = await this.hotelService.findAvailableById(id, queryFilters);
    return hotel;
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
  async bookHotel(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Req() req: Request,
    @Body() { from, to }: BookRoomDto,
  ) {
    await this.hotelService.bookRoom(id, roomId, req.user['sub'], {
      from,
      to,
    });
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
  async postReview(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Req() req: Request,
    @Body() reviewDto: ReviewDto,
  ) {
    await this.hotelService.postReview(id, roomId, req.user['sub'], reviewDto);
  }
}
