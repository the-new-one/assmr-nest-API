import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';
import { AssumptionInformationModel } from 'src/models/assumed-property/AssumedProperty';
import { Repository } from 'typeorm';

@Injectable()
export class AssumedPropertyService {
  constructor(
    @InjectRepository(Assumer) private assumerEntity: Repository<Assumer>,
    @InjectRepository(Assumption)
    private assumptnEntity: Repository<Assumption>,
  ) {}
  async getAllAssumedProperty(param: {
    userId: number;
  }): Promise<ResponseData<AssumptionInformationModel[]>> {
    const { userId } = param;
    const vehicleRecords = await this.assumerEntity
      .createQueryBuilder('assumer')
      .innerJoin('assumption', 'assumption')
      .innerJoin('user', 'user')
      .innerJoin('vehicle', 'vehicle')
      .innerJoin('vehicle_image', 'vehicle_image')
      .innerJoin('property', 'property')
      .select(['user', 'assumption', 'vehicle', 'vehicle_image', 'property'])
      // .distinct()
      .where('user.id = assumption.propowner_id')
      .andWhere('property.id = assumption.propertyId')
      .andWhere('vehicle.userId = user.id')
      .andWhere('vehicle.id = vehicle_image.vehicleId')
      .andWhere('assumer.userId =:userId', { userId })
      .andWhere('assumption.userId =:userId', { userId })
      .andWhere('assumption.propertyId = vehicle.propertyId')

      .andWhere('assumption.isActive =:isActive', { isActive: '1' })
      // .getQuery();
      .execute();
    // console.log(assumed_records);
    const realestateRecords = await this.assumerEntity
      .createQueryBuilder('assumer')
      .innerJoinAndSelect('assumption', 'assumption')
      .innerJoinAndSelect('user', 'user')
      .innerJoinAndSelect('realeststate', 'realeststate')
      .innerJoinAndSelect('property', 'property')
      .select(['user', 'assumption', 'realeststate', 'property'])
      .distinct()
      .where('property.property_type = "realestate"')

      .andWhere('user.id = assumption.propowner_id')
      .andWhere('property.id = assumption.propertyId')
      .andWhere('realeststate.userId = user.id')
      .andWhere('assumption.propertyId = realeststate.propertyId')
      .andWhere('assumer.userId =:userId', { userId })
      .andWhere('assumption.userId =:userId', { userId })
      .andWhere('assumption.isActive =:isActive', { isActive: '1' })
      .groupBy('assumption.propertyId')
      .getRawMany();

    const jewelryRecords = await this.assumerEntity
      .createQueryBuilder('assumer')
      .innerJoin('assumption', 'assumption')
      .innerJoin('user', 'user')
      .innerJoin('jewelry', 'jewelry')
      .innerJoin('property', 'property')
      // .distinct()
      .where('user.id = assumption.propowner_id')
      .andWhere('property.id = assumption.propertyId')
      .andWhere('jewelry.userId = user.id')
      .andWhere('assumer.userId =:userId', { userId })
      .andWhere('assumption.userId =:userId', { userId })
      .andWhere('assumption.propertyId = jewelry.propertyId')
      .andWhere('property.userId = user.id')
      .andWhere('assumption.isActive =:isActive', { isActive: '1' })
      .select(['assumer', 'assumption', 'user', 'jewelry', 'property'])
      .execute();
    // console.log(jewelryRecords);

    const combinedRecords = [
      ...vehicleRecords,
      ...realestateRecords,
      ...jewelryRecords,
    ];
    // console.log(combinedRecords);
    return {
      code: 200,
      status: 1,
      message: 'Assumed properties.',
      data: combinedRecords,
    };
  }
  async removeRemovedAssumption(
    assumerID: number,
  ): Promise<ResponseData<string>> {
    this.assumptnEntity
      .createQueryBuilder('assumer')
      .update(Assumption)
      .set({
        isActive: '0',
      })
      .where('assumer.id =:assumerID', { assumerID })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Assumption was removed.',
      data: 'Assumption was removed successfully.',
    };
  }
}
