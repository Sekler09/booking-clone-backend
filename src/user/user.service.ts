import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

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

  create({ email, password }: CreateUserDto) {
    this.users.push({
      id: this.id++,
      email,
      password,
    });
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

  remove(id: number) {
    return this.users.filter((user) => user.id !== id);
  }
}
