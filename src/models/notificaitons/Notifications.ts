export interface NotificationModel {
  notification_id: number;
  notification_userNotifReceiverId: number;
  notification_userNotifSenderId: number;
  notification_notificationType: string;
  notification_notificationContent: string;
  notification_isSeen: string;
  notification_notificationDate: string;
  notifSender_id: number;
  notifSender_email: string;
  notifSender_firstname: string;
  notifSender_middlename: string;
  notifSender_lastname: string;
  notifSender_contactno: string;
  notifSender_gender: string;
  notifSender_municipality: string;
  notifSender_province: string;
  notifSender_barangay: string;
}
