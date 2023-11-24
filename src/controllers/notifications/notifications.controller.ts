import { Controller, Get, Param } from '@nestjs/common';
import { NotificationModel } from 'src/models/notificaitons/Notifications';
import { NotificationsService } from 'src/service/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifService: NotificationsService) {}
  @Get('push-notif/:activeUserId')
  getPushNotifications(
    @Param('activeUserId') activeUserId: number,
  ): Promise<ResponseData<NotificationModel[]>> {
    return this.notifService.getPushNotifications(activeUserId);
  }
}
