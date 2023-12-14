import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entity/notifications/Notifications';
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
    @InjectRepository(Notifications)
    private notificationEntity: Repository<Notifications>,
  ) {}
  async getAllAssumedProperty(param: {
    userId: number;
  }): Promise<ResponseData<AssumptionInformationModel[]>> {
    const { userId } = param;
    const query = `SELECT CONCAT(u.lastname, ' ', u.firstname, ' ', u.middlename) as owner, u.contactno contactno, CONCAT(u.barangay, u.municipality, u.province) address, u.image as image, a.isActive, a.isAcceptedAssumer, a.id assumerId, p.id as propertyId, a.propowner_id, a.assumerId, p.property_type FROM property p INNER JOIN user u INNER JOIN assumption a ON p.userId = u.id AND p.id = a.propertyId WHERE a.userId = '${userId}' AND a.isActive = 1 GROUP BY a.propertyId
    `;
    // console.log(query);
    const combinedRecords = await this.assumptnEntity.query(query);
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
    propertyOwnerId: number,
    propertyId: number,
  ): Promise<ResponseData<string>> {
    this.assumptnEntity
      .createQueryBuilder('assumption')
      .update(Assumption)
      .set({
        isActive: '0',
      })
      .where('assumption.assumerId =:assumerID', { assumerID })
      .execute();

    this.notificationEntity
      .createQueryBuilder()
      .insert()
      .into(Notifications)
      .values({
        userNotifReceiverId: propertyOwnerId,
        userNotifSenderId: assumerID,
        notificationType: 'assumer-remove-assumption',
        notificationContent: 'Assumer cancel his / her assumption',
        isSeen: 'false',
        notificationDate: new Date(),
        uniqueId: propertyId.toString(),
      })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Assumption was removed.',
      data: 'Assumption was removed successfully.',
    };
  }
}
