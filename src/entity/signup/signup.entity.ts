/* eslint-disable @typescript-eslint/no-unused-vars */
import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Vehicle } from '../my-property/my-property';
import { MyVehiclePropertyModel } from 'src/models/my-property/MyProperty';

import { Messages, ReceiverMessage, SenderMessage } from '../messages/Messages';

import { Assumer, Assumption } from '../property-assumption/PropertyAssumption';
import { UserFeedBack } from '../feedbacks/FeedBacks';
import { Jewelry } from '../my-property/my-jewelry';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  firstname: string;
  @Column()
  middlename: string;
  @Column()
  lastname: string;
  @Column()
  contactno: string;
  @Column()
  gender: string;
  @Column()
  municipality: string;
  @Column()
  province: string;
  @Column()
  barangay: string;
  @Column({
    length: 100,
  })
  image: string;

  @OneToMany((type) => Vehicle, (vehicle) => vehicle?.user)
  vehicles: MyVehiclePropertyModel[];

  @OneToMany((type) => Assumer, (assumer) => assumer.user)
  assumers: Assumer[];

  @OneToMany((type) => Assumption, (assumption) => assumption.user)
  assumption: Assumption[];
  @OneToMany((type) => Messages, (messages) => messages.message)
  messages: Messages[];
  // @ManyToOne((type) => ReceiverMessage, (receiverMess) => receiverMess.user)
  // receiverMessage: ReceiverMessage;
  // @ManyToOne((type) => SenderMessage, (senderMess) => senderMess.user)
  // senderMessage: SenderMessage;
  @OneToMany((type) => UserFeedBack, (feedbacks) => feedbacks.user)
  feedBacks: UserFeedBack[];
  @OneToMany((type) => Jewelry, (jewelries) => jewelries.user)
  jewelries: Jewelry[];
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  email: string;
  @Column()
  password: string;
}
