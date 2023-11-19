import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entity/company/Company';
import { Rating, UserFeedBack } from 'src/entity/feedbacks/FeedBacks';
import { User } from 'src/entity/signup/signup.entity';
import { UserSubscription } from 'src/entity/subscription/Subscription';
import { UserFeedBacksModel } from 'src/models/feedbacks/FeedBacks';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(UserFeedBack)
    private userFeedBackEntity: Repository<UserFeedBack>,
    @InjectRepository(Rating) private ratingEntity: Repository<Rating>,
    @InjectRepository(Company) private companyEntity: Repository<Company>,
    @InjectRepository(UserSubscription)
    private userSubEntity: Repository<UserSubscription>,
  ) {}
  async postUserFeedBack(
    param: UserFeedBacksModel,
  ): Promise<ResponseData<string>> {
    const { userId, email, fullName, feedComments, satisfaction } = param;
    this.userFeedBackEntity
      .createQueryBuilder('feedback')
      .insert()
      .into(UserFeedBack)
      .values({
        userId,
        email,
        fullName,
        userComments: feedComments,
        satisfaction,
        feedBackDate: new Date(),
      })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Feedback posted',
      data: 'Thank you for your feedback.',
    };
  }
  async getUserFeedBacks(): Promise<ResponseData<UserFeedBacksModel[]>> {
    const feedBackList = await this.userFeedBackEntity
      .createQueryBuilder('feedbacks')
      .orderBy('feedbacks.feedBackDate', 'DESC')
      .getMany();

    return {
      code: 200,
      status: 1,
      message: 'Lists of all user feedbacks',
      data: feedBackList as unknown as UserFeedBacksModel[],
    };
  }
  async createRating(param: any): Promise<ResponseData<string>> {
    const { userID, comment, userFullName, ratingStar, sendRateTo, ratedTo } =
      param;
    console.log(param);
    let message: string = '';
    switch (sendRateTo) {
      case 'rate-assmr-app':
        this.ratingEntity
          .createQueryBuilder('rating')
          .insert()
          .into(Rating)
          .values({
            comment: comment,
            otherId: 0,
            ratingStar,
            userId: userID,
            sendRatingTo: sendRateTo,
            ratedTo: 1000,
            ratingDate: new Date(),
          })
          .execute();
        message = 'Thank you for giving us a rating, ' + userFullName;
        break;
      case 'rate-a-company':
        this.ratingEntity
          .createQueryBuilder('rating')
          .insert()
          .into(Rating)
          .values({
            comment: comment,
            otherId: 0,
            ratingStar,
            userId: userID,
            sendRatingTo: sendRateTo,
            ratedTo: ratedTo,
            ratingDate: new Date(),
          })
          .execute();
        message = 'Thank you for rating a company, ' + userFullName;
        break;
      default:
        console.log('No sendRateTo');
    }

    return {
      code: 200,
      status: 0,
      message: 'New rating was created.',
      data: message,
    };
  }
  async getRating(activeFilterType: string): Promise<ResponseData<any>> {
    // console.log(activeFilterType);
    let ratingResult = null;
    switch (activeFilterType) {
      case 'rate-assmr-app':
        const assmrList = await this.ratingEntity
          .createQueryBuilder('rating')
          .innerJoin(User, 'user')
          .innerJoin(UserSubscription, 'subscription')
          .where('rating.sendRatingTo =:sendRatingTo', {
            sendRatingTo: activeFilterType,
          })
          .andWhere('user.id = rating.userId')
          .andWhere('subscription.userId = user.id')
          .select(['rating', 'user', 'subscription'])
          // .getSql();
          .getRawMany();
        ratingResult = assmrList;
        break;
      case 'rate-a-company':
        const subQ = await this.ratingEntity.createQueryBuilder('rating');
        const companyList = await this.companyEntity
          .createQueryBuilder('company')
          .innerJoin(User, 'user')
          .where('company.userId = user.id')
          .select([
            'user',
            'company',
            `(${subQ
              .select('COUNT(rating.ratedTo)')
              .where('company.id = rating.ratedTo')
              .groupBy('ratedTo')
              .getSql()}) as noOfPeopleWhoRate`,
          ])
          .getRawMany();
        ratingResult = companyList;
        console.log(ratingResult);
        break;
      default:
        console.log('No activeFilterType');
    }
    // console.log(ratingResult);
    return {
      code: 200,
      status: 0,
      message: 'Rating',
      data: ratingResult,
    };
  }
  async getCompanyRating(param: {
    companyID: number;
  }): Promise<ResponseData<any>> {
    const { companyID } = param;
    const companyRating = await this.companyEntity
      .createQueryBuilder('company')
      .innerJoin(Rating, 'rating')
      .innerJoin(User, 'user')
      .where('company.id =:companyID', { companyID })
      .andWhere('rating.ratedTo = company.id')
      .andWhere('user.id = rating.userId')
      .select(['rating', 'user'])
      .getRawMany();
    console.log(companyRating);
    return {
      code: 200,
      status: 1,
      message: 'Company ratings.',
      data: companyRating,
    };
  }
  async updateUserSubscription(param: {
    newExpirationDate: Date;
    userId: number;
  }): Promise<ResponseData<string>> {
    const { newExpirationDate, userId } = param;
    this.userSubEntity
      .createQueryBuilder('user_subscription')
      .update(UserSubscription)
      .set({
        subscription_expiry: newExpirationDate,
        isSubscribed: true,
      })
      .where('user_subscription.userId =:userId', { userId })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Subscription updated.',
      data: 'Your subscription has been upgraded.',
    };
  }
}
