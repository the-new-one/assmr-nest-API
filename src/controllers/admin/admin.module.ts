import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from 'src/service/admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/signup/signup.entity';
import { Vehicle } from 'src/entity/my-property/my-property';
import {
  House,
  HouseAndLot,
  Lot,
  Realeststate,
} from 'src/entity/my-property/my-realestate';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Property } from 'src/entity/my-property/property';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';

@Module({
  controllers: [AdminController],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Vehicle,
      Realeststate,
      HouseAndLot,
      House,
      Lot,
      Jewelry,
      Property,
      Assumer,
      Assumption,
    ]),
  ],
  providers: [AdminService],
})
export class AdminModule {}
