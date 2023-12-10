import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationModel } from 'src/models/notificaitons/Notifications';
import { NotificationsService } from 'src/service/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifService: NotificationsService) {}
  @Get('/push-notif-counter/:activeUserId')
  getPushNotificationsCounter(@Param('activeUserId') activeUserId: number) {
    return this.notifService.getNotificationsCounter(activeUserId);
  }
  @Get('push-notif/:activeUserId')
  getPushNotifications(
    @Param('activeUserId') activeUserId: number,
  ): Promise<ResponseData<NotificationModel[]>> {
    return this.notifService.getPushNotifications(activeUserId);
  }
  @Post('/reports/property')
  getAllPropertyForReports(
    @Body()
    params,
  ) {
    const { activeUserId, dateFrom, dateTo } = params.payLoads;
    return this.notifService.getAllPropertyForReports(
      activeUserId,
      dateFrom,
      dateTo,
    );
  }
  @Post('/reports/assumption/')
  getAllAssumedPropertyReports(@Body() params) {
    const { activeUserId, dateFrom, dateTo } = params.payLoads;

    return this.notifService.getAllAssumedPropertyForReports(
      activeUserId,
      dateFrom,
      dateTo,
    );
  }
  @Get('/view-certain-notification/:notifType/:propertyId')
  getCertainNotificationType(
    @Param('notifType') notifType: string,
    @Param('propertyId') propertyId: number,
  ) {
    return this.notifService.getCertainNotificationType(notifType, propertyId);
  }
}
