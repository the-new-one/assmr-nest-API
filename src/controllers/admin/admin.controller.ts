import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from 'src/service/admin/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post('histories')
  getHistory(@Body() historyValue: { historyValue: string }) {
    return this.adminService.getHistory(historyValue);
  }
}
