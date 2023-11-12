import { Body, Controller, Post } from '@nestjs/common';
import {
  IChatSendMessageModel,
  IChatWithListModel,
  IChatWithMessagesModel,
  IChatWithModel,
} from 'src/models/messages/MessagesModel';
import { MessagesService } from 'src/service/messages/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}
  @Post('iChatWith')
  getIChatWith(
    @Body() params: IChatWithModel,
  ): Promise<ResponseData<IChatWithMessagesModel[]>> {
    return this.messageService.getIChatWith(params);
  } // between to users
  @Post('sendMessageWith')
  iSendMessageWith(@Body() messageData: IChatSendMessageModel) {
    return this.messageService.iSendMessageWith(messageData);
  } // send message to other user
  @Post('iInteractedWith')
  getAllMyChatLists(
    @Body() param: any,
  ): Promise<ResponseData<IChatWithListModel[]>> {
    return this.messageService.getAllMyChatLists(param);
  }
  // list all users that was interacted by active user
}
