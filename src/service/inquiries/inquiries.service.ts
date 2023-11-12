import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiries } from 'src/entity/inquiries/Inquiries';
import { Notifications } from 'src/entity/notifications/Notifications';
import { InquiriesModel } from 'src/models/inquiries/Inquiries';
import { Repository } from 'typeorm';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiries) private inquiryEntity: Repository<Inquiries>,
    @InjectRepository(Notifications)
    private notificationEntity: Repository<Notifications>,
  ) {}
  async sendInquiries(inquiry: InquiriesModel): Promise<ResponseData<string>> {
    const {
      userSenderId,
      userReceiverId,
      propertyId,
      firstname,
      lastname,
      address,
      streetAddress,
      addressLine2,
      stateProvince,
      postalZipCode,
      phoneNumber,
      email,
      inquiryDescription,
    } = inquiry;

    this.inquiryEntity
      .createQueryBuilder('inquiry')
      .insert()
      .into(Inquiries)
      .values({
        userSenderId,
        userReceiverId,
        propertyId,
        firstname,
        lastname,
        address,
        streetAddress,
        streetAddressLine2: addressLine2,
        stateOProvince: stateProvince,
        zipCode: postalZipCode,
        phoneNumber,
        email,
        description: inquiryDescription,
      })
      .execute();

    this.notificationEntity
      .createQueryBuilder('notification')
      .insert()
      .into(Notifications)
      .values({
        userNotifReceiverId: userReceiverId,
        userNotifSenderId: userSenderId,
        notificationType: 'inquiries',
        notificationContent: 'Someone send an inquiries',
        isSeen: 'false',
        notificationDate: new Date(),
      })
      .execute();
    return {
      code: 200,
      status: 1,
      message: 'Inquiry send',
      data: 'Your inquiry has been successfully send.',
    };
  }
  async getAllInquiries(
    userId: number,
  ): Promise<ResponseData<InquiriesModel[]>> {
    const inquiries = await this.inquiryEntity
      .createQueryBuilder('inquiries')
      .where('inquiries.userReceiverId =:userReceiverId', {
        userReceiverId: userId,
      })
      .select([
        'inquiries.id as id',
        'inquiries.userSenderId as userSenderId',
        'inquiries.userReceiverId as ReceiverId',
        'inquiries.propertyId as propertyId',
        'inquiries.firstname as firstname',
        'inquiries.lastname as lastname',
        'inquiries.address as address',
        'inquiries.streetAddress as streetAddress',
        'inquiries.streetAddressLine2 as addressLine2',
        'inquiries.stateOProvince as stateOProvince',
        'inquiries.zipCode as zipCode',
        'inquiries.phoneNumber as phoneNumber',
        'inquiries.email as email',
        'inquiries.description as description',
      ])
      .getRawMany();

    return {
      code: 200,
      status: 1,
      message: 'getting inquiries',
      data: inquiries,
    };
  }
}
