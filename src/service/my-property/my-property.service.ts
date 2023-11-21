import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Vehicle, VehicleImage } from 'src/entity/my-property/my-property';
import {
  House,
  HouseAndLot,
  Lot,
  Realeststate,
} from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
import {
  Assumer,
  Assumption,
} from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';
import { UserSubscription } from 'src/entity/subscription/Subscription';
import {
  AssumerListModel,
  MyJewelryPropertyModel,
  MyRealestatePropertyModel,
  MyVehiclePropertyModel,
  UpdateJewelryInformationModel,
  UpdateRealestateInformationModel,
  UpdateVehicleInformationModel,
} from 'src/models/my-property/MyProperty';
import {
  JewelryOwnerModel,
  RealestateOwnerModel,
  VehicleOwnerModel,
} from 'src/models/user/UserModel';
import { checkSubscriptionEveryItemPost } from 'src/utils/utils';
import { In, Repository } from 'typeorm';

@Injectable()
export class MyPropertyService {
  constructor(
    @InjectRepository(Vehicle) private vehicleEntity: Repository<Vehicle>,
    @InjectRepository(VehicleImage)
    private vehicleIMGEntity: Repository<VehicleImage>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Assumer) private assumerEntity: Repository<Assumer>,
    @InjectRepository(Assumption)
    private assumptionEntity: Repository<Assumption>,
    @InjectRepository(Jewelry)
    private Jewelry: Repository<Jewelry>,
    @InjectRepository(Realeststate)
    private realestateEntity: Repository<Realeststate>,
    @InjectRepository(HouseAndLot) private halEntity: Repository<HouseAndLot>,
    @InjectRepository(House) private houseEntity: Repository<House>,
    @InjectRepository(Lot) private lotEntity: Repository<Lot>,
    @InjectRepository(Property) private propertyEntity: Repository<Property>,
    @InjectRepository(Jewelry) private jewelryEntity: Repository<Jewelry>,
    @InjectRepository(UserSubscription)
    private userSubscription: Repository<UserSubscription>,
  ) {}
  async uploadVehicleProperty(
    uploaderInfo: VehicleOwnerModel,
    pathLists: string[],
  ): Promise<ResponseData<[]>> {
    const activeUser = await this.userEntity.findOne({
      select: {
        id: true,
      },
      where: {
        email: uploaderInfo.email,
      },
    });

    const uploadInfo = {
      userId: activeUser.id,
      color: uploaderInfo.color,
      brand: uploaderInfo.brand,
      model: uploaderInfo.model,
      milage: uploaderInfo.milage,
      condition: uploaderInfo.condition,
      issue: uploaderInfo.issue,
      owner: uploaderInfo.owner,
      location: uploaderInfo.location,
      downpayment: uploaderInfo.downpayment,
      installmentpaid: uploaderInfo.installmentpaid,
      installmentduration: uploaderInfo.installmentduration,
      remainingMonthsToPaid: uploaderInfo.remainingMonthsToPaid,
      assumePrice: uploaderInfo.assumePrice,
      monthlyPayment: uploaderInfo.monthlyPayment,
      delinquent: uploaderInfo.delinquent,
      description: uploaderInfo.description,
      modeOfPayment: uploaderInfo.modeOfPayment,
      isDropped: '0',
      propertyId: 0,
    };

    if (
      !(await checkSubscriptionEveryItemPost(
        this.userSubscription,
        activeUser.id,
      ))
    ) {
      return {
        code: 401,
        status: 1,
        message: 'Please subscribe to post a new property.',
        data: [],
      };
    }

    const property = await this.propertyEntity
      .createQueryBuilder('property')
      .insert()
      .into(Property)
      .values({
        userId: () => activeUser.id.toString(),
        property_type: 'vehicle',
      })
      .execute();

    uploadInfo.propertyId = property.raw.insertId;

    const vehicle = await this.vehicleEntity
      .createQueryBuilder()
      .insert()
      .into(Vehicle)
      .values(uploadInfo)
      .execute();

    const vehicleID = vehicle.raw.insertId;

    this.vehicleIMGEntity
      .createQueryBuilder()
      .insert()
      .into(VehicleImage)
      .values({
        vehicleId: vehicleID,
        vehicleFrontIMG: JSON.stringify(pathLists),
      })
      .execute();
    this.userSubscription.decrement(
      {
        userId: activeUser.id,
      },
      'maxNoToPost',
      1,
    ); // update the maxNoToPost every time the user post a new property

    const response: ResponseData<[]> = {
      code: 1,
      status: 200,
      message: 'Vehicle Property was uploaded.',
      data: [],
    };

    return response;
  }
  async getActiveUserProperty(
    email: string,
  ): Promise<ResponseData<MyVehiclePropertyModel[]>> {
    const activeUser = await this.userEntity.findOne({
      select: {
        id: true,
      },
      where: {
        email: email,
      },
    });

    const userId = activeUser.id;
    const subQ = await this.vehicleEntity
      .createQueryBuilder('vv')
      .innerJoin(Assumption, 'asmpt', 'asmpt.propertyId = vv.propertyId')
      .innerJoin(
        Assumer,
        'asmr',
        'asmr.id = asmpt.assumerId AND vehicle.id = vv.id AND asmpt.isActive = 1',
      )
      .select('COUNT(vv.id)')
      .getSql();

    const res = await this.vehicleEntity
      .createQueryBuilder('vehicle')
      .innerJoinAndMapMany(
        'vehicle.vehicleIMG',
        'vehicle_image',
        'vehicle_image',
        'vehicle_image.vehicleID = vehicle.id',
      )
      .where('vehicle.userID =:userID', { userID: userId })
      .andWhere('vehicle.isDropped = 0')
      .select(['vehicle', 'vehicle_image', `(${subQ}) as totalAssumption`])
      .getRawMany();
    // .getSql();

    // console.log(res);
    return {
      code: 0,
      status: 200,
      message: 'Fetching vehicle properties',
      data: res,
    };
  }
  async getCertainVehicle(vehicleID: number) {
    const vehicle = await this.vehicleEntity
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.vehicleImages', 'vehicleIMG')
      .where('vehicle.id =:vehicleID', { vehicleID })
      .getOne();
    // console.log(vehicle);
    return {
      code: 200,
      status: 1,
      message: 'You certain vehicle',
      data: vehicle,
    };
  }
  async updateCertainVehicle(
    vehicleInfo: UpdateVehicleInformationModel,
  ): Promise<ResponseData<string>> {
    const {
      id,
      color,
      brand,
      model,
      milage,
      condition,
      issue,
      owner,
      downpayment,
      location,
      installmentpaid,
      installmentduration,
      remainingMonthsToPaid,
      assumePrice,
      monthlyPayment,
      modeOfPayment,
      delinquent,
      description,
    }: UpdateVehicleInformationModel = vehicleInfo;

    this.vehicleEntity
      .createQueryBuilder('vehicle')
      .update(Vehicle)
      .set({
        color,
        brand,
        model,
        milage,
        condition,
        issue,
        owner,
        downpayment,
        location,
        installmentpaid,
        installmentduration,
        remainingMonthsToPaid,
        assumePrice,
        monthlyPayment: monthlyPayment,
        modeOfPayment,
        delinquent,
        description,
      })
      .where('vehicle.id =:vehicleID', { vehicleID: id })
      .execute();

    return {
      code: 200,
      status: 1,
      message: `Certain vehicle update.`,
      data: `${brand} Vehicle was updated.`,
    };
  }
  async removeCertainVehicle(param: any): Promise<ResponseData<string>> {
    const { vehicleID } = param;
    this.vehicleEntity
      .createQueryBuilder('vehicle')
      .update(Vehicle)
      .set({
        isDropped: '1',
      })
      .where('vehicle.id =:vehicleID', { vehicleID })
      .execute();
    // console.log(vehicleID);

    return {
      code: 200,
      status: 1,
      message: 'Vehicle was removed.',
      data: 'Certain vehicle was removed.',
    };
  }
  async getAllMyAssumedProperty(param: { userId: number }) {
    // console.log(param);

    const assumer = await this.assumerEntity
      .createQueryBuilder('assumer')
      .where('userId =:userId', { userId: 1 })
      .select(['transaction_date']);

    // console.log(assumer);
  }
  async listAssumerOfMyProperty(param: {
    propertyId: number;
    propertyType: string;
  }): Promise<ResponseData<AssumerListModel>> {
    const { propertyId, propertyType } = param;
    let assumerList = null;

    switch (propertyType) {
      case 'vehicle':
        assumerList = await this.assumerEntity
          .createQueryBuilder('assumer')
          .leftJoinAndSelect(
            Assumption,
            'asmpt',
            'asmpt.assumerId = assumer.id',
          )
          .leftJoinAndSelect(
            Vehicle,
            'vehicle',
            'vehicle.propertyId = asmpt.propertyId',
          )
          .leftJoinAndSelect(User, 'user', 'user.id = assumer.userId')
          .where('asmpt.propertyId =:propertyId', { propertyId })
          .andWhere('asmpt.isActive =:isActive', { isActive: 1 })
          .select(['user', 'assumer', 'asmpt'])
          .getRawMany();
        break;
      case 'realestate':
        assumerList = await this.assumerEntity
          .createQueryBuilder('assumer')
          .leftJoinAndSelect(
            Assumption,
            'asmpt',
            'asmpt.assumerId = assumer.id',
          )
          .leftJoinAndSelect(
            Realeststate,
            'realestate',
            'realestate.propertyId = asmpt.propertyId',
          )
          .leftJoinAndSelect(User, 'user', 'user.id = assumer.userId')
          .where('asmpt.propertyId =:propertyId', { propertyId })
          .andWhere('asmpt.isActive =:isActive', { isActive: 1 })
          .select(['user', 'assumer', 'asmpt'])
          .getRawMany();
        break;
      case 'jewelry':
        assumerList = await this.assumerEntity
          .createQueryBuilder('assumer')
          .leftJoinAndSelect(
            Assumption,
            'asmpt',
            'asmpt.assumerId = assumer.id',
          )
          .leftJoinAndSelect(
            Jewelry,
            'jewelry',
            'jewelry.propertyId = asmpt.propertyId',
          )
          .leftJoinAndSelect(User, 'user', 'user.id = assumer.userId')
          .where('asmpt.propertyId =:propertyId', { propertyId })
          .andWhere('asmpt.isActive =:isActive', { isActive: 1 })
          .select(['user', 'assumer', 'asmpt'])
          .getRawMany();
        break;
      default:
        console.log(
          'No propertyType => service/my-property/my-property.service.ts',
        );
    }
    // console.log(assumerList);
    return {
      code: 200,
      status: 1,
      message: 'Assumer list',
      data: assumerList as unknown as AssumerListModel,
    };
  }
  async removeAssumer(assumerId: number): Promise<ResponseData<string>> {
    this.assumptionEntity
      .createQueryBuilder('assumption')
      .update(Assumption)
      .set({ isActive: '0' })
      .where('assumption.assumerId =:assumerId', { assumerId })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'removing assumption',
      data: 'Assumer was removed',
    };
  }
  async uploadJewelryProperty(
    uploaderInfo: JewelryOwnerModel,
    pathLists: string[],
  ): Promise<ResponseData<any>> {
    const {
      email,
      jewelryName,
      jewelryModel,
      owner,
      downpayment,
      location,
      installmentpaid,
      installmentduration,
      delinquent,
      description,
      karat,
      grams,
      material,
      modeOfPayment,
      remainingMonthsToPaid,
      assumePrice,
      monthlyPayment,
    } = uploaderInfo;

    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['id'])
      .where('email =:userEmail', { userEmail: email })
      .execute();

    if (
      !(await checkSubscriptionEveryItemPost(this.userSubscription, user.id))
    ) {
      return {
        code: 401,
        status: 1,
        message: 'Please subscribe to post a new property.',
        data: [],
      };
    }

    const property = await this.propertyEntity
      .createQueryBuilder('property')
      .insert()
      .into(Property)
      .values({
        userId: user[0].id,
        property_type: 'jewelry',
      })
      .execute();

    this.Jewelry.createQueryBuilder('jewelries')
      .insert()
      .into(Jewelry)
      .values({
        user: () => (user.id = user[0].id),
        jewelry_owner: owner,
        jewelry_name: jewelryName,
        jewelry_model: jewelryModel,
        jewelry_downpayment: downpayment.toString(),
        jewelry_location: location,
        jewelry_delinquent: delinquent,
        jewelry_installmentpaid: installmentpaid.toString(),
        jewelry_installmentduration: installmentduration,
        jewelry_description: description,
        jewelry_karat: karat,
        jewelry_grams: grams,
        jewelry_material: material,
        jewelry_image: JSON.stringify(pathLists),
        modeOfPayment: modeOfPayment,
        remainingMonthsToPaid,
        assumePrice,
        monthlyPayment,
        isDropped: '0',
        propertyId: property.raw.insertId,
      })
      .execute();

    this.userSubscription.decrement(
      {
        userId: user.id,
      },
      'maxNoToPost',
      1,
    ); // update the maxNoToPost every time the user post a new property
    const response: ResponseData<[]> = {
      code: 1,
      status: 200,
      message: 'Jewelry Property was uploaded.',
      data: [],
    };

    return response;
  }
  async getActiveUserJewelry(param: {
    email: string;
  }): Promise<ResponseData<MyJewelryPropertyModel[]>> {
    const { email } = param;

    const subQ = await this.Jewelry.createQueryBuilder('jj')
      .innerJoin(Assumption, 'asmpt', 'asmpt.propertyId = jj.propertyId')
      .innerJoin(
        Assumer,
        'asmr',
        'asmr.id = asmpt.assumerId AND asmpt.isActive = 1',
      )
      .select('COUNT(jj.id)')
      .getSql();

    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['id'])
      .where('email =:email', { email })
      .getRawOne();

    const jewelries = await this.Jewelry.createQueryBuilder('jewelry')
      .select(['jewelry', `(${subQ}) as totalAssumption`])
      .where('userId =:userId', { userId: user.id })
      .andWhere('jewelry.isDropped =0')
      .execute();
    // .getQuery();

    // console.log(jewelries);
    return {
      code: 200,
      status: 1,
      message: 'Jewelry property was uploaded.',
      data: jewelries,
    };
  }
  async getCertainJewelry(
    jewelryId: number,
  ): Promise<ResponseData<MyJewelryPropertyModel>> {
    const jewelry = await this.Jewelry.createQueryBuilder('jewelry')
      .select(['jewelry'])
      .where('id =:id', { id: jewelryId })
      .getRawOne();
    // console.log(jewelry);
    return {
      code: 200,
      status: 1,
      message: 'Certain jewelry.',
      data: jewelry,
    };
  }
  async updateCertainJewelry(
    jewelryInfo: UpdateJewelryInformationModel,
  ): Promise<ResponseData<string>> {
    const {
      id,
      owner,
      jewelryName,
      jewelryModel,
      downpayment,
      location,
      installmentpaid,
      installmentduration,
      delinquent,
      description,
      karat,
      grams,
      material,
      modeOfPayment,
      remainingMonthsToPaid,
      assumePrice,
      monthlyPayment,
    } = jewelryInfo;
    this.Jewelry.createQueryBuilder('jewelry')
      .update(Jewelry)
      .set({
        jewelry_owner: owner,
        jewelry_name: jewelryName,
        jewelry_model: jewelryModel,
        jewelry_location: location,
        jewelry_downpayment: downpayment,
        jewelry_installmentpaid: installmentpaid,
        jewelry_installmentduration: installmentduration,
        jewelry_delinquent: delinquent,
        jewelry_description: description,
        jewelry_karat: karat,
        jewelry_grams: grams,
        jewelry_material: material,
        modeOfPayment: modeOfPayment,
        remainingMonthsToPaid,
        assumePrice,
        monthlyPayment,
      })
      .where('id =:jewelryId', { jewelryId: id })
      .execute();

    return {
      code: 200,
      status: 1,
      message: `Certain jewelry update.`,
      data: `'very nice' Jewelry was updated.`,
    };
  }
  async removeCertainJewelry(param: {
    jewelryID: number;
  }): Promise<ResponseData<string>> {
    const { jewelryID } = param;

    this.Jewelry.createQueryBuilder('jewelry')
      .update(Jewelry)
      .set({
        isDropped: '1',
      })
      .where('id =:jewelryID', { jewelryID })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Jewelry was removed.',
      data: 'Certain jewelry was removed.',
    };
  }
  async getActiveUserRealestate(param: {
    email: string;
    realestateType: string;
  }): Promise<ResponseData<MyRealestatePropertyModel[]>> {
    const { realestateType, email } = param;
    // console.log(param);
    let tableName = null;
    let asTableName = '';

    switch (realestateType) {
      case 'house and lot':
        tableName = HouseAndLot;
        asTableName = 'hal';
        break;
      case 'house':
        tableName = House;
        asTableName = 'house';
        break;
      case 'lot':
        tableName = Lot;
        asTableName = 'lot';
        break;
      default:
        console.log('No realestateType');
    }
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['id'])
      .where('email =:email', { email })
      .getRawOne();

    // const subQ = await this.realestateEntity
    //   .createQueryBuilder('realestate')
    //   .innerJoin(
    //     Assumption,
    //     'asmpt',
    //     'asmpt.propertyId = realestate.propertyId',
    //   )
    //   .innerJoin(
    //     Assumer,
    //     'asmr',
    //     'asmr.id = asmpt.assumerId AND asmpt.isActive = 1',
    //   )
    //   .select('COUNT(realestate.id)')
    //   .getSql();
    const subQ = this.assumptionEntity.createQueryBuilder('assumption');

    const realestate = await this.realestateEntity
      .createQueryBuilder('realestate')
      // .innerJoinAndSelect(Assumption, 'assumpt')
      .innerJoinAndSelect(
        tableName,
        asTableName,
        `${asTableName}.realestateId = realestate.id`,
      )
      .select([
        'realestate',
        `${asTableName}`,
        `(${subQ
          .select('COUNT(*)')
          .where('realestate.propertyId = assumption.propertyId')
          .getSql()}) as totalAssumption`,
      ])
      .where('realestate.userId =:userId', { userId: user.id })
      .andWhere('realestate.isDropped =0')
      .getRawMany();
    // .getSql();

    // console.log(realestate);
    // console.log(user);
    return {
      code: 200,
      status: 1,
      message: 'Realestate properties.',
      data: realestate,
    };
  }
  async uploadRealestateProperty(
    uploaderInfo: RealestateOwnerModel,
    pathLists: string[],
  ): Promise<ResponseData<string>> {
    try {
      const {
        email,
        realestateType,
        owner,
        developer,
        downpayment,
        location,
        installmentpaid,
        installmentduration,
        delinquent,
        description,
        modeOfPayment,
        remainingMonthsToPaid,
        assumePrice,
        monthlyPayment,
      } = uploaderInfo;

      const user = await this.userEntity
        .createQueryBuilder('user')
        .select(['id'])
        .where('email =:email', { email })
        .getRawOne();

      const { id } = user;
      const property = await this.propertyEntity
        .createQueryBuilder('property')
        .insert()
        .into(Property)
        .values({
          userId: () => id.toString(),
          property_type: 'realestate',
        })
        .execute();
      const realestate = await this.realestateEntity
        .createQueryBuilder('realestate')
        .insert()
        .into(Realeststate)
        .values({
          owner: owner,
          realestateType: realestateType,
          location: location,
          downpayment: downpayment.toString(),
          installmentpaid: installmentpaid.toString(),
          installmentduration,
          delinquent,
          description,
          modeOfPayment: modeOfPayment,
          remainingMonthsToPaid,
          assumePrice,
          monthlyPayment,
          isDropped: '0',
          userId: () => (user.userId = id),
          propertyId: property.raw.insertId,
        })
        .execute();
      const { insertId } = realestate.raw;

      switch (realestateType) {
        case 'house and lot':
          this.halEntity
            .createQueryBuilder('hal')
            .insert()
            .into(HouseAndLot)
            .values({
              developer,
              realestateId: insertId,
              hal_front_image: JSON.stringify(pathLists),
            })
            .execute();
          break;
        case 'house':
          this.houseEntity
            .createQueryBuilder('house')
            .insert()
            .into(House)
            .values({
              developer,
              realestateId: insertId,
              house_front_image: JSON.stringify(pathLists),
            })
            .execute();
          break;
        case 'lot':
          this.lotEntity
            .createQueryBuilder('lot')
            .insert()
            .into(Lot)
            .values({
              realestateId: insertId,
              lot_image: JSON.stringify(pathLists),
            })
            .execute();
          break;
        default:
          console.log('No realestateType');
      }

      return {
        code: 200,
        status: 1,
        message: `${realestateType} Property was uploaded.`,
        data: `${realestateType} Property was uploaded.`,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getCertainRealestate(param: {
    realestateType: string;
    realestateID: number;
  }): Promise<ResponseData<MyRealestatePropertyModel[]>> {
    const { realestateType, realestateID } = param;

    const tableName =
      realestateType === 'house and lot'
        ? HouseAndLot
        : realestateType === 'house'
        ? House
        : Lot;
    const asTableName =
      realestateType === 'house and lot'
        ? 'hal'
        : realestateType === 'house'
        ? 'house'
        : 'lot';
    const realestate = await this.realestateEntity
      .createQueryBuilder('realestate')
      .innerJoinAndSelect(
        tableName,
        asTableName,
        `${asTableName}.realestateId = realestate.id`,
      )
      .select(['realestate', `${asTableName}`])
      .where('realestate.id =:realestateID', { realestateID })
      .andWhere('realestate.isDropped =0')
      .getRawOne();

    // console.log(realestate);

    return {
      code: 200,
      status: 1,
      message: 'Certain realestate property.',
      data: realestate,
    };
  }
  async updateCertainRealestate(
    realestateInfo: UpdateRealestateInformationModel,
  ): Promise<ResponseData<string>> {
    // console.log(realestateInfo);
    const {
      realestateType,
      owner,
      downpayment,
      location,
      installmentpaid,
      installmentduration,
      delinquent,
      description,
      developer,
      id,
      // realestateID,
      modeOfPayment,
      remainingMonthsToPaid,
      assumePrice,
      monthlyPayment,
    } = realestateInfo;

    this.realestateEntity
      .createQueryBuilder('realestate')
      .update(Realeststate)
      .set({
        owner: owner,
        location,
        installmentduration,
        installmentpaid,
        delinquent,
        description,
        downpayment,
        modeOfPayment,
        remainingMonthsToPaid,
        assumePrice,
        monthlyPayment,
      })
      .where('id =:realestateID', { realestateID: id })
      .execute();

    switch (realestateType) {
      case 'house and lot':
        this.halEntity
          .createQueryBuilder('hal')
          .update(HouseAndLot)
          .set({
            developer,
          })
          .where('realestateId =:realestateId', { realestateId: id })
          .execute();
        break;
      case 'house':
        this.houseEntity
          .createQueryBuilder('house')
          .update(House)
          .set({
            developer,
          })
          .where('realestateId =:realestateId', { realestateId: id })
          .execute();
        break;
      case 'lot':
        // just do nothing;
        break;
      default:
        console.log('No realestateType');
    }
    return {
      code: 200,
      status: 1,
      message: 'Certain realestate was updated',
      data: 'Certain realestate was updated',
    };
  }
  async removeCertainRealestate(param: {
    realestateID: number;
  }): Promise<ResponseData<string>> {
    const { realestateID } = param;

    this.realestateEntity
      .createQueryBuilder('realestate')
      .update(Realeststate)
      .set({
        isDropped: '1',
      })
      .where('id =:realestateID', { realestateID })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Realestate property was removed.',
      data: 'Realestate property was removed.',
    };
  }
  async getAssumerDetail(param: {
    assumerID: number;
    otherInfo: string;
    propType: string;
  }): Promise<ResponseData<any>> {
    console.log(param);
    const { assumerID, propType } = param;
    const assumerDetail = await this.assumerEntity
      .createQueryBuilder('assumer')
      .innerJoin(Assumption, 'asmptn')
      .innerJoin(User, 'user')
      .where('asmptn.assumerId = assumer.id')
      .andWhere('user.id = assumer.userId')
      .andWhere('assumer.id =:assumerID', { assumerID })
      .select(['user', 'assumer', 'asmptn'])
      .getRawOne();
    // console.log(assumerDetail);
    const { asmptn_propertyId } = assumerDetail;
    let property: any = null;
    switch (propType) {
      case 'vehicle':
        const vehicle = await this.vehicleEntity
          .createQueryBuilder('vehicle')
          .innerJoin(Property, 'property')
          .innerJoin(VehicleImage, 'vi')
          .select(['vehicle', 'vi'])
          .where(
            'property.id = vehicle.propertyId AND vi.vehicleId = vehicle.id',
          )
          .andWhere('property.id =:propertyId', {
            propertyId: asmptn_propertyId,
          })
          .andWhere('vehicle.isDropped = 0')
          .getRawOne();

        property = vehicle;
        break;
      case 'jewelry':
        const jewelry = await this.jewelryEntity
          .createQueryBuilder('jewelry')
          .innerJoin(Property, 'property')
          .where('property.id = jewelry.propertyId')
          .getRawOne();
        property = jewelry;
        break;
      case 'realestate':
        break;
      default:
        console.log('No propertyType');
    }

    assumerDetail.property = property;
    console.log(assumerDetail);
    return {
      code: 200,
      status: 1,
      message: 'Assumer details',
      data: assumerDetail,
    };
  }
  async acceptCertainAssumer(param: {
    assumerID: number;
    propertyID: number;
  }): Promise<ResponseData<string>> {
    const { assumerID, propertyID } = param;
    this.assumptionEntity
      .createQueryBuilder('assumption')
      .update(Assumption)
      .set({
        isAcceptedAssumer: 1,
      })
      .where('assumerId =:assumerId', { assumerId: assumerID })
      .andWhere('propertyId =:propertyId', { propertyId: propertyID })
      .execute();

    this.assumptionEntity
      .createQueryBuilder('assumption')
      .update(Assumption)
      .set({
        isActive: '0',
        isAcceptedAssumer: 0,
      })
      .where('propertyId =:propertyID', { propertyID })
      .andWhere('assumerId !=:assumerId', { assumerId: assumerID })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Assumption was accepted',
      data: 'Assumption was accepted',
    };
  }
}
