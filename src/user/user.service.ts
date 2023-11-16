import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  private users: User[] = [
    {
      id: 1,
      email: 'admin',
      password: '',
    },
  ];

  private id = 2;

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(<User>createUserDto);
  }

  findAll() {
    return this.users;
  }

  findOne(opts: Partial<User>) {
    return this.usersRepository.findOneBy(opts);
  }

  remove(id: number) {
    return this.users.filter((user) => user.id !== id);
  }
}
