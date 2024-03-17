import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './service';
import { CustomAuthGuard } from 'src/common/guards/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get('/:id/bookings')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserBookings(@Param('id') id: number) {
    return await this.userService.getUserBookings(id);
  }

  @Delete('/:userId/bookings/:bookingId')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelUserBooking(
    @Param('userId') userId: number,
    @Param('bookingId') bookingId: number,
  ) {
    return await this.userService.cancelUserBooking(userId, bookingId);
  }
}
