import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { User } from './user.entity';
// import { Cat } from './cat.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  catId: number;

  @Column({ default: false })
  isFavorite: boolean;

}