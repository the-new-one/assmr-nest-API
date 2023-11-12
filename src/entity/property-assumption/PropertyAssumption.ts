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
export class Assumer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  assumer_income: string;
  @Column()
  assumer_work: string;

  @ManyToOne((type) => User, (user) => user.assumers)
  user: User;
}

@Entity()
export class Assumption {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  propertyId: number;
  @Column()
  assumerId: number;
  @Column()
  propowner_id: number;
  @Column()
  isActive: string;
  @Column()
  isAcceptedAssumer: number;
  @Column()
  transaction_date: Date;

  @OneToOne(() => Assumer)
  @JoinColumn()
  assumer: Assumer;

  @ManyToOne((type) => User, (user) => user.assumption)
  user: User;
}
