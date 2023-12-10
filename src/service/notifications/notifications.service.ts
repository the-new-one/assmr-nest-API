import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewelry } from 'src/entity/my-property/my-jewelry';
import { Vehicle } from 'src/entity/my-property/my-property';
import { Realeststate } from 'src/entity/my-property/my-realestate';
import { Property } from 'src/entity/my-property/property';
import { Notifications } from 'src/entity/notifications/Notifications';
import { Assumption } from 'src/entity/property-assumption/PropertyAssumption';
import { User } from 'src/entity/signup/signup.entity';
import { NotificationModel } from 'src/models/notificaitons/Notifications';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notifEntity: Repository<Notifications>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Property) private propertyEntity: Repository<Property>,
    @InjectRepository(Assumption)
    private assumptionEntity: Repository<Assumption>,
    @InjectRepository(Realeststate)
    private realestateEntity: Repository<Realeststate>,
    @InjectRepository(Vehicle) private vehicleEntity: Repository<Vehicle>,
    @InjectRepository(Jewelry) private jewelryEntity: Repository<Jewelry>,
  ) {}
  async getNotificationsCounter(
    activeUserId: number,
  ): Promise<ResponseData<any>> {
    // console.log("active: "+activeUserId)
    const notificationsCounter = await this.notifEntity
      .createQueryBuilder('notifications')
      .where('userNotifReceiverId =:userNotifReceiverId', {
        userNotifReceiverId: activeUserId,
      })
      .andWhere('isSeen =:isSeen', { isSeen: 'false' })
      .getCount();

    // console.log('notifCounter: ', notificationsCounter);
    return {
      code: 200,
      status: 1,
      message: 'Notifications counter',
      data: notificationsCounter,
    };
  }
  async getPushNotifications(
    activeUserId: number,
  ): Promise<ResponseData<NotificationModel[]>> {
    const notifications = await this.notifEntity
      .createQueryBuilder('notification')
      .innerJoin(
        User,
        'notifSender',
        'notifSender.id = notification.userNotifSenderId',
      )
      // .innerJoin(Property, 'prop', 'prop.id = notification.uniqueId')
      .where('notification.userNotifReceiverId =:notifReceiverId', {
        notifReceiverId: activeUserId,
      })
      // .andWhere('notification.isSeen =:isSeen', { isSeen: 'false' })
      .orderBy('notification.notificationDate', 'DESC')
      .select(['notification', 'notifSender'])
      .getRawMany();

    this.notifEntity
      .createQueryBuilder('notifications')
      .update(Notifications)
      .set({
        isSeen: 'true',
      })
      .where('userNotifReceiverId =:userNotifReceiverId', {
        userNotifReceiverId: activeUserId,
      })
      .execute();

    // console.log(notifications);
    // this.notifEntity
    //   .createQueryBuilder('notifications')
    //   .update(Notifications)
    //   .set({
    //     isSeen: 'true',
    //   })
    //   .execute();
    // console.log(notifications);
    return {
      code: 200,
      status: 1,
      message: 'notifications',
      data: notifications as unknown as NotificationModel[],
    };
  }
  async getAllPropertyForReports(
    activeUserId: number,
    dateFrom: string,
    dateTo: string,
  ): Promise<ResponseData<any>> {
    const query = `
      SELECT p.id as id, p.property_type as type, p.posted_date as date, v.brand property_name, v.isDropped isDropped, (SELECT a.isAcceptedAssumer FROM assumption a INNER JOIN property p ON p.id = a.propertyId WHERE p.userId = ${activeUserId} AND v.propertyId = p.id LIMIT 1) as status  FROM property p INNER JOIN vehicle v ON p.id = v.propertyId WHERE p.userId = ${activeUserId} AND DATE(p.posted_date) BETWEEN  DATE("${dateFrom}") AND DATE("${dateTo}")

      UNION ALL SELECT p.id as id, p.property_type as type, p.posted_date as date, j.jewelry_name property_name, j.isDropped isDropped, (SELECT a.isAcceptedAssumer FROM assumption a INNER JOIN property p ON p.id = a.propertyId WHERE p.userId = ${activeUserId} AND p.id = j.propertyId LIMIT 1) as status FROM property p INNER JOIN jewelry j ON p.id = j.propertyId WHERE p.userId = ${activeUserId} AND p.posted_date BETWEEN  DATE_FORMAT('${dateFrom}', '%Y-%m-%d') AND DATE_FORMAT('${dateTo}', '%Y-%m-%d')

      UNION ALL SELECT p.id as id, p.property_type as type, p.posted_date as date, r.realestateType property_name, r.isDropped as Dropped, (SELECT a.isAcceptedAssumer FROM assumption a INNER JOIN property p ON p.id = a.propertyId WHERE p.userId = ${activeUserId} AND p.id = r.propertyId LIMIT 1) as status FROM property p INNER JOIN realeststate r ON p.id = r.propertyId INNER JOIN house_and_lot hal ON hal.realestateId = r.id WHERE p.userId = ${activeUserId} AND DATE_FORMAT(p.posted_date, '%Y-%m-%d') BETWEEN  DATE_FORMAT('${dateFrom}', '%Y-%m-%d') AND DATE_FORMAT('${dateTo}', '%Y-%m-%d')

      UNION ALL SELECT p.id as id, p.property_type as type, p.posted_date as date, r.realestateType property_name, r.isDropped as Dropped, (SELECT a.isAcceptedAssumer FROM assumption a INNER JOIN property p ON p.id = a.propertyId WHERE p.userId = ${activeUserId} AND p.id = r.propertyId LIMIT 1) as status FROM property p INNER JOIN realeststate r ON p.id = r.propertyId INNER JOIN house h ON h.realestateId = r.id WHERE p.userId = ${activeUserId} AND DATE_FORMAT(p.posted_date, '%Y-%m-%d') BETWEEN  DATE_FORMAT('${dateFrom}', '%Y-%m-%d') AND DATE_FORMAT('${dateTo}', '%Y-%m-%d')

      UNION ALL SELECT p.id as id, p.property_type as type, p.posted_date as date, r.realestateType property_name, r.isDropped as Dropped, (SELECT a.isAcceptedAssumer FROM assumption a INNER JOIN property p ON p.id = a.propertyId WHERE p.userId = ${activeUserId} AND p.id = r.propertyId LIMIT 1) as status FROM property p INNER JOIN realeststate r ON p.id = r.propertyId INNER JOIN lot l ON l.realestateId = r.id WHERE p.userId = ${activeUserId} AND DATE_FORMAT(p.posted_date, '%Y-%m-%d') BETWEEN DATE_FORMAT('${dateFrom}', '%Y-%m-%d') AND DATE_FORMAT('${dateTo}', '%Y-%m-%d')
    `;

    const reports = await this.propertyEntity.query(query);
    // console.log(reports);
    return {
      code: 200,
      status: 1,
      message: 'Generated reports',
      data: reports,
    };
  }
  async getAllAssumedPropertyForReports(
    activeUserId: number,
    dateFrom: string,
    dateTo: string,
  ): Promise<ResponseData<any>> {
    const query = `SELECT p.property_type property_type, CONCAT(u.lastname, ', ', u.firstname, ' ', SUBSTR(u.middlename, 1, 1), '.') as assumer_name, v.brand as property_name, a.transaction_date, a.isActive isActive, a.isAcceptedAssumer isAccepted FROM user u INNER JOIN assumption a ON a.userId = u.id INNER JOIN property p INNER JOIN vehicle v ON v.propertyId = p.id WHERE a.propertyId = p.id AND a.propowner_id = ${activeUserId} AND DATE_FORMAT(a.transaction_date, '%Y-%m-%d') BETWEEN DATE_FORMAT('${dateFrom}', '%Y-%m-%d') AND DATE_FORMAT('${dateTo}', '%Y-%m-%d')

    UNION ALL SELECT p.property_type property_type, CONCAT(u.lastname, ', ', u.firstname, ' ', SUBSTR(u.middlename, 1, 1), '.') as assumer_name, r.realestateType as property_name, a.transaction_date, a.isActive isActive, a.isAcceptedAssumer isAccepted FROM property p INNER JOIN realeststate r ON r.propertyId = p.id INNER JOIN house_and_lot hal ON hal.realestateId = r.id INNER JOIN assumption a ON a.propertyId = p.id INNER JOIN user u ON u.id = a.userId WHERE a.propowner_id = ${activeUserId}

    UNION ALL SELECT p.property_type property_type, CONCAT(u.lastname, ', ', u.firstname, ' ', SUBSTR(u.middlename, 1, 1), '.') as assumer_name, r.realestateType property_name, a.transaction_date, a.isActive isActive, a.isAcceptedAssumer isAccepted FROM property p INNER JOIN realeststate r ON r.propertyId = p.id INNER JOIN house h ON h.realestateId = r.id INNER JOIN assumption a ON a.propertyId = p.id INNER JOIN user u ON u.id = a.userId WHERE a.propowner_id = ${activeUserId}

    UNION ALL SELECT p.property_type property_type, CONCAT(u.lastname, ', ', u.firstname, ' ', SUBSTR(u.middlename, 1, 1), '.') as assumer_name, r.realestateType property_name, a.transaction_date, a.isActive isActive, a.isAcceptedAssumer isAccepted FROM property p INNER JOIN realeststate r ON r.propertyId = p.id INNER JOIN lot l ON l.realestateId = r.id INNER JOIN assumption a ON a.propertyId = p.id INNER JOIN user u ON u.id = a.userId WHERE a.propowner_id = ${activeUserId}

    UNION ALL SELECT p.property_type property_type, CONCAT(u.lastname, ', ', u.firstname, ' ', SUBSTR(u.middlename, 1, 1), '.') as assumer_name, j.jewelry_name as property_name, a.transaction_date, a.isActive isActive, a.isAcceptedAssumer isAccepted FROM property p INNER JOIN jewelry j ON j.propertyId = p.id INNER JOIN assumption a ON a.propertyId = p.id INNER JOIN user u ON u.id = a.userId WHERE a.propowner_id = ${activeUserId}
    `;

    const assumptionRecords = await this.assumptionEntity.query(query);
    // console.log(assumptionRecords);

    return {
      code: 200,
      status: 1,
      message: 'Get all assumed property',
      data: assumptionRecords,
    };
  }
  async getCertainNotificationType(
    notifType: string,
    uniqueId: number,
  ): Promise<ResponseData<any>> {
    // console.log(notifType, uniqueId);
    const property = await this.propertyEntity.findOne({
      select: {
        id: true,
        property_type: true,
      },
      where: {
        id: uniqueId,
      },
    });
    const { id, property_type } = property;
    let record = {};
    // console.log(property);

    switch (property_type) {
      case 'vehicle':
        const vehicle = await this.vehicleEntity.findOne({
          select: {
            id: true,
            propertyId: true,
          },
          where: {
            propertyId: id,
          },
        });
        record = {
          id,
          vehicle,
          property_type,
        };
        break;
      case 'jewelry':
        const jewelry = await this.jewelryEntity.findOne({
          select: {
            id: true,
            propertyId: true,
          },
          where: {
            propertyId: id,
          },
        });
        record = {
          id,
          jewelry,
          property_type,
        };
        break;
      case 'realestate':
        const realestateType = await this.realestateEntity.findOne({
          select: {
            id: true,
            realestateType: true,
          },
          where: {
            propertyId: id,
          },
        });
        record = {
          id,
          property_type,
          realestateType,
        };
        break;
      default:
        console.log('No propertyType / type');
    }
    // console.log(record);
    return {
      code: 200,
      status: 1,
      message: 'Certain notifications',
      data: record,
    };
  }
}
