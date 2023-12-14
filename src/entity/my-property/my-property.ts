/* eslint-disable @typescript-eslint/no-unused-vars */
import { type } from 'os';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../signup/signup.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  propertyId: number;
  @Column()
  userId: number;
  @Column()
  color: string;
  @Column()
  brand: string;
  @Column()
  model: string;
  @Column()
  milage: string;
  @Column()
  condition: string;
  @Column()
  issue?: string;
  @Column()
  owner: string;
  @Column()
  location: string;
  @Column()
  downpayment: string;
  @Column()
  installmentpaid: string;
  @Column()
  installmentduration: string;
  @Column()
  remainingMonthsToPaid: string;
  @Column()
  assumePrice: string;
  @Column()
  monthlyPayment: string;
  @Column()
  delinquent: string;
  @Column()
  description: string;
  @Column()
  modeOfPayment: string;
  @Column({
    length: 5,
  })
  isDropped: string;
  @Column({
    length: 50,
  })
  branchPurchase: string;

  @ManyToOne((type) => User, (user) => user.vehicles)
  user: User;

  @OneToMany((type) => VehicleImage, (vehicleImage) => vehicleImage.vehicle)
  vehicleImages: VehicleImage[];
}

@Entity()
export class VehicleImage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  vehicleId: number;
  @Column({
    length: 3000
  })
  vehicleFrontIMG: string;
  @Column()
  vehicleRightIMG: string;
  @Column()
  vehicleLeftIMG: string;
  @Column()
  vehicleBackIMG: string;
  @Column()
  vehicleCRIMG: string;
  @Column()
  vehicleORIMG: string;

  @ManyToOne((type) => Vehicle, (vehicle) => vehicle.vehicleImages)
  vehicle: Vehicle;
}
