import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AddressModule } from './controllers/address/address.module';
import { SignupModule } from './controllers/signup/signup.module';
// import { SignupService } from './service/signup/signup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from './entity/signup/signup.entity';
// import { SigninService } from './service/signin/signin.service';
import { SigninModule } from './controllers/signin/signin.module';
import { MyPropertyModule } from './controllers/my-property/my-property.module';
// import { MyPropertyService } from './service/my-property/my-property.service';
import { Vehicle, VehicleImage } from './entity/my-property/my-property';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { PropertyAssumptionsController } from './controllers/property-assumptions/property-assumptions.controller';
import { PropertyAssumptionsModule } from './controllers/property-assumptions/property-assumptions.module';
// import { PropertyAsssumptionsService } from './service/property-asssumptions/property-asssumptions.service';
import {
  Assumer,
  Assumption,
} from './entity/property-assumption/PropertyAssumption';

import { MessagesModule } from './controllers/messages/messages.module';
import { AssumedPropertyModule } from './controllers/assumed-property/assumed-property.module';
import {
  Messages,
  ReceiverMessage,
  SenderMessage,
} from './entity/messages/Messages';
// import { AssumedPropertyController } from './controllers/assumed-property/assumed-property.controller';
// import { AssumedPropertyService } from './service/assumed-property/assumed-property.service';
import { FeedbackModule } from './controllers/feedback/feedback.module';
// import { FeedbacksService } from './service/feedbacks/feedbacks.service';
import { Rating, UserFeedBack } from './entity/feedbacks/FeedBacks';
// import { FeedbackController } from './controllers/feedback/feedback.controller';
import { Notifications } from './entity/notifications/Notifications';
import { NotificationsModule } from './controllers/notifications/notifications.module';
// import { NotificationsService } from './service/notifications/notifications.service';
// import { NotificationsController } from './controllers/notifications/notifications.controller';
import { InquiriesModule } from './controllers/inquiries/inquiries.module';
// import { InquiriesService } from './service/inquiries/inquiries.service';
import { Inquiries } from './entity/inquiries/Inquiries';
import { DashboardModule } from './controllers/dashboard/dashboard.module';
// import { DashboardService } from './service/dashboard/dashboard.service';
import { Jewelry } from './entity/my-property/my-jewelry';
import {
  House,
  HouseAndLot,
  Lot,
  Realeststate,
} from './entity/my-property/my-realestate';
import { Property } from './entity/my-property/property';
import { AdminModule } from './controllers/admin/admin.module';
// import { AdminService } from './service/admin/admin.service';
import { Company } from './entity/company/Company';
// import { SignupController } from './controllers/signup/signup.controller';
// import { SigninController } from './controllers/signin/signin.controller';
import { UserSubscription } from './entity/subscription/Subscription';
@Module({
  imports: [
    AddressModule,
    SignupModule,
    SigninModule,
    MyPropertyModule,
    PropertyAssumptionsModule,
    AssumedPropertyModule,
    MessagesModule,
    FeedbackModule,
    NotificationsModule,
    InquiriesModule,
    DashboardModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'assmr',
      entities: [
        User,
        Account,
        Vehicle,
        VehicleImage,
        Assumer,
        Assumption,
        Messages,
        ReceiverMessage,
        SenderMessage,
        UserFeedBack,
        Notifications,
        Inquiries,
        Jewelry,
        Realeststate,
        HouseAndLot,
        House,
        Lot,
        Property,
        Company,
        UserSubscription,
        Rating,
      ], // list your entity here
      synchronize: true,
    }),
  ],
  // controllers: [
  // AppController,
  // PropertyAssumptionsController,
  // AssumedPropertyController,
  // FeedbackController,
  // NotificationsController,
  // SignupController,
  // SigninController,
  // ],
  // providers: [
  // AppService,
  // SignupService,
  // SigninService,
  // MyPropertyService,
  // PropertyAsssumptionsService,
  // AssumedPropertyService,
  // FeedbacksService,
  // NotificationsService,
  // InquiriesService,
  // DashboardService,
  // AdminService,
  // ],
})
export class AppModule {}
