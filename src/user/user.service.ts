import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      email: 'admin',
      password: '',
    },
  ];

  private id = 2;

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: this.id++,
      email: createUserDto.email,
      password: createUserDto.password,
    };
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  update(userId: number, dto: UpdateUserDto) {
    const index = this.users.indexOf(this.findOne(userId));
    this.users[index] = { ...this.users[index], ...dto };
  }

  remove(id: number) {
    return this.users.filter((user) => user.id !== id);
  }
}
