import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  maxNoToPost: number;
  @Column({
    length: 20,
  })
  userType: string;
  @Column({
    length: 20,
  })
  subscriptionPlan: string;
  @Column()
  isSubscribed: boolean;
  @Column()
  subscription_date: Date;
  @Column()
  subscription_expiry: Date;
}
