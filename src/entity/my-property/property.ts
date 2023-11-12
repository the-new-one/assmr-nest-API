import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({
    length: 20,
  })
  property_type: string;
}
