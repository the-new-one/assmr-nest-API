import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating, UserFeedBack } from 'src/entity/feedbacks/FeedBacks';
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
import { UserSubscription } from 'src/entity/subscription/Subscription';
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
    @InjectRepository(UserSubscription)
    private userSub: Repository<UserSubscription>,
    @InjectRepository(UserFeedBack)
    private userFeedbackEntity: Repository<UserFeedBack>,
    @InjectRepository(Rating) private ratingEntity: Repository<Rating>,
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
  async getAdminGraphs() {}
  async getUserSubscriptions(): Promise<ResponseData<any>> {
    const subscriptionList = await this.userSub
      .createQueryBuilder('userSub')
      .innerJoin(User, 'user', 'user.id = userSub.userId')
      .select(['user', 'userSub'])
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'User subscriptions',
      data: subscriptionList,
    };
  }
  async getUserFeedBacks(): Promise<ResponseData<any>> {
    const feedBack = await this.userFeedbackEntity.createQueryBuilder('feeds')
      .execute();
    console.log(feedBack);
    return {
      code: 200,
      status: 1,
      message: 'User feedbacks',
      data: feedBack,
    };
  }
  async getAllDroppedProperty(): Promise<ResponseData<any>> {
    const sql = `
      SELECT p.id, p.property_type as property_type, v.brand as info1,v.model as info2, v.owner as owner, v.color as info3, v.milage as info4, v.issue, v.condition as info5,v.downpayment as downpayment,v.installmentpaid as installmentpaid, v.installmentduration as installmentduration,v.delinquent as delinquent,v.remainingMonthsToPaid as remainingMonthsToPaid, v.assumePrice, v.monthlyPayment,v.modeOfPayment, vi.vehicleFrontIMG as img, '' as info6 FROM property p INNER JOIN vehicle v ON p.id = v.propertyId INNER JOIN vehicle_image vi ON vi.vehicleId = v.id WHERE v.isDropped = 1
      UNION ALL SELECT p.id, p.property_type as property_type, j.jewelry_owner as owner, j.jewelry_name as name, j.jewelry_model as model, j.jewelry_downpayment as downpayment, j.jewelry_delinquent as delinquent, j.jewelry_installmentpaid as installmentpaid, j.jewelry_installmentduration as installmentduration,j.jewelry_description,j.jewelry_karat, j.jewelry_grams as info3, j.jewelry_material as info4, '' as info5, j.jewelry_image as img, j.remainingMonthsToPaid as remainingMonthsToPaid,j.assumePrice, j.modeOfPayment, j.monthlyPayment FROM property p INNER JOIN jewelry j ON j.propertyId = p.id WHERE j.isDropped = 1
      UNION ALL SELECT p.id, p.property_type as property_type, r.owner as owner, r.realestateType as info1, '' as info2, '' as info3, '' as info4, r.downpayment as downpayment, r.installmentpaid as installmentpaid, r.installmentduration as installmentduration, r.delinquent as delinquent, r.modeOfPayment, r.remainingMonthsToPaid as remainingMonthsToPaid, r.assumePrice as assumePrice, r.monthlyPayment, '' as info5, '' as info6, '' as info7, '' as info8  FROM property p INNER JOIN realeststate r ON r.propertyId = p.id INNER JOIN house_and_lot hal ON hal.realestateId = r.id INNER JOIN house h ON h.realestateId = r.id INNER JOIN lot l ON l.realestateId = r.id WHERE r.isDropped = 1
    `;
    const droppedList = await this.propertyEntity.query(sql);
    
    return {
      code: 200,
      status: 1,
      message: 'Dropped property',
      data: droppedList,
    }
  }
  async getAllRatings(param: {
    activeView: string;
  }): Promise<ResponseData<any>> {
    const { activeView } = param;
    let sql = '';
    let record = null;

    switch (activeView) {
      case 'Show company ratings':
        sql =
          "SELECT c.*, t.totalCommenter\
          FROM company c\
          LEFT JOIN (\
              SELECT r.ratedTo, COUNT(*) AS totalCommenter\
              FROM rating r\
              INNER JOIN user u ON u.id = r.userId\
              WHERE r.sendRatingTo = 'rate-a-company'\
              GROUP BY r.ratedTo\
          ) AS t ON c.id = t.ratedTo\
          WHERE c.id IN (\
              SELECT ratedTo\
              FROM rating\
              WHERE sendRatingTo = 'rate-a-company'\
          )\
          GROUP BY c.id, t.totalCommenter;";
        const companyRatings = await this.realestateEntity.query(sql);
        record = companyRatings;
        break;
      case 'Show app ratings':
        sql =
          "SELECT u.*, r.* FROM rating r INNER JOIN user u ON u.id = r.userId WHERE r.sendRatingTo = 'rate-assmr-app'";
        const appRatings = await this.realestateEntity.query(sql);
        record = appRatings;
        break;
      default:
        console.log('No activeView');
    }
    // console.log(record);
    return {
      code: 200,
      status: 1,
      message: 'Get ratings',
      data: record,
    };
  }
}
