import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from 'src/service/dashboard/dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/entity/my-property/my-property';
import { Realeststate } from 'src/entity/my-property/my-realestate';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Assumption } from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [TypeOrmModule.forFeature([Vehicle, Realeststate, Jewelry, Assumption, User])],
  exports: [TypeOrmModule],
})
export class DashboardModule {}
