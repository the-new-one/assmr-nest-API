import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from 'src/service/notifications/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entity/notifications/Notifications';
import { User } from 'src/entity/signup/signup.entity';
import { Property } from 'src/entity/my-property/property';
import { Assumption } from 'src/entity/property-assumption/PropertyAssumption';
import { Realeststate } from 'src/entity/my-property/my-realestate';
import { Vehicle } from 'src/entity/my-property/my-property';
import { Jewelry } from 'src/entity/my-property/my-jewelry';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    TypeOrmModule.forFeature([Notifications, User, Property, Assumption, Realeststate, Vehicle, Jewelry]),
  ],
  exports: [TypeOrmModule],
})
export class NotificationsModule {}
