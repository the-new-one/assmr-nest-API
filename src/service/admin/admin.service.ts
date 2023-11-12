import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Vehicle, VehicleImage } from 'src/entity/my-property/my-property';
import {
  Realeststate,
  HouseAndLot,
  House,
  Lot,
} from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Assumer) private assumerEntity: Repository<Assumer>,
    @InjectRepository(Assumption)
    private assumptionEntity: Repository<Assumption>,
    @InjectRepository(Vehicle) private vehicleEntity: Repository<Vehicle>,
    @InjectRepository(Realeststate)
    private realestateEntity: Repository<Realeststate>,
    @InjectRepository(Jewelry)
    private jewelryEntity: Repository<Jewelry>,
    @InjectRepository(HouseAndLot) private halEntity: Repository<HouseAndLot>,
    @InjectRepository(House) private houseEntity: Repository<House>,
    @InjectRepository(Lot) private lotEntity: Repository<Lot>,
    @InjectRepository(Property) private propertyEntity: Repository<Property>,
  ) {}
  async getHistory(param: {
    historyValue: string;
  }): Promise<ResponseData<any>> {
    let concatResult: any = [];
    const { historyValue } = param;
    switch (historyValue) {
      case 'accept/succesffull transaction':
        break;
      case 'cancelled transaction':
        break;
      case 'assumed transaction':
        break;
      case 'posted property':
        const Pvehicle = await this.vehicleEntity
          .createQueryBuilder('vehicle')
          .innerJoin(Property, 'property')
          .innerJoin(VehicleImage, 'vi')
          .where('vehicle.id = vi.vehicleId')
          .andWhere('property.id = vehicle.propertyId')
          .select(['property', 'vehicle', 'vi'])
          .getRawMany();
        const query =
          'SELECT hal.realestateId, hal.developer as developer, rs.isDropped, rs.downpayment, rs.installmentpaid,rs.owner, p.property_type as property_property_type, hal.hal_front_image as IMG FROM house_and_lot hal JOIN realeststate rs ON rs.id = hal.realestateId JOIN property p ON p.id = rs.propertyId WHERE rs.isDropped = 0 OR rs.isDropped = 1 UNION ALL SELECT h.realestateId, rs.isDropped, h.developer as developer, rs.downpayment, rs.installmentpaid,rs.owner, p.property_type property_property_type, h.house_front_image as IMG FROM house h JOIN realeststate rs ON rs.id = h.realestateId JOIN property p ON p.id = rs.propertyId WHERE rs.isDropped = 0 OR rs.isDropped = 1 UNION ALL SELECT l.realestateId, rs.isDropped, "`NA`" as developer,rs.downpayment, rs.installmentpaid, rs.owner, p.property_type property_property_type, l.lot_image as IMG FROM lot l JOIN realeststate rs ON rs.id = l.realestateId JOIN property p ON p.id = rs.propertyId WHERE rs.isDropped = 0 OR rs.isDropped = 1';
        const Prealestate = await this.realestateEntity.query(query);
        // const Prealestate = await this.realestateEntity
        //   .createQueryBuilder('realestate')
        // .innerJoin(Property, 'property')
        // .innerJoin(HouseAndLot, 'hal', 'hal.realestateId = realestate.id')
        // .innerJoin(House, 'house', 'house.realestateId = realestate.id')
        // .innerJoin(Lot, 'lot', 'lot.realestateId = realestate.id')
        // .select(['property', 'realestate', 'hal', 'house', 'lot'])
        // .where('property.id = realestate.propertyId')
        // // .getRawMany();
        // .getSql();
        // console.log(Prealestate);
        const Pjewelry = await this.jewelryEntity
          .createQueryBuilder('jewelry')
          .innerJoin(Property, 'property')
          .select(['property', 'jewelry'])
          .where('property.id = jewelry.propertyId')
          .getRawMany();
        concatResult = {
          type: 'posted property',
          result: [...Pvehicle, ...Prealestate, ...Pjewelry],
        };
        break;
      case 'deleted property':
        const Dvehicle = await this.vehicleEntity
          .createQueryBuilder('vehicle')
          .innerJoin(Property, 'property')
          .where('vehicle.isDropped = 1 AND property.id = vehicle.propertyId')
          .select(['vehicle', 'property'])
          .getRawMany();
        const Drealestate = await this.realestateEntity
          .createQueryBuilder('realestate')
          .innerJoin(Property, 'property')
          .where(
            'realestate.isDropped = 1 AND property.id = realestate.propertyId',
          )
          .select(['realestate', 'property'])
          .getRawMany();
        const Djewelry = await this.jewelryEntity
          .createQueryBuilder('jewelry')
          .innerJoin(Property, 'property')
          .where('jewelry.isDropped = 1 AND property.id = jewelry.propertyId')
          .select(['jewelry', 'property'])
          .getRawMany();
        concatResult = {
          type: 'deleted property',
          result: [...Dvehicle, ...Drealestate, ...Djewelry],
        };
        break;
      case 'on-going transaction':
        const ONvehicle = await this.vehicleEntity
          .createQueryBuilder('vehicle')
          .innerJoin(Assumer, 'assumer')
          .innerJoin(Assumption, 'assumpt')
          .innerJoin(User, 'userAssumer')
          .innerJoin(User, 'userOwner')
          .innerJoin(Property, 'property')
          .where('vehicle.propertyId = assumpt.propertyId')
          .andWhere('userAssumer.id = assumpt.userId')
          .andWhere('userOwner.id = property.userId')
          .andWhere('property.id = assumpt.propertyId')
          .select([
            'vehicle',
            'userOwner',
            'userAssumer',
            'assumer',
            'assumpt',
            'property',
          ])
          .groupBy('assumpt.id')
          .getRawMany();

        const ONrealestate = await this.realestateEntity
          .createQueryBuilder('realestate')
          .innerJoin(Assumer, 'assumer')
          .innerJoin(Assumption, 'assumpt')
          .innerJoin(User, 'userAssumer')
          .innerJoin(User, 'userOwner')
          .innerJoin(Property, 'property')
          .where('realestate.propertyId = assumpt.propertyId')
          .andWhere('realestate.propertyId = property.id')
          .andWhere('userAssumer.id = assumpt.userId')
          .andWhere('userOwner.id = property.userId')
          .andWhere('property.id = assumpt.propertyId')
          .select([
            'realestate',
            'userOwner',
            'userAssumer',
            'assumer',
            'assumpt',
            'property',
          ])
          .groupBy('assumpt.id')
          .getRawMany();

        const ONjewelry = await this.jewelryEntity
          .createQueryBuilder('jewelry')
          .innerJoin(Assumer, 'assumer')
          .innerJoin(Assumption, 'assumpt')
          .innerJoin(User, 'userAssumer')
          .innerJoin(User, 'userOwner')
          .innerJoin(Property, 'property')
          .where('jewelry.propertyId = assumpt.propertyId')
          .andWhere('jewelry.propertyId = property.id')
          .andWhere('userAssumer.id = assumpt.userId')
          .andWhere('userOwner.id = property.userId')
          .andWhere('property.id = assumpt.propertyId')
          .select([
            'jewelry',
            'userOwner',
            'userAssumer',
            'assumer',
            'assumpt',
            'property',
          ])
          .groupBy('assumpt.id')
          .getRawMany();

        concatResult = {
          type: 'on-going transaction',
          result: [...ONvehicle, ...ONrealestate, ...ONjewelry],
        };
        break;
      default:
        console.log('No historyValue');
    }
    // console.log(concatResult);

    return {
      code: 200,
      status: 1,
      message: 'Admin histories',
      data: concatResult,
    };
  }
}
