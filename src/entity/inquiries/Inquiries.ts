import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inquiries {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userSenderId: number;
  @Column()
  userReceiverId: number;
  @Column()
  propertyId: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  address: string;
  @Column()
  streetAddress: string;
  @Column()
  streetAddressLine2: string;
  @Column()
  stateOProvince: string;
  @Column()
  zipCode: string;
  @Column()
  phoneNumber: string;
  @Column()
  email: string;
  @Column()
  description: string;
}
