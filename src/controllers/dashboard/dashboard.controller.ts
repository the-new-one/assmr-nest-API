import { Controller, Get, Param } from '@nestjs/common';
import { DashboardGetGraphsModel } from 'src/models/dashboard/DashboardModels';
import { DashboardService } from 'src/service/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashBoardService: DashboardService) {}
  @Get('/dashboard-graphs-most-posted-property/:userId')
  getDashboardGraphs(
    @Param('userId') userId: number,
  ): Promise<ResponseData<DashboardGetGraphsModel>> {
    return this.dashBoardService.getDashboardGraphs(userId);
  }
}
