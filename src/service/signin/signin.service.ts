/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, User } from 'src/entity/signup/signup.entity';
import { UserSubscription } from 'src/entity/subscription/Subscription';
import {
  ActiveUserCredentialsModel,
  UpdateUserInformationModel,
  UserSigninModel,
} from 'src/models/user/UserModel';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/entity/company/Company';

@Injectable()
export class SigninService {
  constructor(
    @InjectRepository(User) private userCredential: Repository<User>,
    @InjectRepository(Account) private accountCred: Repository<Account>,
    @InjectRepository(UserSubscription)
    private userSub: Repository<UserSubscription>,
    @InjectRepository(Company) private companyEntity: Repository<Company>,
  ) {}
  async verifyUserCredentials(
    credentials: UserSigninModel,
  ): Promise<ResponseData<ActiveUserCredentialsModel>> {
    try {
      if (!Object.values(credentials).every((v) => v)) {
        return {
          code: 1,
          status: 500,
          message: 'Credentials is invalid.',
          data: null,
        };
      } else {
        const accountCred = await this.accountCred.findOne({
          select: {
            userId: true,
            password: true,
          },
          where: {
            email: credentials.email,
          },
        });

        if (!accountCred) {
          return {
            code: 1,
            status: 500,
            message: 'Credentials is invalid.',
            data: null,
          };
        }
        const hashedPassword = await bcrypt.compareSync(
          credentials.password,
          accountCred.password,
        );

        if (!accountCred || !hashedPassword) {
          return {
            code: 0,
            status: 401,
            message: 'Credentials is invalid.',
            data: {
              userId: 0,
              email: '',
              firstname: '',
              middlename: '',
              lastname: '',
              address: '',
              contactno: '',
              subscription: null,
              image: '',
              companyType: '',
              branch: '',
            },
          };
        }

        const result = await this.userCredential.findOne({
          select: {
            id: true,
            email: true,
            firstname: true,
            middlename: true,
            lastname: true,
            contactno: true,
            municipality: true,
            province: true,
            barangay: true,
            image: true,
          },
          where: {
            id: accountCred.userId,
          },
        });

        const companyResult = await this.companyEntity.findOne({
          select: {
            company_type: true,
            branch: true,
          },
          where: {
            userId: result.id,
          },
        });

        const subscriptionInfo = await this.userSub.findOne({
          where: {
            userId: result.id,
          },
          select: {
            userId: true,
            userType: true,
            isSubscribed: true,
            subscription_date: true,
            subscription_expiry: true,
          },
        });
        // console.log(subscriptionInfo);

        if (subscriptionInfo.userType === 'company') {
          const d1 = new Date(subscriptionInfo.subscription_expiry);
          const d2 = new Date();
          if (d2 > d1) {
            subscriptionInfo.isSubscribed = false;
          }
        } else if (subscriptionInfo.userType === 'individual-user') {
          const d1 = new Date(subscriptionInfo.subscription_expiry);
          const d2 = new Date();
          if (d2 > d1 && subscriptionInfo.isSubscribed) {
            subscriptionInfo.isSubscribed = false;
          }
        }
        return {
          code: 0,
          status: 200,
          message: 'Credentials is valid.',
          data: {
            userId: result.id,
            email: result.email,
            firstname: result.firstname,
            middlename: result.middlename,
            lastname: result.lastname,
            address: `${result.municipality}, ${result.province}, ${result.barangay}`,
            contactno: result.contactno,
            subscription: subscriptionInfo ?? false,
            image: result.image,
            companyType: companyResult ? companyResult.company_type : '',
            branch: companyResult ? companyResult.branch : '',
          },
        };
      }
    } catch (err) {
      console.log(err);

      return new Promise((resolve, reject) => {
        resolve({
          code: 0,
          status: 500,
          message: 'Something went wrong.',
          data: {
            userId: 0,
            email: '',
            firstname: '',
            middlename: '',
            lastname: '',
            address: '',
            contactno: '',
            subscription: null,
            image: '',
            companyType: '',
            branch: '',
          },
        });
      });
    }
  }
  async updateCredentials(
    params: UpdateUserInformationModel,
    pathList: string,
  ): Promise<ResponseData<string>> {
    // console.log(params);
    const {
      firstname,
      middlename,
      lastname,
      contactno,
      municipality,
      province,
      barangay,
      email,
      password, // oldPassword
      newPassword, // newPassword
      shouldUpdatePassword,
    } = params;
    const accountExists = await this.accountCred.findOne({
      select: {
        password: true,
        email: true,
      },
      where: {
        email,
      },
    });
    const isValidCredentials = await bcrypt.compare(
      password,
      accountExists.password,
    );
    if (!isValidCredentials && parseInt(shouldUpdatePassword) > 0) {
      return {
        code: 500,
        status: 1,
        message: 'User credential is invalid',
        data: 'User credential is invalid',
      };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (parseInt(shouldUpdatePassword) > 0) {
      this.accountCred
        .createQueryBuilder('account')
        .update(Account)
        .set({
          password: hashedPassword,
        })
        .where('account.email =:email', { email })
        .execute();
    }

    this.userCredential
      .createQueryBuilder('user')
      .update(User)
      .set({
        firstname: firstname.toLocaleLowerCase(),
        middlename: middlename.toLocaleLowerCase(),
        lastname: lastname.toLocaleLowerCase(),
        contactno,
        municipality,
        province,
        barangay,
        image: pathList,
      })
      .where('user.email =:email', { email })
      .execute();

    return {
      code: 200,
      status: 1,
      message: 'Credential was updated',
      data: 'Credential was updated successfully.',
    };
  }
  async getPassword(userEmail: string): Promise<ResponseData<string>> {
    const Accpass = await this.accountCred.findOne({
      select: {
        password: true,
      },
      where: {
        email: userEmail,
      },
    });
    const password = Accpass.password;

    return {
      code: 200,
      status: 1,
      message: 'Get password',
      data: password,
    };
  }
}
