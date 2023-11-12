import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from 'src/service/messages/messages.service';
import {
  Messages,
  ReceiverMessage,
  SenderMessage,
} from 'src/entity/messages/Messages';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/signup/signup.entity';
import { Notifications } from 'src/entity/notifications/Notifications';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forFeature([
      ReceiverMessage,
      SenderMessage,
      Messages,
      User,
      Notifications,
    ]),
  ],
})
export class MessagesModule {}
