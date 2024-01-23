import { Room } from 'src/room/entities/room';
import { User } from 'src/user/entities/user';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;
}
