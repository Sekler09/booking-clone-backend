import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { User } from './entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from 'src/booking/service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly bookingService: BookingService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(<User>createUserDto);
  }

  findOne(opts: Partial<Omit<User, 'reviews' | 'bookings'>>) {
    return this.usersRepository.findOneBy(opts);
  }

  async getUserBookings(id: number) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return await this.bookingService.getUserBookings(id);
  }

  async cancelUserBooking(userId: number, bookingId: number) {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return await this.bookingService.cancelUserBooking(userId, bookingId);
  }
}
