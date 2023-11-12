import { Module } from '@nestjs/common';
import { MyPropertyController } from './my-property.controller';
import { Vehicle, VehicleImage } from 'src/entity/my-property/my-property';
import { MyPropertyService } from 'src/service/my-property/my-property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/signup/signup.entity';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import {
  House,
  HouseAndLot,
  Lot,
  Realeststate,
} from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
@Module({
  controllers: [MyPropertyController],
  providers: [MyPropertyService],
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      VehicleImage,
      User,
      Assumer,
      Assumption,
      Jewelry,
      Realeststate,
      HouseAndLot,
      House,
      Lot,
      Property
    ]),
  ],
  exports: [TypeOrmModule],
})
export class MyPropertyModule {}
