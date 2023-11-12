/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Vehicle } from 'src/entity/my-property/my-property';
import {
  House,
  HouseAndLot,
  Lot,
  Realeststate,
} from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
import { Notifications } from 'src/entity/notifications/Notifications';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';
import {
  MyCertainJewelryModel,
  MyJewelryPropertyModel,
  MyRealestatePropertyModel,
} from 'src/models/my-property/MyProperty';
import {
  CertainVehicleModel,
  PropertyAssumptionModel,
  VehicleAssumptionModel,
  VehicleForAssumptionInformationModel,
} from 'src/models/property-assumptions/PropertyAssumptions';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PropertyAsssumptionsService {
  constructor(
    @InjectRepository(Vehicle) private vehicleEntity: Repository<Vehicle>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Assumer) private assumerEntity: Repository<Assumer>,
    @InjectRepository(Assumption)
    private assumptionEntity: Repository<Assumption>,
    @InjectRepository(Notifications)
    private notificationEntity: Repository<Notifications>,
    @InjectRepository(Realeststate)
    private realestateEntity: Repository<Realeststate>,
    @InjectRepository(HouseAndLot) private halEntity: Repository<HouseAndLot>,
    @InjectRepository(House) private houseEntity: Repository<House>,
    @InjectRepository(Lot) private lotEntity: Repository<Lot>,
    @InjectRepository(Jewelry)
    private jewelryEntiy: Repository<Jewelry>,
    private dataSource: DataSource,
  ) {}
  async getAllVehiclesBackUp(): Promise<
    ResponseData<VehicleAssumptionModel[]>
  > {
    // const properties = (await this.userEntity
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.vehicles', 'vehicle')
    //   .leftJoinAndSelect('vehicle.vehicleImages', 'vehicle_image')
    //   .where('user.id = vehicle.userId')
    //   .andWhere('vehicle.id = vehicle_image.vehicleId')
    //   .select([
    //     'user.id',
    //     'user.firstname',
    //     'user.middlename',
    //     'user.lastname',
    //     'user.contactno',
    //     'user.municipality',
    //     'user.province',
    //     'user.barangay',
    //     'user.email',
    //     'vehicle',
    //     'vehicle_image',
    //   ])
    // .getMany()) as VehicleAssumptionModel[];

    return {
      code: 200,
      status: 1,
      message: 'vehicle assumption',
      data: [],
    };
  }
  async getAllVehicles(
    payloads: any,
  ): Promise<ResponseData<VehicleAssumptionModel[] | []>> {
    let concatFilter: string = '';
    for (let i = 0; i < Object.keys(payloads).length; i++) {
      if (i === 0) {
        concatFilter = 'AND ';
      }
      const keys: string = `vehicle.${Object.keys(payloads)[i]}`;
      const value: string = `${payloads[Object.keys(payloads)[i]]}`;
      if (value.length > 0) {
        concatFilter += `${keys} LIKE '%${value}%' OR `;
      }
    }
    concatFilter = concatFilter.substring(0, concatFilter.length - 4);

    const entity = await this.vehicleEntity
      .createQueryBuilder('vehicle')
      .innerJoinAndSelect(User, 'user', 'user.id = vehicle.userId')
      .innerJoinAndSelect('vehicle.vehicleImages', 'vehicleImages')
      .innerJoinAndSelect(Property, 'property', 'property.userId = user.id')
      .where(`vehicle.id = vehicleImages.vehicleId ${concatFilter}`)
      .andWhere('property.id = vehicle.propertyId')
      .andWhere('vehicle.isDropped = 0')
      .select(['user', 'vehicle', 'vehicleImages', 'property'])
      .getRawMany();
    // .getSql();
    // console.log(entity);
    return {
      code: 200,
      status: 1,
      message: 'vehicle assumption',
      data: entity,
    };
  }
  // for assumptions purposes
  async assumeVehicleProperty(
    @Body() assumptionForm: any,
  ): Promise<ResponseData<string>> {
    const {
      userID,
      propertyID,
      ownerID,
      firstname,
      middlename,
      lastname,
      contactno,
      address,
      job,
      monthSalary,
    } = assumptionForm;

    const checkIfAssumedAlready = await this.assumptionEntity
      .createQueryBuilder()
      .where('userId =:userID', { userID })
      .andWhere('propertyId =:propertyID', { propertyID })
      .getCount();

    if (checkIfAssumedAlready > 0) {
      return {
        code: 409,
        status: 0,
        message: 'You can not assume twice of this property.',
        data: 'Duplicate assumption.',
      };
    }
    const assumerResp = await this.assumerEntity
      .createQueryBuilder()
      .insert()
      .into(Assumer)
      .values({
        userId: userID,
        assumer_income: monthSalary,
        assumer_work: job,
      })
      .execute();
    const assumerID = assumerResp.raw.insertId;

    this.assumerEntity
      .createQueryBuilder()
      .insert()
      .into(Assumption)
      .values({
        userId: userID,
        propertyId: propertyID,
        assumerId: assumerID,
        propowner_id: ownerID,
        transaction_date: new Date(),
        isActive: '1',
      })
      .execute();
    this.notificationEntity
      .createQueryBuilder('notifications')
      .insert()
      .into(Notifications)
      .values({
        userNotifReceiverId: ownerID,
        userNotifSenderId: userID,
        notificationType: 'assumption',
        notificationContent: 'Someone assumed your property',
        isSeen: 'false',
        notificationDate: new Date(),
      })
      .execute();
    return {
      code: 200,
      status: 1,
      message: 'Property was assumed successfully.',
      data: 'Successfully assumed.',
    };
  } // this assume a vehicle property
  async getCertainVehicle(param: {
    propertyId: number;
  }): Promise<ResponseData<CertainVehicleModel[]>> {
    const { propertyId } = param;
    // console.log(param);
    const vehicle = await this.vehicleEntity
      .createQueryBuilder('vehicle')
      .innerJoin('vehicle.vehicleImages', 'vehicleImages')
      .where('vehicle.propertyId = :propertyId', { propertyId })
      .select([
        'userId',
        'brand',
        'model',
        'owner',
        'downpayment',
        'location',
        'installmentpaid',
        'delinquent',
        'description',
        'vehicleImages',
      ])
      .getRawMany();
    // console.log(vehicle);
    return {
      code: 200,
      status: 1,
      message: 'Get certain vehicle',
      data: vehicle,
    };
  }
  async getAllRealestates(
    payloads: any,
  ): Promise<ResponseData<MyRealestatePropertyModel[]>> {
    const { realestateType, developer, owner } = payloads;
    const tempPayload = { developer, owner };
    let tableName = null;
    tableName =
      realestateType === 'house and lot'
        ? HouseAndLot
        : realestateType === 'house'
        ? House
        : Lot;
    const astableName =
      realestateType === 'house and lot'
        ? 'hal'
        : realestateType === 'house'
        ? 'house'
        : 'lot';
    let concatFilter = '';
    for (let i = 0; i < Object.keys(tempPayload).length; i++) {
      if (i === 0) {
        concatFilter = '';
      }
      if (astableName !== 'lot') {
        const key = `realestate.owner LIKE '%${
          owner ?? ''
        }%' AND ${astableName}.developer LIKE '%${developer ?? ''}%'`;
        concatFilter = key;
      } else {
        const key = `realestate.owner LIKE '%${owner ?? ''}%'`;
        concatFilter = key;
      }
    }
    const realestate = await this.realestateEntity
      .createQueryBuilder('realestate')
      .innerJoinAndSelect(User, 'user', 'user.id = realestate.userId')
      .innerJoinAndSelect(
        tableName,
        astableName,
        `${astableName}.realestateId = realestate.id`,
      )
      .where(concatFilter)
      .getRawMany();
    // .getSql();

    // console.log(realestate);
    // console.log(payloads);
    return {
      code: 200,
      status: 1,
      message: 'Realestate proeprty.',
      data: realestate,
    };
  }
  async getCertainRealestate(param: {
    propertyId: number;
    realestateType: string;
  }): Promise<ResponseData<MyRealestatePropertyModel>> {
    // console.log(param);
    const { propertyId, realestateType } = param;
    const tableName =
      realestateType === 'house and lot'
        ? HouseAndLot
        : realestateType === 'house'
        ? House
        : Lot;
    const astableName =
      realestateType === 'house and lot'
        ? 'hal'
        : realestateType === 'house'
        ? 'house'
        : 'lot';

    const realestate = await this.realestateEntity
      .createQueryBuilder('realestate')
      .innerJoinAndSelect(
        tableName,
        astableName,
        `${astableName}.realestateId = realestate.id`,
      )
      .innerJoinAndSelect(User, 'user', 'user.id = realestate.userId')
      .where('realestate.isDropped = 0')
      .andWhere('realestate.propertyId =:propertyId', {
        propertyId: propertyId,
      })
      .getRawOne();

    // console.log(realestate);

    return {
      code: 200,
      status: 1,
      message: 'View certain realestate',
      data: realestate,
    };
  }
  async getAllJewelries(
    payloads: any,
  ): Promise<ResponseData<MyJewelryPropertyModel[]>> {
    let concatFilter: string = '';

    for (let i = 0; i < Object.keys(payloads).length; i++) {
      if (i !== 0) {
        concatFilter += `jewelry.jewelry_${Object.keys(payloads)[i]} LIKE '%${
          payloads[Object.keys(payloads)[i]]
        }%' AND `;
      }
    }

    concatFilter = concatFilter.substring(0, concatFilter.length - 4);
    const jewelries = await this.jewelryEntiy
      .createQueryBuilder('jewelry')
      .innerJoinAndSelect(User, 'user', 'user.id = jewelry.userId')
      .where(`${concatFilter}`)
      .getRawMany();

    return {
      code: 200,
      status: 1,
      message: 'Jewelry properties',
      data: jewelries,
    };
  }
  async getCertainJewelry(
    jewelryID: number,
  ): Promise<ResponseData<MyCertainJewelryModel>> {
    // console.log(jewelryID);
    const jewelry = await this.jewelryEntiy
      .createQueryBuilder('jewelry')
      .innerJoinAndSelect(User, 'user', 'user.id = jewelry.userId')
      .where('propertyId =:propertyId', { propertyId: jewelryID })
      .andWhere('isDropped = 0')
      .getRawOne();
    // console.log(jewelry);
    return {
      code: 200,
      status: 1,
      message: 'Certain jewelry',
      data: jewelry,
    };
  }
}
