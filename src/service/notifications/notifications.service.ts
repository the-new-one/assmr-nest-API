import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entity/notifications/Notifications';
import { User } from 'src/entity/signup/signup.entity';
import { NotificationModel } from 'src/models/notificaitons/Notifications';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notifEntity: Repository<Notifications>,
    @InjectRepository(User) private userEntity: Repository<User>,
  ) {}
  async getPushNotifications(
    activeUserId: number,
  ): Promise<ResponseData<NotificationModel[]>> {
    const notifications = await this.notifEntity
      .createQueryBuilder('notification')
      .innerJoin(
        User,
        'notifSender',
        'notifSender.id = notification.userNotifSenderId',
      )
      .where('notification.userNotifReceiverId =:notifReceiverId', {
        notifReceiverId: activeUserId,
      })
      .andWhere('notification.isSeen =:isSeen', { isSeen: 'false' })
      .select(['notification', 'notifSender'])
      .getRawMany();

    // console.log(notifications);
    // this.notifEntity
    //   .createQueryBuilder('notifications')
    //   .update(Notifications)
    //   .set({
    //     isSeen: 'true',
    //   })
    //   .execute();

    return {
      code: 200,
      status: 1,
      message: 'notifications',
      data: notifications as unknown as NotificationModel[],
    };
  }
}
