import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from 'src/service/notifications/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entity/notifications/Notifications';
import { User } from 'src/entity/signup/signup.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([Notifications, User])],
  exports: [TypeOrmModule],
})
export class NotificationsModule {}
