/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Messages,
  ReceiverMessage,
  SenderMessage,
} from 'src/entity/messages/Messages';
import { Notifications } from 'src/entity/notifications/Notifications';
import { User } from 'src/entity/signup/signup.entity';
import {
  IChatSendMessageModel,
  IChatWithListModel,
  IChatWithMessagesModel,
  IChatWithModel,
} from 'src/models/messages/MessagesModel';
import { Repository, getConnection } from 'typeorm';
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages) private messagesEntity: Repository<Messages>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(ReceiverMessage)
    private receiverMessEntity: Repository<ReceiverMessage>,
    @InjectRepository(SenderMessage)
    private senderMessEntity: Repository<SenderMessage>,
    @InjectRepository(Notifications)
    private notificationEntity: Repository<Notifications>,
  ) {}
  async getIChatWith({
    activeUser,
    otherUser,
  }: IChatWithModel): Promise<ResponseData<IChatWithMessagesModel[]>> {
    const messages = await this.messagesEntity
      .createQueryBuilder('messages')
      .innerJoin(
        User,
        'user',
        'user.id=messages.senderId OR user.id = messages.receiverId',
      )
      .innerJoin(
        ReceiverMessage,
        'receiverMess',
        'receiverMess.id = messages.receiverMessageId',
      )
      .innerJoin(
        SenderMessage,
        'senderMess',
        'senderMess.id = messages.senderMessageId',
      )
      .where('receiverMess.email =:rmemailRM', { rmemailRM: activeUser })
      .orWhere('senderMess.email =:smemailSM', { smemailSM: otherUser })
      .andWhere('receiverMess.email =:rmemailRMRM', {
        rmemailRMRM: otherUser,
      })
      .orWhere('senderMess.email =:smemailSMSM', {
        smemailSMSM: activeUser,
      })
      .groupBy('messages.senderMessageId, messages.receiverMessageId')
      .select(['messages', 'user', 'receiverMess', 'senderMess'])
      .getRawMany();

    return {
      code: 200,
      status: 1,
      message: 'IChatWith Records.',
      data: messages,
      // data: messages as unknown as IChatWithMessagesModel[],
    }; // if naa siyay converstation sa laen user go here...
  }
  async iSendMessageWith(
    messageData: IChatSendMessageModel,
  ): Promise<ResponseData<string>> {
    const { receiverId, senderId, message, activeUser, otherUser } =
      messageData;

    const receiverRes = await this.receiverMessEntity
      .createQueryBuilder('messages')
      .insert()
      .into(ReceiverMessage)
      .values({
        email: otherUser,
        userId: receiverId,
      })
      .execute();
    const recResId = receiverRes.raw.insertId;

    const senderRes = await this.senderMessEntity
      .createQueryBuilder('senderMessage')
      .insert()
      .into(SenderMessage)
      .values({
        email: activeUser,
        userId: senderId,
      })
      .execute();
    const sendResId = senderRes.raw.insertId;

    this.messagesEntity
      .createQueryBuilder('messages')
      .insert()
      .into(Messages)
      .values({
        senderId: senderId,
        receiverId: receiverId,
        receiverMessageId: recResId,
        senderMessageId: sendResId,
        message,
        date: new Date(),
      })
      .execute();

    this.notificationEntity
      .createQueryBuilder('notifications')
      .insert()
      .into(Notifications)
      .values({
        userNotifReceiverId: receiverId,
        userNotifSenderId: senderId,
        notificationType: 'message',
        notificationContent: 'someone sent a message',
        isSeen: 'false',
        notificationDate: new Date(),
      })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Message was sent.',
      data: 'Message was send successfully.',
    };
  }
  async getAllMyChatLists(
    param: any,
  ): Promise<ResponseData<IChatWithListModel[]>> {
    // select * from messages m INNER JOIN user u ON u.id = m.senderId OR u.id = m.receiverId INNER JOIN receiver_message rm ON rm.id = m.receiverMessageId INNER JOIN sender_message sm ON sm.id = m.senderId WHERE (rm.email ='klent@gmail.com' AND sm.email = 'maica@gmail.com' OR rm.email ='maica@gmail.com' AND sm.email = 'klent@gmail.com') AND (rm.email ='maica@gmail.com' AND sm.email = 'klent@gmail.com' OR rm.email ='klent@gmail.com' AND sm.email = 'maica@gmail.com') GROUP by m.senderMessageId, m.receiverMessageId
    const { userId, activeUserEmail } = param;

    const subQuery = this.messagesEntity
      .createQueryBuilder('messages')
      .select('MAX(messages.id)', 'max')
      .groupBy('messages.senderId, messages.receiverId');

    const messageList: any = await this.messagesEntity
      .createQueryBuilder('messages')
      .innerJoin(User, 'userSender', 'userSender.id=messages.senderId')
      .innerJoin(User, 'userReceiver', 'userReceiver.id = messages.receiverId')
      .innerJoin(
        ReceiverMessage,
        'receiverMess',
        'receiverMess.id = messages.receiverMessageId',
      )
      .innerJoin(
        SenderMessage,
        'senderMess',
        'senderMess.id = messages.senderMessageId',
      )
      .groupBy('messages.senderId, messages.receiverId')
      .where('receiverMess.email =:rmemailRM', { rmemailRM: activeUserEmail })
      .orWhere('senderMess.email =:smemailSM', {
        smemailSM: activeUserEmail,
      })
      .andWhere('receiverMess.email =:rmemailRMRM', {
        rmemailRMRM: activeUserEmail,
      })
      .orWhere('senderMess.email =:smemailSMSM', {
        smemailSMSM: activeUserEmail,
      })
      .andWhere(`messages.id IN (${subQuery.getQuery()})`)
      .select([
        'messages',
        'userSender',
        'userReceiver',
        'receiverMess',
        'senderMess',
      ])
      .getRawMany();
    // .getSql();
      console.log(messageList);
    return {
      code: 200,
      status: 1,
      message: 'allMy Chattlists',
      data: messageList as unknown as IChatWithListModel[],
    };
  }
}
