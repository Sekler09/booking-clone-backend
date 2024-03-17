import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { HotelService } from './service';
import { GetAvailableHotelsQuery } from './dto/get-hotels';
import { CustomAuthGuard } from 'src/common/guards/auth';
import BookRoomDto from 'src/room/dto/book-room';
import { ReviewDto } from 'src/review/dto/review';
import { GetHotelResDto } from './dto/get-hotel';
import { CreateHotelDto } from './dto/create-hotel';
import { CreateRoomDto } from 'src/room/dto/create-room';
import { AdminGuard } from 'src/common/guards/admin';
import { Hotel } from './entities/hotel';

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
  async findAll(
    @Query() queryFilters: GetAvailableHotelsQuery,
  ): Promise<Hotel[]> {
    const hotels = queryFilters.adults
      ? await this.hotelService.findAllAvailable(queryFilters)
      : await this.hotelService.findAll({
          withRooms: true,
          search: queryFilters.search || '',
          sort: queryFilters.sort,
        });
    return hotels;
  }

  @Post('/')
  @UseGuards(CustomAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Creates new hotel in database',
  })
  @ApiCreatedResponse({
    description: 'Hotel was created',
  })
  @ApiForbiddenResponse({
    description: 'Hotel with same params already exists',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async createHotel(@Body() hotelDto: CreateHotelDto) {
    await this.hotelService.createHotel(hotelDto);
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

  @Patch('/:id')
  @UseGuards(CustomAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Updates hotel data',
  })
  @ApiOkResponse({
    description: 'Hotel was updated',
  })
  @ApiNotFoundResponse({
    description: 'Hotel with this id was not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async updateHotel(@Param('id') id: number, @Body() hotelDto: CreateHotelDto) {
    await this.hotelService.updateHotel(id, hotelDto);
  }

  @Delete('/:id')
  @UseGuards(CustomAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletes a hotel',
  })
  @ApiParam({ name: 'id', description: 'id of the hotel' })
  @ApiOkResponse({
    description: 'Hotel was deleted',
  })
  @ApiNotFoundResponse({
    description: 'Hotel with this id was not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async deleteHotelById(@Param('id') id: number) {
    await this.hotelService.deleteById(id);
  }

  @Get('/:id/rooms/')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async getHotelRooms(
    @Param('id') id: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const rooms = await this.hotelService.getHotelRooms(id, search, sort);
    return rooms;
  }

  @Post('/:id/rooms/')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async addRoom(@Param('id') id: number, @Body() roomDto: CreateRoomDto) {
    await this.hotelService.addRoom(id, roomDto);
  }

  @Patch('/:id/rooms/:roomId')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async updateRoom(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() roomDto: CreateRoomDto,
  ) {
    await this.hotelService.updateRoom(id, roomId, roomDto);
  }

  @Delete('/:id/rooms/:roomId')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async deleteRoom(@Param('id') id: number, @Param('roomId') roomId: number) {
    await this.hotelService.deleteRoom(id, roomId);
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

  @Get('/:id/rooms/:roomId/reviews')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async getRoomReviews(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    return await this.hotelService.getRoomReviews(id, roomId, search, sort);
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

  @Delete('/:id/rooms/:roomId/reviews/:reviewId')
  @UseGuards(CustomAuthGuard, AdminGuard)
  async deleteRoomReview(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Param('reviewId') reviewId: number,
  ) {
    return await this.hotelService.deleteRoomReview(id, roomId, reviewId);
  }
}
