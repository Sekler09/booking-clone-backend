import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { User } from './entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(<User>createUserDto);
  }

  findOne(opts: Partial<Omit<User, 'reviews' | 'bookings'>>) {
    return this.usersRepository.findOneBy(opts);
  }
}
