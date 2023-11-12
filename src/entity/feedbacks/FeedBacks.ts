/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../signup/signup.entity';

@Entity()
export class UserFeedBack {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  email: string;
  @Column()
  fullName: string;
  @Column()
  satisfaction: string;
  @Column()
  userComments: string;
  @Column()
  feedBackDate: Date;
  @ManyToOne((type) => User, (user) => user.feedBacks)
  user: User;
}

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;
  otherId: number; // '0' means rating for the app AND !0 means rating for company;
  @Column()
  ratingStar: string;
  @Column()
  comment: string;
  @Column({
    length: 50,
  })
  sendRatingTo: string;
  @Column()
  userId: number; // commenter ID or their userID
  @Column()
  ratingDate: Date;
}
