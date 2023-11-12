import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  maxNoToPost: number;
  @Column()
  subscription_date: Date;
  @Column({
    length: 20,
  })
  userType: string;
  @Column()
  isSubscribed: boolean;
}
