import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserFeedBacksModel } from 'src/models/feedbacks/FeedBacks';
import { FeedbacksService } from 'src/service/feedbacks/feedbacks.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedBackService: FeedbacksService) {}
  @Post('/user-feed')
  postUserFeedBack(
    @Body() feedback: UserFeedBacksModel,
  ): Promise<ResponseData<string>> {
    return this.feedBackService.postUserFeedBack(feedback);
  }
  @Get('user-feed')
  getUserFeedBacks(): Promise<ResponseData<UserFeedBacksModel[]>> {
    return this.feedBackService.getUserFeedBacks();
  }
  @Post('/create-rating')
  createRating(@Body() param: any) {
    return this.feedBackService.createRating(param);
  }
  @Get('/get-rating/:activeFilterType')
  getRating(
    @Param('activeFilterType') activeFilterType: string,
  ): Promise<ResponseData<any>> {
    return this.feedBackService.getRating(activeFilterType);
  }
}
