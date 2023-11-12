import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InquiriesModel } from 'src/models/inquiries/Inquiries';
import { InquiriesService } from 'src/service/inquiries/inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiryService: InquiriesService) {}
  @Post('send-inquiry')
  sendInquiries(
    @Body() inquiry: InquiriesModel,
  ): Promise<ResponseData<string>> {
    return this.inquiryService.sendInquiries(inquiry);
  }
  @Get('get-inquiries/:userId')
  getAllInquiries(
    @Param('userId') userId: number,
  ): Promise<ResponseData<InquiriesModel[]>> {
    return this.inquiryService.getAllInquiries(userId);
  }
}
