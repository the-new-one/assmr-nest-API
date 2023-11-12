/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Realeststate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  propertyId: number;
  @Column()
  userId: number;
  @Column()
  owner: string;
  @Column({
    length: 20,
  })
  realestateType: string;
  @Column()
  location: string;
  @Column()
  downpayment: string;
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

  @OneToMany((type) => Lot, (lot) => lot.realestate)
  lots: Lot[];
  @OneToMany((type) => HouseAndLot, (hal) => hal.realestate)
  hal: HouseAndLot[];
  @OneToMany((type) => House, (house) => house.realestate)
  house: House[];
}

@Entity()
export class HouseAndLot {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  realestateId: number;
  @Column()
  developer: string;
  @Column()
  hal_front_image: string;
  @Column()
  hal_rightside_image: string;
  @Column()
  hal_leftside_image: string;
  @Column()
  hal_back_image: string;
  @Column()
  hal_document_image: string;
  @ManyToOne((type) => Realeststate, (realestate) => realestate.hal)
  realestate: Realeststate;
}
@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  realestateId: number;
  @Column()
  developer: string;
  @Column()
  house_front_image: string;
  @Column()
  house_rightside_image: string;
  @Column()
  house_leftside_image: string;
  @Column()
  house_back_image: string;
  @Column()
  house_document_image: string;
  @ManyToOne((type) => Realeststate, (realestate) => realestate.house)
  realestate: Realeststate;
}

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  realestateId: number;
  @Column()
  lot_image: string;
  @Column()
  lot_document_image: string;

  @ManyToOne((type) => Realeststate, (realestate) => realestate.lots)
  realestate: Realeststate;
}
