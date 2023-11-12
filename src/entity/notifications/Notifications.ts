import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userNotifReceiverId: number; // userId but receiver
  @Column()
  userNotifSenderId: number; // userId but sender
  @Column()
  notificationType: string;
  @Column()
  notificationContent: string;
  @Column()
  isSeen: string;
  @Column()
  notificationDate: Date;
}
