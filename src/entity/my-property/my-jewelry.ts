/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../signup/signup.entity';

@Entity()
export class Jewelry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  propertyId: number;
  @Column()
  jewelry_owner: string;
  @Column()
  jewelry_name: string;
  @Column()
  jewelry_model: string;
  @Column()
  jewelry_downpayment: string;
  @Column()
  jewelry_location: string;
  @Column()
  jewelry_delinquent: string;
  @Column()
  jewelry_installmentpaid: string;
  @Column()
  jewelry_installmentduration: string;
  @Column()
  jewelry_description: string;
  @Column()
  jewelry_karat: string;
  @Column()
  jewelry_grams: string;
  @Column()
  jewelry_material: string;
  @Column()
  jewelry_image: string;
  @Column({
    length: 5,
  })
  isDropped: string;

  @ManyToOne((type) => User, (user) => user.jewelries)
  user: User;
}
