import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/review/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ type: () => Review })
  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  reviews: Review[];
}
