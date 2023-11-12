import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  MyCertainJewelryModel,
  MyJewelryPropertyModel,
  MyRealestatePropertyModel,
} from 'src/models/my-property/MyProperty';
import {
  CertainVehicleModel,
  PropertyAssumptionModel,
  VehicleAssumptionModel,
} from 'src/models/property-assumptions/PropertyAssumptions';
import { PropertyAsssumptionsService } from 'src/service/property-asssumptions/property-asssumptions.service';

@Controller('property-assumptions')
export class PropertyAssumptionsController {
  constructor(private propAssumpService: PropertyAsssumptionsService) {}
  @Post('vehicle-assumption')
  getAllVehicle(
    @Body() payloads: any,
  ): Promise<ResponseData<VehicleAssumptionModel[]>> {
    return this.propAssumpService.getAllVehicles(payloads);
  }
  // getAllVehicleBackUp(): Promise<ResponseData<VehicleAssumptionModel[]>> {
  //   return this.propAssumpService.getAllVehicles();
  // }
  // get all vehicle for assumptions
  @Get('vehicle-info/:vehicleId')
  getVehicleInfo(@Param('vehicleId') vehicleId: number) {
    this.propAssumpService.assumeVehicleProperty(null);
  } // get certain vehicle info
  @Post('property-submit-form-assumption')
  assumeVehicleProperty(
    @Body() assumptBody: any,
  ): Promise<ResponseData<string>> {
    return this.propAssumpService.assumeVehicleProperty(assumptBody);
  } // vehicle assumption
  @Get('/certain-vehicle/:propertyId')
  getCertainVehicle(
    @Param() param: { propertyId: number },
  ): Promise<ResponseData<CertainVehicleModel[]>> {
    return this.propAssumpService.getCertainVehicle(param);
  }
  @Post('realestate-assumption')
  getAllRealestate(
    @Body() payloads: any,
  ): Promise<ResponseData<MyRealestatePropertyModel[]>> {
    return this.propAssumpService.getAllRealestates(payloads);
  }
  @Get('certain-realestate/:propertyId/:realestateType')
  geCertainRealestate(
    @Param() param: { propertyId: number; realestateType: string },
  ): Promise<ResponseData<MyRealestatePropertyModel>> {
    return this.propAssumpService.getCertainRealestate(param);
  }
  @Post('jewelry-assumption')
  getAllJewelry(
    @Body() payloads: any,
  ): Promise<ResponseData<MyJewelryPropertyModel[]>> {
    return this.propAssumpService.getAllJewelries(payloads);
  }
  @Get('certain-jewelry/:jewelryID')
  getCertainJewelry(
    @Param('jewelryID') jewelryID: number,
  ): Promise<ResponseData<MyCertainJewelryModel>> {
    return this.propAssumpService.getCertainJewelry(jewelryID);
  }
}
