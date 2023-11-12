export interface IChatWithModel {
  activeUser: string;
  otherUser: string;
} // when active user want to chatt with certain user / person;

export interface IChatWithMessagesModel {
  messages_id: number;
  messages_senderId: number;
  messages_receiverId: number;
  messages_receiverMessageId: number;
  messages_senderMessageId: number;
  messages_message: string;
  messages_date: string;
  userSender_id: number;
  userSender_email: string;
  userSender_firstname: string;
  userSender_middlename: string;
  userSender_lastname: string;
  userSender_contactno: string;
  userSender_gender: string;
  userSender_municipality: string;
  userSender_province: string;
  userSender_barangay: string;
  userReceiver_id: number;
  userReceiver_email: string;
  userReceiver_firstname: string;
  userReceiver_middlename: string;
  userReceiver_lastname: string;
  userReceiver_contactno: string;
  userReceiver_gender: string;
  userReceiver_municipality: string;
  userReceiver_province: string;
  userReceiver_barangay: string;
  receiverMess_id: number;
  receiverMess_email: string;
  receiverMess_userId: number;
  senderMess_id: number;
  senderMess_email: string;
  senderMess_userId: number;
} // a fields returned for chatts of between users;

export interface IChatSendMessageModel {
  receiverId: number;
  senderId: number;
  activeUser: string;
  otherUser: string;
  message: string;
} // when sending a message to other user

export interface IChatWithListModel {
  messages_id: number;
  messages_senderId: number;
  messages_receiverId: number;
  messages_receiverMessageId: number;
  messages_senderMessageId: number;
  messages_message: string;
  messages_date: string;
  receiverMess_id: number;
  receiverMess_email: string;
  receiverMess_userId: number;
  senderMess_id: number;
  senderMess_email: string;
  senderMess_userId: number;
  userRes_id: number;
  userRes_email: string;
  userRes_firstname: string;
  userRes_middlename: string;
  userRes_lastname: string;
  userRes_contactno: string;
  userRes_gender: string;
  userRes_municipality: string;
  userRes_province: string;
  userRes_barangay: string;
  userSend_id: number;
  userSend_email: string;
  userSend_firstname: string;
  userSend_middlename: string;
  userSend_lastname: string;
  userSend_contactno: string;
  userSend_gender: string;
  userSend_municipality: string;
  userSend_province: string;
  userSend_barangay: string;
}
// para rani sa listing of users na naka chatt niya; pinaka current na chatt between users
