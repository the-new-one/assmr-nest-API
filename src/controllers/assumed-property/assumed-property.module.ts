import { Module } from '@nestjs/common';
import { AssumedPropertyController } from './assumed-property.controller';
import { AssumedPropertyService } from 'src/service/assumed-property/assumed-property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/signup/signup.entity';
import { Vehicle } from 'src/entity/my-property/my-property';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';

@Module({
  controllers: [AssumedPropertyController],
  providers: [AssumedPropertyService],
  imports: [TypeOrmModule.forFeature([Assumer, Assumption, User, Vehicle])],
})
export class AssumedPropertyModule {}
