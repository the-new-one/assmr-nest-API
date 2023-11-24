import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from 'src/service/admin/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post('histories')
  getHistory(@Body() historyValue: { historyValue: string }) {
    return this.adminService.getHistory(historyValue);
  }
  @Get('admin')
  getGraphs() {
    return this.adminService.getAdminGraphs();
  }
  @Get('/subscriptions')
  getUserSubscriptions() {
    return this.adminService.getUserSubscriptions();
  }
  @Get('/feedbacks')
  getUserFeedBacks() {
    return this.adminService.getUserFeedBacks();
  }
  @Get('/dropped-property')
  getAllDroppedProperty() {
    return this.adminService.getAllDroppedProperty();
  }
  @Get('/get-all-ratings/:activeView')
  getAllRatings(@Param() param: { activeView: string }) {
    return this.adminService.getAllRatings(param);
  }
}
