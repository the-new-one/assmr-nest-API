import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkEmailExists } from 'module/assmrModule';
import { Company } from 'src/entity/company/Company';
import { Account, User } from 'src/entity/signup/signup.entity';
import { UserSubscription } from 'src/entity/subscription/Subscription';
// import { UserSignupModel } from 'src/models/user/UserModel';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Account) private accountEntity: Repository<Account>,
    @InjectRepository(UserSubscription)
    private userSub: Repository<UserSubscription>,
    @InjectRepository(Company) private companyEntity: Repository<Company>,
  ) {}
  async createUser(userForm: any): Promise<ResponseData<[]>> {
    const {
      userType,
      subscriptionPlan,
      subscriptionExpirationDate,
      contactno,
      email,
    } = userForm;
    const userExists = await checkEmailExists(this.accountEntity, email);

    switch (userType) {
      case 'individual-user':
        const {
          firstname,
          middlename,
          lastname,
          gender,
          municipality,
          province,
          barangay,
          password,
        } = userForm;

        if (userExists) {
          return {
            code: 1,
            status: 1,
            message: 'User already exists',
            data: [],
          };
        }
        const passwordHashIndividualUser = await bcrypt.hash(password, 10);

        const user = await this.userEntity
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            firstname,
            middlename,
            lastname,
            contactno,
            gender,
            municipality,
            province,
            barangay,
            email,
          })
          .execute();

        this.accountEntity
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values({
            userId: user.raw.insertId,
            email,
            password: passwordHashIndividualUser,
          })
          .execute();

        this.userSub
          .createQueryBuilder()
          .insert()
          .into(UserSubscription)
          .values({
            userId: user.raw.insertId,
            maxNoToPost: 3,
            subscription_date: new Date(),
            userType: userType,
            isSubscribed: false,
          })
          .execute();

        break;
      case 'company':
        const {
          organizationName,
          companyType,
          branch,
          representative,
          municipalityValue,
          provinceValue,
          barangayValue,
          zipCode,
          website,
          datePickerDate,
        } = userForm;

        const passwordHashCompanyUser = await bcrypt.hash(organizationName, 10);

        if (userExists) {
          return {
            code: 1,
            status: 405,
            message: 'Company information already exists',
            data: [],
          };
        }
        const userCompany = await this.userEntity
          .createQueryBuilder('user')
          .insert()
          .into(User)
          .values({
            email,
            firstname: organizationName,
            middlename: organizationName,
            lastname: organizationName,
            contactno: contactno,
            gender: 'NA',
            municipality: municipalityValue,
            province: provinceValue,
            barangay: barangayValue,
          })
          .execute();

        const location = `${barangayValue}, ${provinceValue}, ${municipalityValue}`;

        this.accountEntity
          .createQueryBuilder('account')
          .insert()
          .into(Account)
          .values({
            userId: userCompany.raw.insertId,
            email,
            password: passwordHashCompanyUser, // what organizationName is the password
          })
          .execute();
        const registrationDate = new Date();
        // const expirationnDate = new Date();
        // expirationnDate.setMonth(registrationDate.getMonth() + 1);
        // const subscriptionExpiry = expirationnDate;

        this.companyEntity
          .createQueryBuilder('company')
          .insert()
          .into(Company)
          .values({
            userId: userCompany.raw.insertId,
            company_name: organizationName,
            company_type: companyType,
            company_branch: branch,
            company_location: location,
            company_representative: representative,
            company_establish_date: datePickerDate,
            branch: branch,
            isActive: 1,
            website: website,
            company_zipcode: zipCode,
          })
          .execute();
        this.userSub
          .createQueryBuilder('subscription')
          .insert()
          .into(UserSubscription)
          .values({
            userId: userCompany.raw.insertId,
            maxNoToPost: 1000,
            subscription_date: registrationDate,
            userType,
            isSubscribed: true,
            subscription_expiry: subscriptionExpirationDate,
            subscriptionPlan,
          })
          .execute();

        break;
      default:
        console.log('No userType');
    }

    return {
      code: 0,
      status: 200,
      message: `Your New ${
        userType === 'individual-user' ? 'user account' : 'company account'
      } was created.`,
      data: [],
    };
  }
}
