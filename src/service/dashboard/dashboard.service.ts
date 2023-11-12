import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Vehicle } from 'src/entity/my-property/my-property';
import { Realeststate } from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
import { Assumption } from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';
import { DashboardGetGraphsModel } from 'src/models/dashboard/DashboardModels';
import { Repository, getManager, getRepository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Realeststate)
    private realestateEntity: Repository<Realeststate>,
    @InjectRepository(Jewelry) private jewelryEntity: Repository<Jewelry>,
    @InjectRepository(Assumption)
    private assumptionEntity: Repository<Assumption>,
    @InjectRepository(User) private userEntity: Repository<User>,
  ) {}
  async getDashboardGraphs(
    userId: number,
  ): Promise<ResponseData<DashboardGetGraphsModel>> {
    const totalPostedVehicle = await this.vehicleRepo
      .createQueryBuilder('vehicle')
      .getCount();
    const totalPostedRealestate = await this.jewelryEntity
      .createQueryBuilder('realestate')
      .getCount();
    const totalPostedJewelry = await this.jewelryEntity
      .createQueryBuilder('jewelry')
      .getCount();
    // END MOST POSTED PROPERTY

    const totalAssumedVehicle = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoinAndSelect(Vehicle, 'vehicle')
      .where('assumption.propertyId = vehicle.propertyId')
      .getCount();
    const totalAssumedRealestate = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoinAndSelect(Realeststate, 'realestate')
      .where('realestate.propertyId = assumption.propertyId')
      .getCount();
    const totalAssumedJewelry = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoinAndSelect(Jewelry, 'jewelry')
      .where('jewelry.propertyId = assumption.propertyId')
      .getCount();

    // END MOST ASSUMED PROPERTY

    const preferredPropertyByGender = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoinAndSelect(
        Property,
        'property',
        'property.id = assumption.propertyId',
      )
      .innerJoinAndSelect(User, 'user', 'user.id = assumption.userId')
      .where('property.id = assumption.propertyId')
      .groupBy(
        'user.gender, property.property_type ORDER BY property.property_type ASC',
      )
      .select([
        'COUNT(*) as total, user.id, user.gender, property.property_type',
      ])
      .getRawMany();

    // END PREFERRED PROPERTY BY GENDER

    const activeUserPostedVehicleInfo = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoin(Property, 'property', 'property.id = assumption.propertyId')
      .innerJoin(User, 'user')
      .where('user.id = assumption.propowner_id')
      .andWhere('property.userId =:userId', { userId })
      .andWhere('user.id =:userId', { userId })
      .andWhere('assumption.isActive = 1')
      .groupBy('assumption.propertyId')
      .getRawMany();
    // e count niya, kung pila ang ni assume sa vehicle sa active na user;
    const activeUserPostedCancelledAssumption = await this.assumptionEntity
      .createQueryBuilder('assumption')
      .innerJoin(Property, 'property', 'property.id = assumption.propertyId')
      .innerJoin(User, 'user')
      .where('user.id = assumption.propowner_id')
      .andWhere('property.userId =:userId', { userId })
      .andWhere('user.id =:userId', { userId })
      .andWhere('assumption.isActive = 0')
      .groupBy('assumption.propertyId')
      .getRawMany();
    // END ABOUT / ACTIVE USER POSTED PROPERTY INFROMATION
    const concatResult = {
      totalPosted: {
        totalVehicle: totalPostedVehicle,
        totalJewelry: totalPostedJewelry,
        totalRealestate: totalPostedRealestate,
      },
      totalAssumed: {
        vehicle: totalAssumedVehicle,
        realestate: totalAssumedRealestate,
        jewelry: totalAssumedJewelry,
      },
      postedPropertyInformation: {
        yourPostedPropertyThatWasAssumed: activeUserPostedVehicleInfo.length, // total of the user who assumed your property,
        yourPostedPropertyThatCancelledTheirAssumption:
          activeUserPostedCancelledAssumption.length,
      },
      preferredByGender: preferredPropertyByGender,
    };
    // console.log(concatResult);
    return {
      code: 200,
      status: 1,
      message: 'Get Dashboard graphs.',
      data: concatResult,
    };
  }
}
