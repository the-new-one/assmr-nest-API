/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../signup/signup.entity';

@Entity()
export class ReceiverMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  userId: number;
  // @ManyToOne((type) => User)
  // user: User;
}

@Entity()
export class SenderMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  userId: number;
  // @ManyToOne((type) => User)
  // user: User;
}

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  senderId: number;
  @Column()
  receiverId: number;
  @Column()
  receiverMessageId: number;
  @Column()
  senderMessageId: number;
  @Column()
  message: string;
  @Column()
  date: Date;

  // @ManyToOne((type) => User, (user) => user.messages)
  // @Column('int', { name: 'userId' })
  // user: User;
  // @OneToOne((type) => ReceiverMessage)
  // @JoinColumn()
  // receiverMessage: ReceiverMessage;
  // @OneToOne((type) => SenderMessage)
  // @JoinColumn()
  // senderMessage: SenderMessage;
}
