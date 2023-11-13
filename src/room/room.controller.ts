import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CustomAuthGuard } from 'src/common/guards/auth.guard';
import BookRoomDto from './dto/book-room.dto';

@Controller('hotels/:hotelId/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/:id/book')
  @UseGuards(CustomAuthGuard)
  bookHotel(
    @Param('id') id: number,
    @Param('hotelId') hotelId: number,
    @Body() { from, to }: BookRoomDto,
  ) {
    this.roomService.book(id, hotelId, { from, to });
  }
}
