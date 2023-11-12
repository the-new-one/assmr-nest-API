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
  brand: string;
  @Column()
  model: string;
  @Column()
  owner: string;
  @Column()
  downpayment: string;
  @Column()
  location: string;
  @Column()
  installmentpaid: string;
  @Column()
  installmentduration: string;
  @Column()
  delinquent: string;
  @Column()
  description: string;
  @Column({
    length: 5,
  })
  isDropped: string;

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
  @Column()
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
