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

import { HotelService } from './hotel.service';
import { GetAvailableHotelsQuery } from './dto/get-hotels.query.dto';
import { CustomAuthGuard } from 'src/common/guards/auth.guard';
import BookRoomDto from 'src/room/dto/book-room.dto';
import { ReviewDto } from 'src/review/dto/review.dto';
import { GetHotelResDto } from './dto/get-hotel.res.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';

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
  ): Promise<GetHotelResDto[]> {
    const hotels = queryFilters.adults
      ? await this.hotelService.findAllAvailable(queryFilters)
      : await this.hotelService.findAll({ withRooms: true });
    return hotels;
  }

  @Post('/')
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
  async getHotelRooms(@Param('id') id: number) {
    const rooms = await this.hotelService.getHotelRooms(id);
    return rooms;
  }

  @Post('/:id/rooms/')
  async addRoom(@Param('id') id: number, @Body() roomDto: CreateRoomDto) {
    await this.hotelService.addRoom(id, roomDto);
  }

  @Patch('/:id/rooms/:roomId')
  async updateRoom(
    @Param('id') id: number,
    @Param('roomId') roomId: number,
    @Body() roomDto: CreateRoomDto,
  ) {
    await this.hotelService.updateRoom(id, roomId, roomDto);
  }

  @Delete('/:id/rooms/:roomId')
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
