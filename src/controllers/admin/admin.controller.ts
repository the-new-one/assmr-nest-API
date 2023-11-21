import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
