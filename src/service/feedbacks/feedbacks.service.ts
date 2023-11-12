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
    // console.log(param);
    const { userID, comment, userFullName, ratingStar, sendRateTo } = param;
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
        const companyList = await this.companyEntity
          .createQueryBuilder('company')
          .innerJoin(User, 'user')
          .where('company.userId = user.id')
          .select(['user', 'company'])
          .getRawMany();
        ratingResult = companyList;
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
}
