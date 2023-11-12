import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { AssumedPropertyService } from 'src/service/assumed-property/assumed-property.service';

@Controller('assumed-property')
export class AssumedPropertyController {
  constructor(private assPropService: AssumedPropertyService) {}
  @Get('vehicle-assumed-property/:userId')
  getAllAssumedProperty(@Param() param: any) {
    return this.assPropService.getAllAssumedProperty(param);
  }
  @Post('vehicle-user-removed-assumption')
  removedVehicleAssumption(@Body() param: { assumptionID: number }) {
    const { assumptionID } = param;

    return this.assPropService.removeRemovedAssumption(assumptionID);
  }
}
