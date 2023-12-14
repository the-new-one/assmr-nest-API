import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({
    length: 50,
  })
  company_name: string;
  @Column({
    length: 50,
  })
  @Column({
    length: 20,
  })
  company_type: string;
  company_branch: string;
  @Column({
    length: 250,
  })
  company_location: string;
  @Column({
    length: 10,
  })
  company_zipcode: string;
  @Column({
    length: 50,
  })
  company_representative: string;
  @Column()
  company_establish_date: Date;
  @Column({
    length: 100,
  })
  @Column({
    length: 50,
  })
  branch: string; // can be 'MAIN' OR 'OTHER'
  @Column({
    length: 50,
  })
  website: string;
  @Column()
  isActive: number; // 1 as 'ACTIVE' and 0 as 'INACTIVE'
}
